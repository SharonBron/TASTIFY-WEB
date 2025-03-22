import express from 'express';
import { createUser, getUserProfile, updateUserProfile } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();



router.post('/create', createUser);
router.get('/:id', authenticateToken, getUserProfile);
router.put('/:id', authenticateToken, updateUserProfile);

export default router;
