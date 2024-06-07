import express from 'express';
import taskRoutes from './task.router';
import authRoutes from './auth.router';
import noteRoutes from './note.router';
import productListRoutes from './productList.router';
import productRoutes from './product.router';
import categoryRoutes from './category.router';
import userRoutes from './user.router';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.use('/note', authMiddleware, noteRoutes);
router.use('/task', authMiddleware, taskRoutes);
router.use('/auth', authRoutes);
router.use('/product-list', authMiddleware, productListRoutes);
router.use('/product', authMiddleware, productRoutes);
router.use('/category', authMiddleware, categoryRoutes);
router.use('/user', authMiddleware, userRoutes);

export default router;
