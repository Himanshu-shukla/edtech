import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// Define allowed mime types
const ALLOWED_IMAGE_MIMETYPES = [
  'image/jpeg', 
  'image/png', 
  'image/webp', 
  'image/gif'
];

// Create upload directories if they don't exist
const createUploadDirectories = () => {
  const baseDir = path.join(__dirname, '../../../uploads');
  const blogImagesDir = path.join(baseDir, 'blog-images');
  const teamImagesDir = path.join(baseDir, 'team-images');
  const courseImagesDir = path.join(baseDir, 'course-images');
  const testimonialImagesDir = path.join(baseDir, 'testimonial-images');
  const trustpilotImagesDir = path.join(baseDir, 'trustpilot-images');
  
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }
  if (!fs.existsSync(blogImagesDir)) {
    fs.mkdirSync(blogImagesDir, { recursive: true });
  }
  if (!fs.existsSync(teamImagesDir)) {
    fs.mkdirSync(teamImagesDir, { recursive: true });
  }
  if (!fs.existsSync(courseImagesDir)) {
    fs.mkdirSync(courseImagesDir, { recursive: true });
  }
  if (!fs.existsSync(testimonialImagesDir)) {
    fs.mkdirSync(testimonialImagesDir, { recursive: true });
  }
  if (!fs.existsSync(trustpilotImagesDir)) {
    fs.mkdirSync(trustpilotImagesDir, { recursive: true });
  }
  return { baseDir, blogImagesDir, teamImagesDir, courseImagesDir, testimonialImagesDir, trustpilotImagesDir };
};

// Create directories
const { blogImagesDir, teamImagesDir, courseImagesDir, testimonialImagesDir, trustpilotImagesDir } = createUploadDirectories();

// Configure storage for blog images
const blogStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Store blog images in the blog-images directory
    cb(null, blogImagesDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using a timestamp and random hash
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(6).toString('hex');
    const fileExt = path.extname(file.originalname).toLowerCase();
    cb(null, `blog-${uniqueSuffix}${fileExt}`);
  }
});

// Configure storage for team member images
const teamStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Store team member images in the team-images directory
    cb(null, teamImagesDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using a timestamp and random hash
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(6).toString('hex');
    const fileExt = path.extname(file.originalname).toLowerCase();
    cb(null, `team-${uniqueSuffix}${fileExt}`);
  }
});

// Configure storage for course images
const courseStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, courseImagesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(6).toString('hex');
    const fileExt = path.extname(file.originalname).toLowerCase();
    cb(null, `course-${uniqueSuffix}${fileExt}`);
  }
});

// Configure storage for testimonial images
const testimonialStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, testimonialImagesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(6).toString('hex');
    const fileExt = path.extname(file.originalname).toLowerCase();
    cb(null, `testimonial-${uniqueSuffix}${fileExt}`);
  }
});

// Configure storage for trustpilot images
const trustpilotStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, trustpilotImagesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(6).toString('hex');
    const fileExt = path.extname(file.originalname).toLowerCase();
    cb(null, `trustpilot-${uniqueSuffix}${fileExt}`);
  }
});

// Create file filter to validate uploads
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check if the file type is in our allowed list
  if (ALLOWED_IMAGE_MIMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type. Allowed types: ${ALLOWED_IMAGE_MIMETYPES.join(', ')}`));
  }
};

// Create the multer instances with configuration
const blogUpload = multer({
  storage: blogStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  }
});

const teamUpload = multer({
  storage: teamStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  }
});
const courseUpload = multer({
  storage: courseStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  }
});

const testimonialUpload = multer({
  storage: testimonialStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  }
});

const trustpilotUpload = multer({
  storage: trustpilotStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  }
});


// Middleware to handle file upload errors
export const handleUploadError = (err: any, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
      return;
    }
    res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`
    });
    return;
  }
  
  if (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
    return;
  }
  
  next();
};

// Export the configured upload middleware for different purposes
export const uploadBlogImage = blogUpload.single('image');

// For multiple file uploads (featured image + avatar)
export const uploadBlogImages = blogUpload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'avatarImage', maxCount: 1 }
]);

// For team member image uploads
export const uploadTeamImage = teamUpload.single('image');

// For course image uploads
export const uploadCourseImage = courseUpload.single('image');

// For testimonial image uploads
export const uploadTestimonialImage = testimonialUpload.single('image');

// For trustpilot image uploads
export const uploadTrustpilotImage = trustpilotUpload.single('image');

// Helper function to get the public URL for an image
export const getImageUrl = (filename: string, req: Request, type: 'blog' | 'team' | 'course' | 'testimonial' | 'trustpilot' = 'blog'): string => {
  if (!filename) return '';
  if (filename.startsWith('http')) {
    return filename;
  }
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const apiPrefix = process.env.API_PREFIX || '/api';
  let folder = 'blog-images';
  if (type === 'team') folder = 'team-images';
  if (type === 'course') folder = 'course-images';
  if (type === 'testimonial') folder = 'testimonial-images';
  if (type === 'trustpilot') folder = 'trustpilot-images';
  return `${baseUrl}${apiPrefix}/uploads/${folder}/${filename}`;
};
