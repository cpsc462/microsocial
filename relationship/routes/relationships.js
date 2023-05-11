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
router.get("/counts", (req, res) => {
  const user_id = req.query.user_id;
  console.log({user_id})

  const stmt = db.prepare("SELECT count(*) as following_user_id FROM relationships WHERE following_user_id = ?");
  const following_user_id_counts = stmt.all(user_id);
  const following_user_id_count =  following_user_id_counts[0];
  const stmt2 = db.prepare("SELECT count(*) as how_many_following FROM relationships WHERE user_id = ?");
  const how_many_followings = stmt2.all(user_id);
  const how_many_following =  how_many_followings[0];
  const response = {
    following_user_id_count,
    how_many_following
  }
  res.json({ response });
});