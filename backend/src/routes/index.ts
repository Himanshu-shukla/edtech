import { Router } from 'express';
import companyRoutes from './company';
import courseRoutes from './courses';
import blogRoutes from './blog';
import otherRoutes from './other';
import authRoutes from './auth';
import adminRoutes from './admin';
import uploadsRoutes from './uploads';
import paymentRoutes from './payment';
import couponRoutes from './coupon';
import customerRoutes from './customer';
import inquiryRoutes from './inquiry';
import contactRoutes from './contact';

const router = Router();

// Mount route modules
router.use('/company', companyRoutes);
router.use('/courses', courseRoutes);
router.use('/blog', blogRoutes);
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/uploads', uploadsRoutes);
router.use('/payments', paymentRoutes);
router.use('/coupons', couponRoutes);
router.use('/customers', customerRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/contact', contactRoutes);
router.use('/', otherRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router;
