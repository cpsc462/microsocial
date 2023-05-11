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
 *     tags: [Relationships API]
 *     responses:
 *       200:
 *         description: Success - 0 or more relationships returned
 *         content:
 *           application/json:
 *             schema:
 *                type: array
 *                items:
 *                   $ref: '#/components/schemas/RetrievedRelationship'
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

