import { Router } from 'express';
import {
  validateCoupon,
  getAllCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCouponAnalytics
} from '../controllers/couponController';
import { requireAdminAuth } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/validate', validateCoupon);

// Admin only routes
router.get('/admin', requireAdminAuth, getAllCoupons);
router.get('/admin/analytics', requireAdminAuth, getCouponAnalytics);
router.get('/admin/:id', requireAdminAuth, getCouponById);
router.post('/admin', requireAdminAuth, createCoupon);
router.put('/admin/:id', requireAdminAuth, updateCoupon);
router.delete('/admin/:id', requireAdminAuth, deleteCoupon);

export default router;
