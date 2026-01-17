import { Router } from 'express';
import {
  getAllInquiries,
  getInquiryById,
  createInquiry,
  updateInquiry,
  deleteInquiry,
  getInquiryStats,
  exportInquiries
} from '../controllers/inquiryController';
import { requireAdminAuth } from '../middleware/auth';

const router = Router();

// All routes require admin authentication
router.use(requireAdminAuth);

// Inquiry management routes
router.get('/', getAllInquiries);
router.get('/stats', getInquiryStats);
router.get('/export', exportInquiries);
router.get('/:id', getInquiryById);
router.post('/', createInquiry);
router.put('/:id', updateInquiry);
router.delete('/:id', deleteInquiry);

export default router;
