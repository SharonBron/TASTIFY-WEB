import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';

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
  