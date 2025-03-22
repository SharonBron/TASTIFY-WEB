import express from 'express';
import {
  createUser,
  getUserProfile,
  updateUserProfile,
} from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import upload from '../middleware/upload.middleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile management
 */

/**
 * @swagger
 * /api/users/create:
 *   post:
 *     summary: Create a user manually (for testing or admin purposes)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: User already exists
 */
router.post('/create', createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile returned
 *       404:
 *         description: User not found
 */
router.get('/:id', authenticateToken, getUserProfile);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user's profile (first/last name only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *       403:
 *         description: Unauthorized
 */
router.put(
    '/:id',
    authenticateToken,
    upload.single('profileImage'), 
    updateUserProfile
  );


export default router;
