import express from 'express';
import {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  toggleLikePost,
  getPostDetails,
} from '../controllers/post.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import upload from '../middleware/upload.middleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Post management and operations
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts (with optional filters and paging)
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: restaurant
 *         schema:
 *           type: string
 *         description: Filter by restaurant name
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of posts per page
 *     responses:
 *       200:
 *         description: List of posts
 */
router.get('/', getAllPosts);

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post (without image)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - restaurantName
 *               - text
 *               - rating
 *             properties:
 *               restaurantName:
 *                 type: string
 *               text:
 *                 type: string
 *               rating:
 *                 type: number
 *     responses:
 *       201:
 *         description: Post created successfully
 */
router.post(
    '/',
    authenticateToken,
    upload.single('image'), 
    createPost
  );

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Update a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               rating:
 *                 type: number
 *               restaurantName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       404:
 *         description: Post not found
 */
router.put('/:id', authenticateToken,authenticateToken,
    upload.single('image'), updatePost);

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted
 *       404:
 *         description: Post not found
 */
router.delete('/:id', authenticateToken, deletePost);

/**
 * @swagger
 * /api/posts/{id}/like:
 *   put:
 *     summary: Like or unlike a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Like toggled
 *       404:
 *         description: Post not found
 */
router.put('/:id/like', authenticateToken, toggleLikePost);

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Get full details of a post including comments and likes
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Full post details
 *       404:
 *         description: Post not found
 */
router.get('/:id', authenticateToken, getPostDetails);


export default router;
