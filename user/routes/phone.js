// user sets their phone number for their account

var express = require('express');
var router = express.Router();
module.exports.router = router;
var { db } = require('../db');

/**
 * @swagger
 * /users/phone:
 *   post:
 *     summary: Set (post) user phone number
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
 *               phone_number:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully set phone number 
 *       400:
 *         description: Invalid
 */
router.post('/users/phone', async (req, res) => {
    const { user_id, phone_number } = req.body;
    const query = db.prepare(
      `INSERT INTO phone (user_id, phone_number) VALUES(?, ?);`
    );
    query.run(user_id, phone_number);
  
    res.status(201).json({ message: 'Successfully set phone number.' });
});

/**
 * @swagger
 * /users/phone:
 *   put:
 *     summary: Update a phone number
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
 *               phone_number:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully updated phone number
 *       400:
 *         description: Invalid input data
 */
router.put('/users/phone', (req, res) => {
    const { user_id, phone_number } = req.body;
    const query = db.prepare(`UPDATE phone SET phone_number=? WHERE user_id=?`);
    const result = query.run(phone_number, user_id).changes;
  
    if (result > 0) 
        res.status(204).json({ message: 'Successfully updated phone number' });
    else 
        res.status(400).json({ error: 'User ID not found' });
});

/**
 * @swagger
 * /user/phone/{user_id}:
 *   get:
 *     summary: Get user info including phone number from ID
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
 *         description: phone number type not found.
 */
router.get('/user/phone/:user_id', (req, res) => {
    const { user_id } = req.params;
    if (!user_id) 
        return res.status(400).json({ error: "User ID not found" });

    const query = db.prepare(`SELECT * FROM phone WHERE user_id=?`);
    const result = query.all(user_id);
  
    return res.status(200).json({ result: result });
});