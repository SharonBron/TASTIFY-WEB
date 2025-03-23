import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

console.log(' createUser controller loaded');


export const createUser = async (req: Request, res: Response): Promise<void> => {
    const { username, email, password, firstName, lastName } = req.body;
    console.log('📨 createUser called');
    console.log('Body:', req.body);
    try {
      const existing = await User.findOne({ email });
      if (existing) {
        res.status(400).json({ message: 'User already exists' });
        return;
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName
      });
      
      const count = await User.countDocuments();
    console.log('👀 Total users:', count);


      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ message: 'Error creating user' });
    }

    console.log("createUser called");

  };

  export const getUserProfile = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
  
    try {
      const user = await User.findById(id).select('-password');
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
  
      res.status(200).json(user);
    } catch (err) {
      console.error('❌ Error getting user:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };

  export const updateUserProfile = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
  
    // ודא שהמשתמש המחובר עורך את עצמו
    if (id !== req.userId) {
      res.status(403).json({ message: 'You can only edit your own profile' });
      return;
    }
  
    const { firstName, lastName } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(imageUrl && { profileImage: imageUrl }),
        },
        { new: true, runValidators: true }
      ).select('-password');
  
      if (!updatedUser) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
  
      res.status(200).json(updatedUser);
    } catch (err) {
      console.error('❌ Error updating user:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };