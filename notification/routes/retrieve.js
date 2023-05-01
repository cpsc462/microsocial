// Create a new notification: POST /notifications

import express from 'express'
import {db} from '../db.js'

const router = express.Router()

// Path because of folder-based endpoints
// Current path is notification/retrieve

/**
 * @swagger
 * /notification/retrieve/{receiver_username}:
 *   get:
 *     summary: Get notification from a specific user.
 *     parameters:
 *       - name: receiver_username
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     tags: [Notification API]
 *     responses:
 *       200:
 *         description: Post route text
 */

router.get('/:receiver_username', (req, res) => {
    const { receiver_username } = req.params
    const q = db.prepare('SELECT * FROM notification WHERE receiver_username=? AND read=?')
    const result = q.all(receiver_username, 0)
    return res.status(200).json({result: result})
})


export default router