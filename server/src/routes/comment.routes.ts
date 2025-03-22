import express from 'express';
import {
  countCommentsForPost,
  createComment,
  deleteComment,
  getCommentsByPost,
  updateComment
} from '../controllers/comment.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Operations related to comments on posts
 */

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Create a new comment on a post
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *               - text
 *             properties:
 *               postId:
 *                 type: string
 *                 description: ID of the post to comment on
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created
 *       400:
 *         description: Invalid input
 */
router.post('/', authenticateToken, createComment);

/**
 * @swagger
 * /api/comments/post/{id}:
 *   get:
 *     summary: Get all comments for a specific post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of comments
 *       404:
 *         description: Post not found
 */
router.get('/post/:id', getCommentsByPost);

/**
 * @swagger
 * /api/comments/post/{id}/count:
 *   get:
 *     summary: Get the number of comments for a specific post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Number of comments
 */
router.get('/post/:id/count', countCommentsForPost);

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the comment
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 */
router.delete('/:id', authenticateToken, deleteComment);

/**
 * @swagger
 * /api/comments/{id}:
 *   put:
 *     summary: Update a comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the comment
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 */
router.put('/:id', authenticateToken, updateComment);

export default router;
