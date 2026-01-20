import { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback, StorageEngine } from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

/* ──────────────────────────────────────────────── */
/* CONFIG                                           */
/* ──────────────────────────────────────────────── */

const ALLOWED_IMAGE_MIMETYPES: readonly string[] = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/* ──────────────────────────────────────────────── */
/* DIRECTORY SETUP                                  */
/* ──────────────────────────────────────────────── */

const BASE_UPLOAD_DIR = path.resolve(__dirname, '../../../uploads');

const DIRS = {
  blog: path.join(BASE_UPLOAD_DIR, 'blog-images'),
  team: path.join(BASE_UPLOAD_DIR, 'team-images'),
  course: path.join(BASE_UPLOAD_DIR, 'course-images'),
  testimonial: path.join(BASE_UPLOAD_DIR, 'testimonial-images'),
  trustpilot: path.join(BASE_UPLOAD_DIR, 'trustpilot-images')
} as const;

const ensureDirectoriesExist = (): void => {
  Object.values(DIRS).forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

ensureDirectoriesExist();

/* ──────────────────────────────────────────────── */
/* HELPERS                                          */
/* ──────────────────────────────────────────────── */

const generateFilename = (prefix: string, originalName: string): string => {
  const ext = path.extname(originalName).toLowerCase();
  const random = crypto.randomBytes(6).toString('hex');
  return `${prefix}-${Date.now()}-${random}${ext}`;
};

const createStorage = (dir: string, prefix: string): StorageEngine =>
  multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, dir);
    },
    filename: (_req, file, cb) => {
      cb(null, generateFilename(prefix, file.originalname));
    }
  });

/* ──────────────────────────────────────────────── */
/* FILE FILTER                                      */
/* ──────────────────────────────────────────────── */

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (ALLOWED_IMAGE_MIMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Unsupported file type. Allowed: ${ALLOWED_IMAGE_MIMETYPES.join(', ')}`
      )
    );
  }
};

/* ──────────────────────────────────────────────── */
/* MULTER INSTANCES                                 */
/* ──────────────────────────────────────────────── */

const createUploader = (storage: StorageEngine) =>
  multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE }
  });

const blogUpload = createUploader(createStorage(DIRS.blog, 'blog'));
const teamUpload = createUploader(createStorage(DIRS.team, 'team'));
const courseUpload = createUploader(createStorage(DIRS.course, 'course'));
const testimonialUpload = createUploader(
  createStorage(DIRS.testimonial, 'testimonial')
);
const trustpilotUpload = createUploader(
  createStorage(DIRS.trustpilot, 'trustpilot')
);

/* ──────────────────────────────────────────────── */
/* ERROR HANDLER                                    */
/* ──────────────────────────────────────────────── */

export const handleUploadError = (
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        success: false,
        message: 'File too large. Maximum allowed size is 5MB.'
      });
      return;
    }

    res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`
    });
    return;
  }

  if (err instanceof Error) {
    res.status(400).json({
      success: false,
      message: err.message
    });
    return;
  }

  next();
};

/* ──────────────────────────────────────────────── */
/* EXPORTS                                          */
/* ──────────────────────────────────────────────── */

// Blog
export const uploadBlogImage = blogUpload.single('image');

export const uploadBlogImages = blogUpload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'avatarImage', maxCount: 1 }
]);

// Team
export const uploadTeamImage = teamUpload.single('image');

// Course
export const uploadCourseImage = courseUpload.single('image');

// Testimonial
export const uploadTestimonialImage =
  testimonialUpload.single('image');

// Trustpilot
export const uploadTrustpilotImage =
  trustpilotUpload.single('image');

/* ──────────────────────────────────────────────── */
/* URL HELPER                                       */
/* ──────────────────────────────────────────────── */

export type ImageType =
  | 'blog'
  | 'team'
  | 'course'
  | 'testimonial'
  | 'trustpilot';

export const getImageUrl = (
  filename: string,
  req: Request,
  type: ImageType = 'blog'
): string => {
  if (!filename) return '';

  if (filename.startsWith('http')) return filename;

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const apiPrefix = process.env.API_PREFIX || '/api';

  const folderMap: Record<ImageType, string> = {
    blog: 'blog-images',
    team: 'team-images',
    course: 'course-images',
    testimonial: 'testimonial-images',
    trustpilot: 'trustpilot-images'
  };

  return `${baseUrl}${apiPrefix}/uploads/${folderMap[type]}/${filename}`;
};
