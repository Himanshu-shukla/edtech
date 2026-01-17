import { Router } from 'express';
import {
  submitContactForm,
  submitStrategyCall,
  submitInstallmentInquiry,
  submitBootcampApplication
} from '../controllers/contactController';

const router = Router();

// Public contact routes (no authentication required)
router.post('/submit', submitContactForm);
router.post('/strategy-call', submitStrategyCall);
router.post('/installment-inquiry', submitInstallmentInquiry);
router.post('/bootcamp-application', submitBootcampApplication); // Dedicated bootcamp application handler

export default router;
