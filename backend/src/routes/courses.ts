import { Router } from 'express';
import {
  getAllCourses,
  getFeaturedCourses,
  getCourseById,
  getCourseDetails,
  getCoursePricing,
  getCoursePricingById
} from '../controllers/courseController';

const router = Router();

// Course listing endpoints
router.get('/', getAllCourses);
router.get('/featured', getFeaturedCourses);
router.get('/:id', getCourseById);
router.get('/:id/details', getCourseDetails);

// Pricing endpoints
router.get('/pricing/all', getCoursePricing);
router.get('/pricing/:id', getCoursePricingById);

export default router;
