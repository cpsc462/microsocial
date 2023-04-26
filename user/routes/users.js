const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode
} = require('http-status-codes')
var express = require('express')
var ms = require('ms')
const { v4: uuidv4 } = require('uuid')


var router = express.Router()
module.exports.router = router

const { uri,fetch } = require('../common')
const { db } = require('../db')
const { validate } = require('../utils/schema-validation')

function colspec_to_orderby(spec) {
  // not worried about match failing because we've already validated this
  match = spec.match(/^(\w+)([+-]?)$/)
  column_name = match[1]
  clause = column_name
  if (match[2] === '-') {
    clause += ' DESC'
  }
  return clause
}

function deleteExpiredResultSets() {
  expired_results_as_of = new Date;
  expired_results_as_of.setSeconds(
    expired_results_as_of.getSeconds() - ms(process.env.CURSOR_EXPIRATION) / 1000
  )
  const expire_stmt = db.prepare(
    'DELETE FROM users_result_sets WHERE set_results_as_of < ?'
  )
  expire_stmt.run(expired_results_as_of.toISOString())
}

function deleteResultSetsBySessionId(session_id) {
  const del_stmt = db.prepare(
    'DELETE FROM users_result_sets WHERE set_session_id = ?'
  )
  del_stmt.run(session_id)
}

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve Users
 *     description: Retrieve Users, optionally filtering by query params
 *     operationId: GetUsers
 *     tags: [Users API]
 *     responses:
 *       200:
 *         description: Success - 0 or more Users returned
 *         content:
 *           application/json:
 *             schema:
 *                type: array
 *                items:
 *                   $ref: '#/components/schemas/RetrievedUser'
 *       400:
 *         description: Invalid Query
 */
