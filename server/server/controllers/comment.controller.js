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
exports.updateComment = exports.deleteComment = exports.countCommentsForPost = exports.getCommentsByPost = exports.createComment = void 0;
const Comment_1 = __importDefault(require("../models/Comment"));
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, text } = req.body;
    try {
        const comment = yield Comment_1.default.create({
            postId,
            userId: req.userId,
            text
        });
        res.status(201).json(comment);
    }
    catch (err) {
        console.error('❌ Error creating comment:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createComment = createComment;
const getCommentsByPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: postId } = req.params;
    try {
        const comments = yield Comment_1.default.find({ postId })
            .sort({ createdAt: -1 })
            .populate('userId', 'username profileImage'); // ← כאן נוספה ההשלמה
        res.status(200).json(comments);
    }
    catch (err) {
        console.error('❌ Error getting comments:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getCommentsByPost = getCommentsByPost;
const countCommentsForPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: postId } = req.params;
    try {
        const count = yield Comment_1.default.countDocuments({ postId });
        res.status(200).json({ postId, count });
    }
    catch (err) {
        console.error('❌ Error counting comments:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.countCommentsForPost = countCommentsForPost;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const comment = yield Comment_1.default.findById(id);
        if (!comment) {
            res.status(404).json({ message: 'Comment not found' });
            return;
        }
        if (comment.userId.toString() !== req.userId) {
            res.status(403).json({ message: 'You can only delete your own comment' });
            return;
        }
        yield comment.deleteOne();
        res.status(200).json({ message: 'Comment deleted' });
    }
    catch (err) {
        console.error('❌ Error deleting comment:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteComment = deleteComment;
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { text } = req.body;
    try {
        const comment = yield Comment_1.default.findById(id);
        if (!comment) {
            res.status(404).json({ message: 'Comment not found' });
            return;
        }
        if (comment.userId.toString() !== req.userId) {
            res.status(403).json({ message: 'You can only edit your own comment' });
            return;
        }
        comment.text = text;
        yield comment.save();
        res.status(200).json(comment);
    }
    catch (err) {
        console.error('❌ Error updating comment:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateComment = updateComment;
//# sourceMappingURL=comment.controller.js.map