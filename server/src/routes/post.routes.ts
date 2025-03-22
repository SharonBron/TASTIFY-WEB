import express from 'express';
import {createPost,updatePost,deletePost, getAllPosts, toggleLikePost, getPostDetails} from '../controllers/post.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', authenticateToken, createPost);
router.put('/:id', authenticateToken, updatePost);
router.delete('/:id', authenticateToken, deletePost);
router.get('/', getAllPosts);
router.put('/:id/like', authenticateToken, toggleLikePost);
router.get('/:id', authenticateToken, getPostDetails);

export default router;
