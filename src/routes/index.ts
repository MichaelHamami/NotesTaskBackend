import express from 'express';
import taskRoutes from './task.router';
import authRoutes from './auth.router';
import noteRoutes from './note.router';
import productListRoutes from './productList.router';
import productRoutes from './product.router';

const router = express.Router();

router.use('/note', noteRoutes);
router.use('/task', taskRoutes);
router.use('/auth', authRoutes);
router.use('/product-list', productListRoutes);
router.use('/product', productRoutes);

export default router;
