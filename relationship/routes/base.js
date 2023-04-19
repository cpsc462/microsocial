var express = require('express');
var router = express.Router();
module.exports.router = router;

/**
 * @swagger
 * /:
 *   get:
 *     summary: Hello, World!
 *     description: Base page. Just says hello.
 *     operationId: base
 *     tags: [Users API]
 *     responses:
 *       200:
 *         description: Boring Text
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.get("/", (req, res) => {
  res.type('text/plain');
  res.send("your own!");
});

