// user sets their recovery email for their account

var express = require('express');
var router = express.Router();
module.exports.router = router;
var { db } = require('../db');

function validate_email(email) {
    var email_pattern = /^(?=.{1,32}$)[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,3}$/;
    return email_pattern.test(email); // check validity, test() returns true or false
  }  

/**
 * @swagger
 * /users/recovery:
 *   post:
 *     summary: Set (post) user recovery email address
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
 *               recovery:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully set recovery email address 
 *       400:
 *         description: Invalid
 */
router.post('/users/recovery', async (req, res) => {
    const { user_id, recovery } = req.body;
   
    if(!validate_email(recovery)) {
        res.status(400).json({ error: 'Email not valid, must be in the format name_1.2@domain.tld and may not exceed 32 characters, inclusive.' });
        return;
    }

    const query = db.prepare(
      `INSERT INTO recovery_email (user_id, recovery) VALUES(?, ?);`
    );
    query.run(user_id, recovery);
  
    res.status(201).json({ message: 'Successfully set recovery email address.' });
});

/**
 * @swagger
 * /users/recovery:
 *   put:
 *     summary: Update a recovery email address
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
 *               recovery:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully updated recovery email address
 *       400:
 *         description: Invalid input data
 */
router.put('/users/recovery', (req, res) => {
    const { user_id, recovery } = req.body;

    if(!validate_email(recovery)) {
        res.status(400).json({ error: 'Email not valid, must be in the format name_1.2@domain.tld and may not exceed 32 characters, inclusive.' });
        return;
    }

    const query = db.prepare(`UPDATE recovery_email SET recovery=? WHERE user_id=?`);
    const result = query.run(recovery, user_id).changes;
  
    if (result > 0) 
        res.status(204).json({ message: 'Successfully updated recovery email address' });
    else 
        res.status(400).json({ error: 'User ID not found' });
});

/**
 * @swagger
 * /user/recovery/{user_id}:
 *   get:
 *     summary: Get user info including recovery email address from ID
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
 *         description: Recovery email address type not found.
 */
router.get('/user/recovery/:user_id', (req, res) => {
    const { user_id } = req.params;
    if (!user_id) 
        return res.status(400).json({ error: "User ID not found" });

    const query = db.prepare(`SELECT * FROM recovery_email WHERE user_id=?`);
    const result = query.all(user_id);
  
    return res.status(200).json({ result: result });
});