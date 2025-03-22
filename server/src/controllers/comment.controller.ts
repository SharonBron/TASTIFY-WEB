import { Response } from 'express';
import { Request } from 'express-serve-static-core'; 
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import Comment from '../models/Comment';

export const createComment = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { postId, text } = req.body;

  try {
    const comment = await Comment.create({
      postId,
      userId: req.userId,
      text
    });

    res.status(201).json(comment);
  } catch (err) {
    console.error('❌ Error creating comment:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCommentsByPost = async (
    req: Request<{ id: string }>,
    res: Response
  ): Promise<void> => {
    const { id: postId } = req.params;
  
    try {
      const comments = await Comment.find({ postId })
        .sort({ createdAt: -1 })
        .populate('userId', 'username profileImage'); // ← כאן נוספה ההשלמה
  
      res.status(200).json(comments);
    } catch (err) {
      console.error('❌ Error getting comments:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };

  export const countCommentsForPost = async (
    req: Request<{ id: string }>,
    res: Response
  ): Promise<void> => {
    const { id: postId } = req.params;
  
    try {
      const count = await Comment.countDocuments({ postId });
      res.status(200).json({ postId, count });
    } catch (err) {
      console.error('❌ Error counting comments:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  export const deleteComment = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
  
    try {
      const comment = await Comment.findById(id);
      if (!comment) {
        res.status(404).json({ message: 'Comment not found' });
        return;
      }
  
      if (comment.userId.toString() !== req.userId) {
        res.status(403).json({ message: 'You can only delete your own comment' });
        return;
      }
  
      await comment.deleteOne();
      res.status(200).json({ message: 'Comment deleted' });
    } catch (err) {
      console.error('❌ Error deleting comment:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };

  export const updateComment = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    const { text } = req.body;
  
    try {
      const comment = await Comment.findById(id);
      if (!comment) {
        res.status(404).json({ message: 'Comment not found' });
        return;
      }
  
      if (comment.userId.toString() !== req.userId) {
        res.status(403).json({ message: 'You can only edit your own comment' });
        return;
      }
  
      comment.text = text;
      await comment.save();
  
      res.status(200).json(comment);
    } catch (err) {
      console.error('❌ Error updating comment:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };