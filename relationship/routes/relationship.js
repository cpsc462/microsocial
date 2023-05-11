const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require("http-status-codes");
var express = require("express");


var router = express.Router();
module.exports.router = router;

const { uri } = require("../common");
const { db } = require("../db");
const { validate } = require("../utils/schema-validation");

/**
 * @swagger
 * /relationship/{id}:
 *   get:
 *     summary: Retrieve a Relationship
 *     description: Retrieve one Relationship by id.
 *     operationId: GetRelationshipById
 *     tags: [Relationships API]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: relationship id
 *         required: true
 *         schema:
 *            $ref: '#/components/schemas/RelationshipId'
 *     responses:
 *       200:
 *         description: Success retrived relationship
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RetrievedRelationship'
 *       404:
 *         description: No such Relationship
 *         examples: [ "Not Found", "No such relationship" ]
 */
router.get("/relationship/:id", (req, res) => {
  const id = parseInt(req.params.id);

  errors = validate.RelationshipId(id, "{id}");
  if (errors.length) {
    res.json(errors);
    res.statusMessage = "No such relationship";
    res.status(StatusCodes.NOT_FOUND).end();
    return;
  }

  const stmt = db.prepare("SELECT id,user_id, following_user_id FROM relationships where id = ?");
  relationships = stmt.all([id]);

  if (relationships.length < 1) {
    res.statusMessage = "No such relationship";
    res.status(StatusCodes.NOT_FOUND).end();
    return;
  }

  relationship = relationships[0];
  relationship.uri = uri(`/relationship/${relationship.id}`);
  res.json(relationship);
});

/**
/**
 * @swagger
 * /relationship/{id}:
 *   delete:
 *     summary: Delete Relationship
 *     description: Delete this relationship from the service
 *     operationId: DeleteRelationshipById
 *     tags: [Relationships API]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the relationship.
 *         schema:
 *            type: integer
 *     responses:
 *       204:
 *         description: Relationship Deleted
 *       304:
 *         description: User Tried deleting relationship they did not own
 *       404:
 *          description: No such Relationship
 *          examples: [ "Not Found", "No such relationship" ]
 */
router.delete("/relationship/:id", (req, res) => {
  const id = parseInt(req.params.id);

  errors = validate.RelationshipId(id, "{id}");
  if (errors.length) {
    res.json(errors);
    res.statusMessage = "No such relationship";
    res.status(StatusCodes.NOT_FOUND).end();
    return;
  }
  //TODO: check if user owns the relationship before it is deleted and if they do not own it, return 304


  const stmt = db.prepare("DELETE FROM relationships where id = ?");

  info = stmt.run([id]);
  if (info.changes < 1) {
    res.statusMessage = "No such relationship";
    res.status(StatusCodes.NOT_FOUND).end();
    return;
  }
  res.status(StatusCodes.NO_CONTENT).end();
});
/**
 * @swagger
 * /relationships:
 *   post:
 *     summary: Create Relationship
 *     description: Create a new Relationship
 *     operationId: CreateRelationship
 *     tags: [Relationships API]
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreatingRelationship'
 *     responses:
 *       201:
 *         description: Relationship Created
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/RetrievedRelationship'
 *         links:
 *            'Retrieving relationships':
 *              operationId: GetRelationshipById
 *              parameters:
 *                id: '$response.body#/id'
 *              description: >
 *                The `id` value returned in the response can be used as
 *                the `id` parameter in `GET /relationship/{id}`.
 *            'Deleting a Relationship':
 *              operationId: DeleteRelationshipById
 *              parameters:
 *                id: '$response.body#/id'
 *              description: >
 *                The `id` value returned in the response can be used as
 *                the `id` parameter in `DEL /relationship/{id}`.
 *       400:
 *          description: Relationship data is not acceptable
 *          examples: [ "Invalid relationship id", 
 *                "Invalid follower id", 
 *                "Invalid user_following_id",
 *                "Relationships with that id already exists" ]
 */
router.post("/relationships", (req, res) => {
  const relationship = req.body;

  errors = validate.CreatingRelationship(relationship, "{body}");
  if (errors.length) {
    res.json(errors);
    res.statusMessage = "Invalid data";
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).end();
    return;
  }

  const stmt = db.prepare(`INSERT INTO relationships (user_id, following_user_id)
                 VALUES (?, ?)`);

  try {
    info = stmt.run([relationship.user_id, relationship.following_user_id]);
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      res.statusMessage = "Relationship already exists";
      res.status(StatusCodes.BAD_REQUEST).end();
      return;
    }
    console.log("insert error: ", { err, info, user });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    return;
  }

  // we're just returning what they submitted. but we never return the password
  relationship.id = info.lastInsertRowid;
  relationship.uri = uri(`/relationship/${relationship.id}`);

  res.set('Location', relationship.uri);
  res.type('json');
  res.json(relationship);
  res.status(StatusCodes.CREATED);
});