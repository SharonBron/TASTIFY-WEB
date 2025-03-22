import { Response } from 'express';
import Post from '../models/Post';
import Comment from '../models/Comment';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import mongoose from 'mongoose';

// יצירת פוסט חדש
export const createPost = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    const { restaurantName, text, rating } = req.body;
  
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
  
      // קבלת תמונה אם נשלחה
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
  
      const newPost = await Post.create({
        userId,
        restaurantName,
        text,
        rating,
        images: imageUrl ? [imageUrl] : []
      });
  
      res.status(201).json(newPost);
    } catch (err) {
      console.error('❌ Error creating post:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

export const updatePost = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    const { restaurantName, text, rating } = req.body;
  
    try {
      const post = await Post.findById(id);
      if (!post) {
        res.status(404).json({ message: 'Post not found' });
        return;
      }
  
      if (post.userId.toString() !== req.userId) {
        res.status(403).json({ message: 'You can only edit your own posts' });
        return;
      }
  
      post.restaurantName = restaurantName || post.restaurantName;
      post.text = text || post.text;
      post.rating = rating || post.rating;
  
      // עדכון תמונה חדשה אם קיימת בקובץ
      if (req.file) {
        const imageUrl = `/uploads/${req.file.filename}`;
        post.images = [imageUrl];
      }
  
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

// קבלת כל הפוסטים
export const getAllPosts = async (req: AuthenticatedRequest,res: Response): Promise<void> => {
    try {
        const { restaurant, userId, page = '1', limit = '10' } = req.query;
    
        const filter: any = {};
    
        if (restaurant) {
          filter.restaurantName = { $regex: restaurant, $options: 'i' };
        }
    
        if (userId) {
          filter.userId = userId;
        }
    
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const skip = (pageNum - 1) * limitNum;
    
        const posts = await Post.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .populate('userId', 'username profileImage');
    
        const total = await Post.countDocuments(filter);
    
        res.status(200).json({
          posts,
          total,
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum)
        });
      } catch (err) {
        console.error('❌ Error getting posts:', err);
        res.status(500).json({ message: 'Server error' });
      }
  };


  export const toggleLikePost = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    const userId = req.userId;
  
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized – userId missing from token' });
      return;
    }
  
    const userObjectId = new mongoose.Types.ObjectId(userId);
  
    try {
      const post = await Post.findById(id);
      if (!post) {
        res.status(404).json({ message: 'Post not found' });
        return;
      }
  
      const alreadyLiked = post.likes.some(likeId =>
        likeId.toString() === userObjectId.toString()
      );
  
      if (alreadyLiked) {
        post.likes = post.likes.filter(
          likeId => likeId.toString() !== userObjectId.toString()
        );
      } else {
        post.likes.push(userObjectId);
      }
  
      await post.save();
  
      res.status(200).json({
        liked: !alreadyLiked,
        totalLikes: post.likes.length
      });
    } catch (err) {
      console.error('❌ Error toggling like:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

  // קבלת פוסט ספציפי
  export const getPostDetails = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    const userId = req.userId;
  
    try {
      const post = await Post.findById(id)
        .populate('userId', 'username profileImage');
  
      if (!post) {
        res.status(404).json({ message: 'Post not found' });
        return;
      }
  
      const comments = await Comment.find({ postId: id })
        .sort({ createdAt: -1 })
        .populate('userId', 'username profileImage');
  
      const likedByMe = userId
        ? post.likes.some(
            (likeId) => likeId.toString() === userId.toString()
          )
        : false;
  
      res.status(200).json({
        post,
        comments,
        likesCount: post.likes.length,
        commentsCount: comments.length,
        likedByMe
      });
    } catch (err) {
      console.error('❌ Error getting post details:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };

