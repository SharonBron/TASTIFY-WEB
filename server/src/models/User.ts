import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName:    { type: String, required: true },
  lastName:     { type: String, required: true },
  profileImage: { type: String, default: '' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;

