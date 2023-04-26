import express from 'express'

const router = express.Router()
/**
 * @swagger
 * /content/comments:
 *   get:
 *     summary: Create a new notification
 *     tags: [Notification API]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', (req, res) => {res.send("TEST")})

export default router