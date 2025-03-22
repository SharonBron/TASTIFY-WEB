import express from 'express';
import {createPost,updatePost,deletePost, getAllPosts} from '../controllers/post.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', authenticateToken, createPost);
router.put('/:id', authenticateToken, updatePost);
router.delete('/:id', authenticateToken, deletePost);
router.get('/', getAllPosts);

export default router;
