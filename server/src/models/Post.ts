import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
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
  images: {
    type: [String], // מערך של כתובות תמונה (אופציונלי)
    default: []
  }
}, { timestamps: true }); // מוסיף createdAt ו־updatedAt

const Post = mongoose.model('Post', postSchema);
export default Post;
