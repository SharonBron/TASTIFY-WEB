import express from 'express';
import { createUser } from '../controllers/user.controller';

const router = express.Router();

router.post('/create', createUser);
console.log('user.routes loaded');

export default router;
