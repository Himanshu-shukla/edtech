import { Router } from 'express';
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerStats,
  exportCustomers
} from '../controllers/customerController';
import { requireAdminAuth } from '../middleware/auth';

const router = Router();

// All routes require admin authentication
router.use(requireAdminAuth);

// Customer management routes
router.get('/', getAllCustomers);
router.get('/stats', getCustomerStats);
router.get('/export', exportCustomers);
router.get('/:id', getCustomerById);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

export default router;
