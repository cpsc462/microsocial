import express from 'express'
import { createPost, deletePostById, getAllPosts, getPostById, getPostByUsername, updatePostById } from '../controllers/post.js'

const router = express.Router()

/**
 * @swagger
 * /content/posts:
 *   get:
 *     summary: Get all Posts!
 *     tags: [Content API]
 *     responses:
 *       200:
 *         description: Post route text
 */
router.get('/', getAllPosts)

/**
 * @swagger
 * /content/posts/{post_id}:
 *   get:
 *     summary: Get all Posts!
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
router.get('/:post_id', getPostById)

/**
 * @swagger
 * /content/posts/user/{username}:
 *   get:
 *     summary: Get post by username!
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
router.get('/user/:username', getPostByUsername)

/**
 * @swagger
 * /content/posts:
 *   post:
 *     summary: Post a new post!
 *     tags: [Content API]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               title:
 *                 type: string
 *               tags:
 *                 type: string
 *               image:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Invalid input data
 */
router.post('/', createPost)

/**
 * @swagger
 * /content/posts/{post_id}:
 *   delete:
 *     summary: Get post by post_id!
 *     parameters:
 *       - name: post_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     tags: [Content API]
 *     responses:
 *       204:
 *         description: Post route text
 */
router.delete('/:post_id', deletePostById)

/**
 * @swagger
 * /content/posts:
 *   put:
 *     summary: Update a post!
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
 *               title:
 *                 type: string
 *               tags:
 *                 type: string
 *               image:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post changed successfully
 *       400:
 *         description: Invalid input data
 */
router.put('/', updatePostById)



export default router