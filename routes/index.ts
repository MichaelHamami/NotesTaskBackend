import express from 'express';
import taskRoutes from './task.router';
import authRoutes from './auth.router';
import noteRoutes from './note.router';

const router = express.Router();

router.use('/note', noteRoutes);
router.use('/task', taskRoutes);
router.use('/auth', authRoutes);

export default router;
