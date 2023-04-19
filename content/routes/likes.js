import express from 'express'
import { likeComment, likePost, getCommentLike, getPostLike } from '../controllers/likes.js'

const router = express.Router()

/**
 * @swagger
 * /content/likes/post:
 *   post:
 *     summary: Like a Post!
 *     tags: [Content API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               post_id:
 *                 type: integer
 *               username:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Invalid input data
 */
router.post('/post', likePost)

/**
 * @swagger
 * /content/likes/comment:
 *   post:
 *     summary: Like a Comment!
 *     tags: [Content API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment_id:
 *                 type: integer
 *               username:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Invalid input data
 */
router.post('/comment', likeComment)

/**
 * @swagger
 * /content/likes/post/{post_id}:
 *   get:
 *     summary: Get all like from a post!
 *     parameters:
 *       - name: post_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     tags: [Content API]
 *     responses:
 *       200:
 *         description: Post route text
 */
router.get('/post/:post_id', getPostLike)

/**
 * @swagger
 * /content/likes/comment/{comment_id}:
 *   get:
 *     summary: Get all like from a comment!
 *     parameters:
 *       - name: comment_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     tags: [Content API]
 *     responses:
 *       200:
 *         description: Post route text
 */
router.get('/comment/:comment_id', getCommentLike)
export default router