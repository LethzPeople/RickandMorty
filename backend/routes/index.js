import express from 'express';
import authRoutes from './auth.routes.js';
import characterRoutes from './character.routes.js';
import profileRoutes from './profile.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/characters', characterRoutes);
router.use('/profiles', profileRoutes);

export default router;

