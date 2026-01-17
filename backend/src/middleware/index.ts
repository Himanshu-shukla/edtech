import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { uploadBlogImage, uploadBlogImages, uploadTeamImage, uploadCourseImage, uploadTestimonialImage, uploadTrustpilotImage, handleUploadError, getImageUrl } from './upload';

// Rate limiting middleware
export const createRateLimiter = (windowMs: number = 15 * 60 * 1000, max: number = 10000) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Skip rate limiting for admin users
    skip: (req: Request) => {
      try {
        // Check if there's an authorization header
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return false;
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        
        // Verify and decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
        
        // Skip rate limiting if user is admin
        return decoded && decoded.role === 'admin';
      } catch (error) {
        // If token verification fails, don't skip rate limiting
        return false;
      }
    }
  });
};

// Admin-specific rate limiter (very high limits or disabled)
export const createAdminRateLimiter = (windowMs: number = 15 * 60 * 1000, max: number = 1000) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Always skip rate limiting for admin routes if user is authenticated as admin
    skip: (req: Request) => {
      try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return false;
        }

        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
        
        // Skip rate limiting for admin users on admin routes
        return decoded && decoded.role === 'admin';
      } catch (error) {
        return false;
      }
    }
  });
};

// Error handling middleware
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  // Default error response
  let status = 500;
  let message = 'Internal server error';

  // Handle specific error types
  if (error.name === 'ValidationError') {
    status = 400;
    message = 'Validation error';
  } else if (error.name === 'CastError') {
    status = 400;
    message = 'Invalid ID format';
  } else if (error.code === 11000) {
    status = 409;
    message = 'Duplicate entry';
  }

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { details: error.message })
  });
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
};

// Request logger middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};

// Export upload middleware
export { uploadBlogImage, uploadBlogImages, uploadTeamImage, uploadCourseImage, uploadTestimonialImage, uploadTrustpilotImage, handleUploadError, getImageUrl };
const allowedOrigins: (string | RegExp)[] = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_WWW,
  process.env.ADMIN_URL,
  process.env.ADMIN_URL_WWW
  , process.env.AGENTIC_AI_URL,
  process.env.AGENTIC_AI_URL_WWW,
  process.env.DATA_ANALYST_URL,
  process.env.DATA_ANALYST_URL_WWW ,
  process.env.DATA_ANALYST_2_URL,
  process.env.DATA_ANALYST_2_URL_WWW
].filter((o): o is string => !!o); // removes undefined
// CORS configuration
export const corsOptions = {
  origin: process.env.NODE_ENV === 'development' 
    ? ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174']
    : allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
};
