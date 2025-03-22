import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../config/jwt';
import { OAuth2Client } from 'google-auth-library';


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      res.status(400).json({ message: 'Invalid token' });
      return;
    }

    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        googleId,
        email,
        username: name,
        profileImage: picture
      });
    }
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    res.status(200).json({
      user,
      accessToken,
      refreshToken
    });
  } catch (err) {
    console.error('❌ Google login error:', err);
    res.status(401).json({ message: 'Google authentication failed' });
  }
};


export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password, firstName, lastName } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ msg: 'User already exists' });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    console.log('req.body', req.body)
    const user = await User.create({ username, email, password: hashed, firstName, lastName });

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    res.status(201).json({ user, accessToken, refreshToken });
  } catch (err) {
    console.error('❌ Error in register:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};


export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ message: 'Invalid email or password' });
        return;
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ message: 'Invalid email or password' });
        return;
      }
  
      const accessToken = generateAccessToken(user._id.toString());
      const refreshToken = generateRefreshToken(user._id.toString());
  
      res.status(200).json({
        message: 'Login successful',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImage: user.profileImage
        },
        accessToken,
        refreshToken
      });
    } catch (err) {
      console.error('❌ Login error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };

  export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;
  
    if (!refreshToken) {
      res.status(401).json({ message: 'No refresh token provided' });
      return;
    }
  
    try {
      const userId = verifyRefreshToken(refreshToken);
  
      if (!userId) {
        res.status(403).json({ message: 'Invalid refresh token' });
        return;
      }
  
      const newAccessToken = generateAccessToken(userId);
      res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
      console.error('❌ Error verifying refresh token:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
