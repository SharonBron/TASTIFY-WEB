import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import postRoutes from './routes/post.routes';
import commentRoutes from './routes/comment.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';

// Load environment variables
if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env_test' });
} else {
  dotenv.config();
}

const app = express();

// Middleware
app.use(cors({
  origin: process.env.DOMAIN_BASE || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Static React app serving (only in production and not during tests)
if (process.env.NODE_ENV === 'production' && process.env.TEST !== 'true') {
  const buildPath = path.join(__dirname, '../../client/build');
  app.use(express.static(buildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });

  const options = {
    key: fs.readFileSync('./client-key.pem'),
    cert: fs.readFileSync('./client-cert.pem'),
  };

  const port = process.env.HTTPS_PORT || 443;
  https.createServer(options, app).listen(port, () => {
    console.log(`🚀 HTTPS server running on port ${port}`);
  });
} else if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3000;
  http.createServer(app).listen(port, () => {
    console.log(`🚀 HTTP server running on port ${port}`);
  });
}

export default app;
