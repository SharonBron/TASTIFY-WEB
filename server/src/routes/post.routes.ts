import express from 'express';
import {createPost,updatePost,deletePost} from '../controllers/post.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', authenticateToken, createPost);
router.put('/:id', authenticateToken, updatePost);
router.delete('/:id', authenticateToken, deletePost);

export default router;
