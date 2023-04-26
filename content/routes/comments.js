import express from 'express'
import { addComment, deleteCommentById, getAllComments, getCommentById, getCommentsByPostId, getCommentsByUsername, updateComment } from '../controllers/comment.js'

const router = express.Router()
/**
 * @swagger
 * /content/comments:
 *   get:
 *     summary: Get all comments!
 *     tags: [Content API]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', getAllComments)


/**
 * @swagger
 * /content/comments:
 *   post:
 *     summary: Add a new comment!
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
 *               body:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Invalid input data
 */
router.post('/', addComment)


/**
 * @swagger
 * /content/comments:
 *   put:
 *     summary: Update a comment!
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
 *               body:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Invalid input data
 */
router.put('/', updateComment)

/**
 * @swagger
 * /content/comments/{comment_id}:
 *   delete:
 *     summary: Delete a comment by id!
 *     parameters:
 *       - name: comment_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     tags: [Content API]
 *     responses:
 *       204:
 *         description: Post route text
 */
router.delete('/:comment_id', deleteCommentById)

/**
 * @swagger
 * /content/comments/user/{username}:
 *   get:
 *     summary: Get all comments by username!
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     tags: [Content API]
 *     responses:
 *       200:
 *         description: Post route text
 */
router.get('/user/:username', getCommentsByUsername)

/**
 * @swagger
 * /content/comments/post/{post_id}:
 *   get:
 *     summary: Get all comments by post_id!
 *     parameters:
 *       - name: post_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     tags: [Content API]
 *     responses:
 *       200:
 *         description: Post route text
 */
router.get('/post/:post_id', getCommentsByPostId)

/**
 * @swagger
 * /content/comments/{comment_id}:
 *   get:
 *     summary: Get a comment by id!
 *     parameters:
 *       - name: comment_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     tags: [Content API]
 *     responses:
 *       200:
 *         description: Post route text
 */
router.get('/:comment_id', getCommentById)

export default router