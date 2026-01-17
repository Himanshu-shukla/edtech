import { Router } from 'express';
import {
  getCompanyInfo,
  getTeamMembers,
  getCompanyValues,
  getAboutStats,
  getCompanyMilestones,
  getContactData,
  getUpcomingSkills,
  getHighlightedCountries,
  getAboutData
} from '../controllers/companyController';

const router = Router();

// Individual endpoints
router.get('/info', getCompanyInfo);
router.get('/team', getTeamMembers);
router.get('/values', getCompanyValues);
router.get('/stats', getAboutStats);
router.get('/milestones', getCompanyMilestones);
router.get('/contact', getContactData);
router.get('/skills', getUpcomingSkills);
router.get('/countries', getHighlightedCountries);

// Combined endpoint for all about data
router.get('/about', getAboutData);

export default router;
