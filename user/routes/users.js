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

const { uri, fetch } = require('../common')
const { db } = require('../db')
const { validate } = require('../utils/schema-validation')
const { regexpCode } = require('ajv/dist/compile/codegen')

// convert what they type in the "sort=" to an appropriate column name
function colspec_to_orderby (spec) {
  // not worried about match failing because we've already validated this
  match = spec.match(/^(\w+)([+-]?)$/)
  column_name = match[1]
  clause = column_name
  if (match[2] === '-') {
    clause += ' DESC'
  }
  return clause
}

function deleteExpiredResultSets () {
  expired_results_as_of = new Date()
  expired_results_as_of.setSeconds(
    expired_results_as_of.getSeconds() -
      ms(process.env.CURSOR_EXPIRATION) / 1000
  )
  const expire_stmt = db.prepare(
    'DELETE FROM users_result_sets WHERE set_results_as_of < ?'
  )
  expire_stmt.run(expired_results_as_of.toISOString())
}

function deleteResultSetsBySessionId (session_id) {
  const del_stmt = db.prepare(
    'DELETE FROM users_result_sets WHERE set_session_id = ?'
  )
  del_stmt.run(session_id)
}

// all the terms we might see in a URL
const terms = [
  { term: 'start_at', type: 'int' },
  { term: 'page_size', type: 'int' },
  { term: 'id_GE', clause: 'id >= ?', type: 'int' },
  { term: 'id_GT', clause: 'id > ?', type: 'int' },
  { term: 'id', clause: 'id = ?', type: 'int' },
  { term: 'id_EQ', clause: 'id = ?', type: 'int' },
  { term: 'id_NE', clause: 'id != ?', type: 'int', inverted: true },
  { term: 'id_LE', clause: 'id <= ?', type: 'int' },
  { term: 'id_LT', clause: 'id < ?', type: 'int' },
  { term: 'name_GE', clause: 'name >= ?' },
  { term: 'name_GT', clause: 'name > ?' },
  { term: 'name_NE', clause: 'name != ?', inverted: true },
  { term: 'name', clause: 'name = ?', inverted: false },
  { term: 'name_EQ', clause: 'name = ?', inverted: false },
  { term: 'name_LE', clause: 'name <= ?' },
  { term: 'name_LT', clause: 'name < ?' }
]

// Which of all the *query* (where-clause) terms are present?
function any_term_in_request (req, terms) {
  terms.forEach((t) => {
    if (t.term in req.query && 'clause' in t) {
      return true
    }
  })
  return false
}

function session_id_present (req) {
  return (
    'session' in req.query || (req.auth !== undefined && 'session' in req.auth)
  )
}

// anything other than start_at/page_size means new query
function should_create_new_result_set (req) {
  if (!session_id_present(req)) {
    return true
  }
  return any_term_in_request(req, terms) || 'sort' in req.query
}

// req.query comes in as strings. but we need them to BE integers to validate
function to_int (x) {
  as_int = parseInt(x)
  if (as_int === NaN) {
    return x
  }
  return as_int
}

function sort_clause_SQL (req) {
  if (!('sort' in req.query)) {
    return 'id'
  }

  options = req.query.sort.split(',')

  sort_clause = options.map((x) => colspec_to_orderby(x)).join(',')

  return sort_clause
}

// do we have a session id? if so return it. otherwise create one
function query_session_id (req) {
  const authenticated = req.auth !== undefined && 'session' in req.auth
  session_id = uuidv4()
  if ('session' in req.query) {
    session_id = req.query.session
  }
  if (authenticated) {
    session_id = req.auth.session
  }
  return session_id
}