router.get('/users', async (req, res) => {
  now = new Date().toISOString()

  console.log({"a":1});

  session_id = uuidv4()
  if ( 'session' in req.query ) {
    session_id = req.query.session
  }
  if ( req.auth !== undefined && 'session' in req.auth ){
     session_id = req.auth.session
  }

  // FIXME: arguably we should just do this perodically, but this is easier for now
  deleteExpiredResultSets();

  to_int = (x) => { 
    as_int = parseInt(x)
    if (as_int === NaN) {
      return x 
    }
    return as_int
  }

  // have to do this (rewrite strings to ints) to enable validation of integers
  ['start_at','page_size','id_GE','id_LE','id'].forEach( x => {
    if (x in req.query) {
      if (Array.isArray(req.query[x])) {
         req.query[x].map( (y) => { to_int(y) } )
      } else {
         req.query[x] = to_int(req.query[x]);
      }
    }
  });

  if ( 'start_at' in req.query ) {
    start_at = req.query.start_at
    page_size = 'page_size' in req.query? 
      req.query.page_size : 
      process.env.DEFAULT_PAGE_SIZE

    // pull from results, not fresh query
    const get_users_from_set = `SELECT id, name, versionkey, set_rownum FROM users_result_sets WHERE set_session_id = ? ORDER BY set_rownum LIMIT ? OFFSET ?`
    const get_users_from_set_stmt = db.prepare(get_users_from_set)

    users = get_users_from_set_stmt.all(session_id, page_size, start_at)
    users.forEach((user) => {
      user.uri = uri(`/user/${user.id}`)
      // we needed this row to make order by/limit/offset work correctly. but do not show user.
      delete user.set_rownum
    })
    res.json({ users: users, start_at, page_size })
    return;
  }

  errors = validate.UserFilteringSpec(req.query, '{query param}')
  if (errors.length) {
    res.json(errors)
    res.statusMessage = 'Invalid data'
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).end()
    return
  }

  where_clauses = []
  // hardcoding user_id for now
  where_vals = [1, now, session_id];

  const terms = [ 
    {term:'id_GE', clause:'id >= ?'},
    {term:'id', clause:'id = ?'},
    {term:'id_EQ', clause:'id = ?'},
    {term:'id_NE', clause:'id != ?', inverted:true},
    {term:'id_LE', clause:'id <= ?'},
    {term:'name_GE', clause:'name >= ?'},
    {term:'name_NE', clause:'name != ?', inverted:true},
    {term:'name', clause:'name = ?',inverted:false},
    {term:'name_EQ', clause:'name = ?',inverted:false},
    {term:'name_LE', clause:'name <= ?'}
  ]
  terms.forEach( x => {
    const {term,clause,inverted} = x
    if (term in req.query) {
      if ( (Array.isArray(req.query[term])) ) {
        const conjunction = inverted? " AND " : " OR "
        clauses = "(" + Array(req.query[term].length).fill(clause).join(conjunction) + ")"
        // console.log({term:clauses,vals:req.query[term]})
        where_clauses.push(clauses);
        where_vals = where_vals.concat(req.query[term])
      } else {
        // console.log({term:clause,val:req.query[term]})
        where_clauses.push(clause);
        where_vals.push(req.query[term]);
      }
    }
  })

  where_clause = where_clauses.join(' AND ')
  if (where_clause !== '') {
    where_clause = ' WHERE ' + where_clause
  }

  // console.log({ foo: validate.UserSortOption("foo", "{foo}"),
  //     id: validate.UserSortOption("id", "{id}"),
  //     empty: validate.UserSortOption("", "{foo}") })

  // console.log({
  //   foo: validate.UserSortingSpec(['foo'], '{foo}'),
  //   id: validate.UserSortingSpec(['id'], '{id}'),
  //   empty: validate.UserSortingSpec([], '{}'),
  // })

  sort_clause = 'id'
  if ('sort' in req.query && req.query.sort.length > 0) {
    options = req.query.sort.split(',')
    errors = validate.UserSortingSpec(options, '{sort param}')
    if (errors.length) {
      res.json(errors)
      res.statusMessage = 'Invalid data'
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).end()
      return
    }

    //console.log({ str: req.query.sort, options, sort_clause })
    sort_clause = options.map((x) => colspec_to_orderby(x)).join(',')

    //console.log({ sort_clause, from: req.query.sort })
  }
  deleteResultSetsBySessionId(session_id);

  const base = `INSERT INTO users_result_sets ` +
          `(set_querying_user_id, set_results_as_of, set_session_id, ` +
          `set_rownum, ` +
          `id, name, versionkey) ` +
        `SELECT ` +
          `?,?,?,` +
          `ROW_NUMBER() OVER (ORDER BY ${sort_clause}),` +
          `id,name,versionkey ` +
        `FROM ` +
          `users`

  const result_sql = base + where_clause
  const result_set_stmt = db.prepare(result_sql)

  console.log({result_sql, where_vals, queryparams:req.query })

  // creates result rows
  result_set_stmt.run(where_vals)

  const row_count_map = db.get("SELECT COUNT(*) AS row_count FROM users_result_sets WHERE set_session_id = ?",[session_id])
  const row_count = row_count_map.row_count

  get_vals = [session_id]
  get_users_from_set = `SELECT id, name, versionkey, set_rownum FROM users_result_sets WHERE set_session_id = ? ORDER BY set_rownum`
  if ('page_size' in req.query) {
      get_vals.push( req.query.page_size );
      get_users_from_set += " LIMIT ?"
  }
  const get_users_from_set_stmt = db.prepare(get_users_from_set)

  users = get_users_from_set_stmt.all(get_vals)
  users.forEach((user) => {
    user.uri = uri(`/user/${user.id}`)
    delete user.set_rownum
  })

  res.json({ session: session_id, row_count, users })
})

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create User
 *     description: Create a new User
 *     operationId: CreateUser
 *     tags: [Users API]
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreatingUser'
 *     responses:
 *       201:
 *         description: User Created
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/RetrievedUser'
 *         links:
 *            'Retrieving Users':
 *              operationId: GetUserById
 *              parameters:
 *                id: '$response.body#/id'
 *              description: >
 *                The `id` value returned in the response can be used as
 *                the `id` parameter in `GET /user/{id}`.
 *            'Updating a User':
 *              operationId: UpdateUserById
 *              parameters:
 *                id: '$response.body#/id'
 *              description: >
 *                The `id` value returned in the response can be used as
 *                the `id` parameter in `PUT /user/{id}`.
 *            'Deleting a User':
 *              operationId: DeleteUserById
 *              parameters:
 *                id: '$response.body#/id'
 *              description: >
 *                The `id` value returned in the response can be used as
 *                the `id` parameter in `DEL /user/{id}`.
 *       400:
 *          description: User data is not acceptable
 *          examples: [ "Invalid user name",
 *                "Invalid password",
 *                "User with that name already exists" ]
 */
router.post('/users', (req, res) => {
  const user = req.body

  errors = validate.CreatingUser(user, '{body}')
  if (errors.length) {
    res.json(errors)
    res.statusMessage = 'Invalid data'
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).end()
    return
  }

  const stmt = db.prepare(`INSERT INTO users (name, password)
                 VALUES (?, ?)`)

  try {
    info = stmt.run([user.name, user.password])
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.statusMessage = 'Account already exists'
      res.status(StatusCodes.BAD_REQUEST).end()
      return
    }
    console.log('insert error: ', { err, info, user })
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end()
    return
  }

  // we're just returning what they submitted. but we never return the password
  user.id = info.lastInsertRowid
  user.uri = uri(`/user/${user.id}`)
  delete user.password

  res.set('Location', user.uri)
  res.type('json')
  res.json(user)
  res.status(StatusCodes.CREATED)
})
