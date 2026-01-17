import { Router } from 'express';
import {
  getFAQs,
  getMentors,
  getMentorFeatures,
  getPartnerCompanies,
  getAdvantageStats,
  getTestimonials,
  getTrustpilotReviews,
  getSuccessStats,
  getCourseIcons,
  getIconByName,
  getMentorData,
  getIconsData
} from '../controllers/otherController';

const router = Router();

// FAQ endpoints
router.get('/faqs', getFAQs);

// Mentor endpoints
router.get('/mentors', getMentors);
router.get('/mentors/features', getMentorFeatures);
router.get('/mentors/companies', getPartnerCompanies);
router.get('/mentors/all', getMentorData); // Combined endpoint

// Statistics endpoints
router.get('/stats', getAdvantageStats);

// Testimonial endpoints
router.get('/testimonials', getTestimonials);

// Trustpilot Review endpoints
router.get('/trustpilot-reviews', getTrustpilotReviews);

// Success Stats endpoints
router.get('/success-stats', getSuccessStats);

// Icon endpoints
router.get('/icons', getCourseIcons);
router.get('/icons/:iconName', getIconByName);
router.get('/icons/all', getIconsData); // Combined endpoint

export default router;
