import express from 'express';
import { countCommentsForPost, createComment, deleteComment, getCommentsByPost, updateComment } from '../controllers/comment.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', authenticateToken, createComment);
router.get('/post/:id', getCommentsByPost);
router.get('/post/:id/count', countCommentsForPost);
router.delete('/:id', authenticateToken, deleteComment);
router.put('/:id', authenticateToken, updateComment);

export default router;
