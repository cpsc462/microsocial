const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require('http-status-codes');
var express = require('express');
var router = express.Router();
module.exports.router = router;

const {uri} = require("../common");
const {db} = require("../db");
const { validate } = require("../utils/schema-validation");


/**
 * @swagger
 * /relationships:
 *   get:
 *     summary: Retrieve relationships
 *     description: Retrieve relationships, optionally filtering by query params
 *     operationId: Get relationships
 *     tags: [relationships API]
 *     responses:
 *       200:
 *         description: Success - 0 or more relationships returned
 *         content:
 *           application/json:
 *             schema:
 *                type: array
 *                items:
 *                   $ref: '#/components/schemas/RetrievedUser'
 *       400:
 *         description: Invalid Query
 */
router.get("/relationships", (req, res) => {
  const stmt = db.prepare("SELECT id,user_id, following_user_id FROM relationships");
  relationships = stmt.all();
  relationships.forEach((relationship) => {
    relationship.uri = uri(`/relationship/${relationship.id}`);
  });
  res.json({ relationships });
});

/**
 * @swagger
 * /relationships:
 *   post:
 *     summary: Create User
 *     description: Create a new User
 *     operationId: CreateUser
 *     tags: [relationships API]
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
 *            'Retrieving relationships':
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
router.post("/relationships", (req, res) => {
  const user = req.body;

  errors = validate.CreatingUser(user,"{body}");
  if (errors.length) {
    res.json(errors);
    res.statusMessage = "Invalid data";
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).end();
    return;
  }

  const stmt = db.prepare(`INSERT INTO relationships (name, password)
                 VALUES (?, ?)`);

  try {
    info = stmt.run([user.name, user.password]);
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      res.statusMessage = "Account already exists";
      res.status(StatusCodes.BAD_REQUEST).end();
      return;
    }
    console.log("insert error: ", { err, info, user });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    return;
  }

  // we're just returning what they submitted. but we never return the password
  user.id = info.lastInsertRowid;
  user.uri = uri(`/user/${user.id}`);
  delete user.password;

  res.set('Location',user.uri);
  res.type('json');
  res.json(user);
  res.status(StatusCodes.CREATED);
});
