// options: none, auth, call, sms

var express = require('express');
var router = express.Router();
module.exports.router = router;
var { db } = require('../db');

function validate_2fa_option(two_factor_input){
    let valid = false;

    if(two_factor_input.toLowerCase() == "sms"
       || two_factor_input.toLowerCase() == "auth"
       || two_factor_input.toLowerCase() == "call"
       || two_factor_input.toLowerCase() == "none")
       valid = true;

    return valid;
}

/**
 * @swagger
 * /users/2FA:
 *   post:
 *     summary: Set (post) preferred 2FA method
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
 *               two_factor_type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully set 2FA method
 *       400:
 *         description: Invalid
 */
router.post('/users/2FA', async (req, res) => {
    const { user_id, two_factor_type } = req.body;

    if(!validate_2fa_option(two_factor_type)) {// if not valid, returns false -> exits
        res.status(400).json({ error: 'Not a valid 2FA method. Must be either "SMS", "auth", "call", or "none" (not case-sensitive).' });
        return;
    }
  
    const query = db.prepare(
      `INSERT INTO user_2fa (user_id, two_factor_type) VALUES(?, ?);`
    );
    query.run(user_id, two_factor_type);

    res.status(201).json({ message: 'Successfully set 2FA method.' });
});

/**
 * @swagger
 * /users/2FA:
 *   put:
 *     summary: Update a 2FA!
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
 *               two_factor_type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully updated 2FA method
 *       400:
 *         description: Invalid input data
 */
router.put('/users/2FA', (req, res) => {
    const { user_id, two_factor_type } = req.body;

    if(!validate_2fa_option(two_factor_type)) {// if not valid, returns false -> exits
        res.status(400).json({ error: 'Not a valid 2FA method. Must be either "SMS", "auth", "call", or "none" (not case-sensitive).' });
        return;
    }

    const query = db.prepare(`UPDATE user_2fa SET two_factor_type=? WHERE user_id=?`);
    const result = query.run(two_factor_type, user_id).changes;
  
    if (result > 0) 
        res.status(204).json({ message: 'Successfully updated 2FA method' });
    else 
        res.status(400).json({ error: 'User ID not found' });
});

/**
 * @swagger
 * /user/2FA/{user_id}:
 *   get:
 *     summary: Get two factor authentication type!
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
 *         description: 2FA type not found.
 */
router.get('/user/2FA/:user_id', (req, res) => {
    const { user_id } = req.params;
    if (!user_id) 
        return res.status(400).json({ error: "User ID not found" });

    const query = db.prepare(`SELECT * FROM user_2fa WHERE user_id=?`);
    const result = query.all(user_id);
  
    return res.status(200).json({ result: result });
});