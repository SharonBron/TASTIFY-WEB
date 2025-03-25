"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostDetails = exports.toggleLikePost = exports.getAllPosts = exports.deletePost = exports.updatePost = exports.createPost = void 0;
const Post_1 = __importDefault(require("../models/Post"));
const Comment_1 = __importDefault(require("../models/Comment"));
const mongoose_1 = __importDefault(require("mongoose"));
// יצירת פוסט חדש
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { restaurantName, text, rating } = req.body;
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
        const newPost = yield Post_1.default.create({
            userId,
            restaurantName,
            text,
            rating,
            images: imageUrl ? [imageUrl] : []
        });
        res.status(201).json(newPost);
    }
    catch (err) {
        console.error('❌ Error creating post:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createPost = createPost;
// עדכון פוסט
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { restaurantName, text, rating } = req.body;
    try {
        const post = yield Post_1.default.findById(id);
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
        if (req.file) {
            const imageUrl = `/uploads/${req.file.filename}`;
            post.images = [imageUrl];
        }
        yield post.save();
        res.status(200).json({ updatedPost: post });
    }
    catch (err) {
        console.error('❌ Error updating post:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updatePost = updatePost;
// מחיקת פוסט
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const post = yield Post_1.default.findById(id);
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }
        if (post.userId.toString() !== req.userId) {
            res.status(403).json({ message: 'You can only delete your own posts' });
            return;
        }
        yield post.deleteOne();
        res.status(200).json({ message: 'Post deleted' });
    }
    catch (err) {
        console.error('❌ Error deleting post:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deletePost = deletePost;
// קבלת כל הפוסטים
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { restaurant, userId, page = '1', limit = '10' } = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        const matchStage = {};
        if (restaurant) {
            matchStage.restaurantName = { $regex: restaurant, $options: 'i' };
        }
        if (userId) {
            matchStage.userId = new mongoose_1.default.Types.ObjectId(userId);
        }
        const posts = yield Post_1.default.aggregate([
            { $match: matchStage },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limitNum },
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'postId',
                    as: 'comments'
                }
            },
            {
                $addFields: {
                    commentsCount: { $size: '$comments' },
                    likesCount: { $size: '$likes' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    comments: 0,
                    likes: 0,
                    'user.password': 0
                }
            }
        ]);
        const total = yield Post_1.default.countDocuments(matchStage);
        res.status(200).json({
            posts,
            total,
            currentPage: pageNum,
            totalPages: Math.ceil(total / limitNum)
        });
    }
    catch (err) {
        console.error('❌ Error getting posts:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getAllPosts = getAllPosts;
// לייק לפוסט
const toggleLikePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ message: 'Unauthorized – userId missing from token' });
        return;
    }
    const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
    try {
        const post = yield Post_1.default.findById(id);
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }
        const alreadyLiked = post.likes.some((likeId) => likeId.toString() === userObjectId.toString());
        if (alreadyLiked) {
            post.likes = post.likes.filter((likeId) => likeId.toString() !== userObjectId.toString());
        }
        else {
            post.likes.push(userObjectId);
        }
        yield post.save();
        res.status(200).json({
            liked: !alreadyLiked,
            totalLikes: post.likes.length
        });
    }
    catch (err) {
        console.error('❌ Error toggling like:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.toggleLikePost = toggleLikePost;
// פרטי פוסט
const getPostDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userId = req.userId;
    try {
        const post = yield Post_1.default.findById(id).populate('userId', 'username profileImage');
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }
        const comments = yield Comment_1.default.find({ postId: id })
            .sort({ createdAt: -1 })
            .populate('userId', 'username profileImage');
        const likedByMe = userId
            ? post.likes.some((likeId) => likeId.toString() === userId.toString())
            : false;
        res.status(200).json({
            post,
            comments,
            likesCount: post.likes.length,
            commentsCount: comments.length,
            likedByMe
        });
    }
    catch (err) {
        console.error('❌ Error getting post details:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getPostDetails = getPostDetails;
//# sourceMappingURL=post.controller.js.map