"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    restaurantName: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    likes: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }],
    likesCount: {
        type: Number,
        default: 0
    },
    commentsCount: {
        type: Number,
        default: 0
    },
    images: {
        type: [String], // מערך של כתובות תמונה (אופציונלי)
        default: []
    }
}, { timestamps: true }); // מוסיף createdAt ו־updatedAt
const Post = mongoose_1.default.model('Post', postSchema);
exports.default = Post;
//# sourceMappingURL=Post.js.map