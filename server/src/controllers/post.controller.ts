import { Response } from 'express';
import Post from '../models/Post';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

// יצירת פוסט חדש
export const createPost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { restaurantName, text, rating, images } = req.body;

  try {
    const newPost = await Post.create({
      userId: req.userId,
      restaurantName,
      text,
      rating,
      images
    });

    res.status(201).json(newPost);
  } catch (err) {
    console.error('❌ Error creating post:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// עדכון פוסט
export const updatePost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { restaurantName, text, rating, images } = req.body;

  try {
    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    // בדוק אם המשתמש הוא הבעלים של הפוסט
    if (post.userId.toString() !== req.userId) {
      res.status(403).json({ message: 'You can only edit your own posts' });
      return;
    }

    post.restaurantName = restaurantName;
    post.text = text;
    post.rating = rating;
    post.images = images;

    await post.save();
    res.status(200).json(post);
  } catch (err) {
    console.error('❌ Error updating post:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// מחיקת פוסט
export const deletePost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    if (post.userId.toString() !== req.userId) {
      res.status(403).json({ message: 'You can only delete your own posts' });
      return;
    }

    await post.deleteOne();
    res.status(200).json({ message: 'Post deleted' });
  } catch (err) {
    console.error('❌ Error deleting post:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
