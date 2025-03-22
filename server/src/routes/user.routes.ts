import express from 'express';
import { createUser, getUserProfile, updateUserProfile, updateUserProfileWithImage } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import upload from '../middleware/upload.middleware';
import User from '../models/User';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const router = express.Router();



router.post('/create', createUser);
router.get('/:id', authenticateToken, getUserProfile);
router.put('/:id', authenticateToken, updateUserProfile);

//עדכון תמונה
router.put(
    '/:id',
    authenticateToken,
    upload.single('profileImage'),
    updateUserProfileWithImage
  );
export default router;
