// user sets their email for their account

var express = require('express');
var router = express.Router();
module.exports.router = router;
var { db } = require('../db');

/**
 * @swagger
 * /users/email:
 *   post:
 *     summary: Set (post) user email address
 *     tags: [Users API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully set email address 
 *       400:
 *         description: Invalid
 */
router.post('/users/email', async (req, res) => {
    const { user_id, email } = req.body;
    const query = db.prepare(
      `INSERT INTO email_address (user_id, email) VALUES(?, ?);`
    );
    query.run(user_id, email);
  
    res.status(201).json({ message: 'Successfully set email address.' });
});

/**
 * @swagger
 * /users/email:
 *   put:
 *     summary: Update a email address
 *     tags: [Users API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully updated email address
 *       400:
 *         description: Invalid input data
 */
router.put('/users/email', (req, res) => {
    const { user_id, email } = req.body;
    const query = db.prepare(`UPDATE email_address SET email=? WHERE user_id=?`);
    const result = query.run(email, user_id).changes;
  
    if (result > 0) 
        res.status(204).json({ message: 'Successfully updated email address' });
    else 
        res.status(400).json({ error: 'User ID not found' });
});

/**
 * @swagger
 * /user/email/{user_id}:
 *   get:
 *     summary: Get user info including email address from ID
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     tags: [Users API]
 *     responses:
 *       200:
 *         description: Get two factor authentication type
 *       404:
 *         description: Email address type not found.
 */
router.get('/user/email/:user_id', (req, res) => {
    const { user_id } = req.params;
    if (!user_id) 
        return res.status(400).json({ error: "User ID not found" });

    const query = db.prepare(`SELECT * FROM email_address WHERE user_id=?`);
    const result = query.all(user_id);
  
    return res.status(200).json({ result: result });
});