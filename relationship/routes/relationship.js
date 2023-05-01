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
 *         description: Relationship Data
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
 * @swagger
 * /relationship/{id}:
 *   put:
 *     summary: Update Relationship
 *     description: Replace all* fields for one Relationship, by id.
 *     operationId: UpdateRelationshipById
 *     tags: [Relationships API]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the relationship.
 *         schema:
 *            type: integer
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UpdatingRelationship'
 *     responses:
 *       200:
 *         description: Relationship Updated (all fields)
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/RetrievedRelationship'
 *       400:
 *          description: Invalid update. (Contents not acceptable)
 *       404:
 *          description: No such Relationship
 *          examples: [ "Not Found", "No such relationship" ]
 */
router.put("/relationship/:id", (req, res) => {
  const id = parseInt(req.params.id);

  errors = validate.RelationshipId(id, "{id}");
  if (errors.length) {
    res.json(errors);
    res.statusMessage = "No such relationship";
    res.status(StatusCodes.NOT_FOUND).end();
    return;
  }

  const updatedRelationship = req.body;

  errors = validate.RelationshipId(updatedRelationship, "{body}");
  if (errors.length) {
    res.json(errors);
    res.statusMessage = "Invalid update";
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).end();
    return;
  }
  
  const stmt = db.prepare(`UPDATE relationships SET user_id=?, following_user_id=? WHERE id=?`);

  try {
    info = stmt.run([updatedRelationship.name, updatedRelationship.password, id]);
    if (info.changes < 1) {
      console.log("update error1: ", { err, info, relationship });
      res.statusMessage = "Account update failed.";
      res.status(StatusCodes.BAD_REQUEST).end();
      return;
    }
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      res.statusMessage = "Account with name already exists";
      res.status(StatusCodes.BAD_REQUEST).end();
      return;
    }
    console.log("update error2: ", { err, info, relationship });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    return;
  }

  res.redirect(`${id}`);
});

/**
 * @swagger
 * /relationship/{id}:
 *   patch:
 *     summary: (Partially) update Relationship fields
 *     description: Replace any submitted fields for one Relationship, by id.
 *     operationId: PatchRelationshipById
 *     tags: [Relationships API]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the relationship.
 *         schema:
 *            type: integer
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/PatchingRelationship'
 *     responses:
 *       200:
 *         description: Relationship Updated (submitted fields only, but all fields returned)
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/RetrievedRelationship'
 *       400:
 *          description: Invalid update. (Contents not acceptable)
 *       404:
 *          description: Relationship not found
 *          examples: [ "Not Found", "No such relationship" ]
 */
router.patch("/relationship/:id", (req, res) => {
  const id = parseInt(req.params.id);

  errors = validate.RelationshipId(id, "{id}");
  if (errors.length) {
    res.json(errors);
    res.statusMessage = "No such relationship";
    res.status(StatusCodes.NOT_FOUND).end();
    return;
  }

  const updatedRelationship = req.body;

  errors = validate.RelationshipId(updatedRelationship, "{body}");
  if (errors.length) {
    res.json(errors);
    res.statusMessage = "Invalid update";
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).end();
    return;
  }

  var info;
  try {
    updateClauses = [];
    updateParams = [];

    if ("name" in updatedRelationship) {
      updateClauses.push("name = ?");
      updateParams.push(updatedRelationship.name);
    }

    if ("password" in updatedRelationship) {
      updateClauses.push("password = ?");
      updateParams.push(updatedRelationship.password);
    }

    const stmt = db.prepare(
      `UPDATE relationships SET ${updateClauses.join(", ")} WHERE id=?`
    );

    info = stmt.run([...updateParams, id]);
    if (info.changes < 1) {
      res.statusMessage = "No such relationship/Error";
      res.status(StatusCodes.NOT_FOUND).end();
      return;
    }
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      res.statusMessage = "Account with name already exists";
      res.status(StatusCodes.BAD_REQUEST).end();
      return;
    }
    console.log("update error: ", { err, updatedRelationship });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    return;
  }

  res.redirect(`${id}`);
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
 *            type: $ref: '#/components/schemas/RelationshipId'
 *     responses:
 *       204:
 *         description: Relationship Deleted
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

  const stmt = db.prepare("DELETE FROM relationships where id = ?");

  info = stmt.run([id]);
  if (info.changes < 1) {
    res.statusMessage = "No such relationship";
    res.status(StatusCodes.NOT_FOUND).end();
    return;
  }
  res.status(StatusCodes.NO_CONTENT).end();
});
