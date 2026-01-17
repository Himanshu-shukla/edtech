import { Router } from 'express';
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  getBlogPostById,
  getFeaturedBlogPosts,
  getBlogCategories,
  getPostsByCategory,
  getRelatedPosts
} from '../controllers/blogController';

const router = Router();

// Blog listing endpoints
router.get('/', getAllBlogPosts);
router.get('/featured', getFeaturedBlogPosts);
router.get('/categories', getBlogCategories);

// Individual post endpoints
router.get('/id/:id', getBlogPostById);
router.get('/slug/:slug', getBlogPostBySlug);
router.get('/slug/:slug/related', getRelatedPosts);

// Category-based endpoints
router.get('/category/:category', getPostsByCategory);

export default router;
