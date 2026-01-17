import { Router } from 'express';
import { login, createUser, getProfile, getAllUsers, deleteUser } from '../controllers/authController';
import { authenticate, requireAdminAuth } from '../middleware/auth';
import { createRateLimiter, createAdminRateLimiter } from '../middleware';

const router = Router();

// Rate limiter for login endpoint (protect against brute force)
const loginRateLimiter = createRateLimiter(15 * 60 * 1000, 5); // 5 attempts per 15 minutes

// Admin rate limiter for admin-only auth routes
const adminAuthRateLimiter = createAdminRateLimiter();

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', loginRateLimiter, login);

/**
 * @route GET /api/auth/profile
 * @desc Get current user profile
 * @access Private
 */
router.get('/profile', authenticate, getProfile);

/**
 * @route POST /api/auth/users
 * @desc Create new user (admin only)
 * @access Private (Admin)
 */
router.post('/users', adminAuthRateLimiter, requireAdminAuth, createUser);

/**
 * @route GET /api/auth/users
 * @desc Get all users (admin only)
 * @access Private (Admin)
 */
router.get('/users', adminAuthRateLimiter, requireAdminAuth, getAllUsers);

/**
 * @route DELETE /api/auth/users/:id
 * @desc Delete user (admin only)
 * @access Private (Admin)
 */
router.delete('/users/:id', adminAuthRateLimiter, requireAdminAuth, deleteUser);

export default router;
