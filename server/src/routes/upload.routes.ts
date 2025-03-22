import express, { Request, Response } from 'express';
import upload from '../middleware/upload.middleware';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

router.post(
  '/image',
  authenticateToken,
  upload.single('image'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }

      const imageUrl = `/uploads/${req.file.filename}`;
      res.status(201).json({ imageUrl });
    } catch (err) {
      console.error('❌ Error uploading image:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;