// populate a users_results_set for this session id
function create_new_result_set (req, session_id) {
  now = new Date().toISOString()

  where_clauses = []
  // hardcoding user_id for now
  where_vals = [1, now, session_id]

  terms.filter( x => ('clause' in x))
  .forEach((x) => {
    const { term, clause, inverted } = x
    if (term in req.query) {
      if (Array.isArray(req.query[term])) {
        const conjunction = inverted ? ' AND ' : ' OR '
        clauses =
          '(' +
          Array(req.query[term].length).fill(clause).join(conjunction) +
          ')'
        // console.log({term:clauses,vals:req.query[term]})
        where_clauses.push(clauses)
        where_vals = where_vals.concat(req.query[term])
      } else {
        // console.log({term:clause,val:req.query[term]})
        where_clauses.push(clause)
        where_vals.push(req.query[term])
      }
    }
  })

  where_clause = where_clauses.join(' AND ')
  if (where_clause !== '') {
    where_clause = ' WHERE ' + where_clause
  }

  const sort_clause = sort_clause_SQL(req)
  const base =
    `INSERT INTO users_result_sets ` +
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
  console.log({ result_sql, where_vals, queryparams: req.query })
  const result_set_stmt = db.prepare(result_sql)


  // creates result rows
  result_set_stmt.run(where_vals)
}

// once the result set is populated, we return out of that (not doing the query again)
function respond_from_existing_result_set (req, res, session_id) {
  start_at = 'start_at' in req.query ? req.query.start_at : 1
  page_size =
    'page_size' in req.query
      ? req.query.page_size
      : process.env.DEFAULT_PAGE_SIZE

  // pull from results, not fresh query
  const get_users_from_set = `SELECT id, name, versionkey, set_rownum FROM users_result_sets WHERE set_session_id = ? ORDER BY set_rownum LIMIT ? OFFSET ?`
  const get_users_from_set_stmt = db.prepare(get_users_from_set)

  users = get_users_from_set_stmt.all(session_id, page_size, start_at)

  // make sure this is present and accurate -- not gonna trust what they passed in
  const row_count_map = db.get(
    'SELECT COUNT(*) AS row_count FROM users_result_sets WHERE set_session_id = ?',
    [session_id]
  )

  // post-process users...
  users.forEach((user) => {
    user.uri = uri(`/user/${user.id}`)

    // we needed this row to make order by/limit/offset work correctly. but do not show user.
    delete user.set_rownum
  })

  const response = {
    users: users,
    start_at,
    page_size,
    row_count: row_count_map.row_count
  }

  // we don't add the session id to the results if it is stored in the auth token
  const authenticated = req.auth !== undefined && 'session' in req.auth
  if (!authenticated) {
    response.session = session_id
  }

  res.json(response)
}

function adjust_params_for_validation (req) {
  // have to do this (rewrite strings to ints) to enable validation of integers
  terms
    .filter((x) => 'type' in x && x.type === 'int')
    .map((x) => x.term)
    .filter((x) => x in req.query)
    .forEach((x) => {
      if (Array.isArray(req.query[x])) {
        req.query[x] = req.query[x].map((y) => to_int(y))
      } else {
        req.query[x] = to_int(req.query[x])
      }
    })
}

function are_params_valid (req, res) {
  // extend filteringspec to disallow arrays for <things>
  // include session id if it's in the query
  errors = validate.UserFilteringSpec(req.query, '{query param}')
  if (errors.length) {
    res.json(errors)
    res.statusMessage = 'Invalid data'
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).end()
    return false
  }

  if ('sort' in req.query && req.query.sort.length > 0) {
    options = req.query.sort.split(',')
    errors = validate.UserSortingSpec(options, '{sort param}')
    if (errors.length) {
      res.json(errors)
      res.statusMessage = 'Invalid data'
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).end()
      return false
    }
  }
  return true
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
  // FIXME: arguably we should just do this perodically, but this is easier for now
  deleteExpiredResultSets()

  adjust_params_for_validation(req)
  if (!are_params_valid(req, res)) {
    return
  }
  session_id = query_session_id(req)
  if (should_create_new_result_set(req)) {
    deleteResultSetsBySessionId(session_id)
    create_new_result_set(req, session_id)
  }
  respond_from_existing_result_set(req, res, session_id)
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
