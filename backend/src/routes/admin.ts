import { Router } from 'express';
import type { Request, Response } from 'express';
import { requireAdminAuth } from '../middleware/auth';
import { createAdminRateLimiter, uploadBlogImages, uploadTeamImage, uploadCourseImage, uploadTestimonialImage, uploadTrustpilotImage, handleUploadError } from '../middleware';
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
} from '../controllers/blogAdminController';
import {
  // Course routes
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  
  // Course Details routes
  getAllCourseDetails,
  getCourseDetailsById,
  createCourseDetails,
  updateCourseDetails,
  deleteCourseDetails,
  
  // Course Pricing routes
  getAllCoursePricing,
  getCoursePricingById,
  createCoursePricing,
  updateCoursePricing,
  deleteCoursePricing,
  
  // Company Info routes
  getAllCompanyInfo,
  getCompanyInfoById,
  createCompanyInfo,
  updateCompanyInfo,
  deleteCompanyInfo,
  
  // Team Member routes
  getAllTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  
  // Value routes
  getAllValues,
  getValueById,
  createValue,
  updateValue,
  deleteValue,
  
  // Stat routes
  getAllStats,
  getStatById,
  createStat,
  updateStat,
  deleteStat,
  
  // Milestone routes
  getAllMilestones,
  getMilestoneById,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  
  // Contact Data routes
  getAllContactData,
  getContactDataById,
  createContactData,
  updateContactData,
  deleteContactData,
  
  // Upcoming Skill routes
  getAllUpcomingSkills,
  getUpcomingSkillById,
  createUpcomingSkill,
  updateUpcomingSkill,
  deleteUpcomingSkill,
  
  // Highlighted Countries routes
  getAllHighlightedCountries,
  getHighlightedCountriesById,
  createHighlightedCountries,
  updateHighlightedCountries,
  deleteHighlightedCountries,
  
  // Mentor routes
  getAllMentors,
  getMentorById,
  createMentor,
  updateMentor,
  deleteMentor,
  
  // Mentor Feature routes
  getAllMentorFeatures,
  getMentorFeatureById,
  createMentorFeature,
  updateMentorFeature,
  deleteMentorFeature,
  
  // Company Logo routes
  getAllCompanyLogos,
  getCompanyLogoById,
  createCompanyLogo,
  updateCompanyLogo,
  deleteCompanyLogo,
  
  // FAQ routes
  getAllFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  
  // Advantage Stat routes
  getAllAdvantageStats,
  getAdvantageStatById,
  createAdvantageStat,
  updateAdvantageStat,
  deleteAdvantageStat,
  
  // Success Stat routes
  getAllSuccessStats,
  getSuccessStatById,
  createSuccessStat,
  updateSuccessStat,
  deleteSuccessStat,
  
  // Dashboard
  getDashboardStats
} from '../controllers/adminController';
import {
  getAllTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} from '../controllers/testimonialAdminController';
import {
  getAllTrustpilotReviews,
  getTrustpilotReviewById,
  createTrustpilotReview,
  updateTrustpilotReview,
  deleteTrustpilotReview
} from '../controllers/trustpilotAdminController';

const router = Router();

// Apply admin-specific rate limiter (very lenient or disabled for admins)
router.use(createAdminRateLimiter());

// Apply admin authentication to all routes
router.use(requireAdminAuth);

/**
 * Dashboard Statistics
 * @route GET /api/admin/dashboard/stats
 */
router.get('/dashboard/stats', getDashboardStats);

/**
 * Courses CRUD Routes
 */
router.get('/courses', getAllCourses);
router.get('/courses/:id', getCourseById);
router.post('/courses', uploadCourseImage, handleUploadError, createCourse);
router.put('/courses/:id', uploadCourseImage, handleUploadError, updateCourse);
router.delete('/courses/:id', deleteCourse);

/**
 * Course Details CRUD Routes
 */
router.get('/course-details', getAllCourseDetails);
router.get('/course-details/:id', getCourseDetailsById);
router.post('/course-details', createCourseDetails);
router.put('/course-details/:id', updateCourseDetails);
router.delete('/course-details/:id', deleteCourseDetails);

/**
 * Course Pricing CRUD Routes
 */
router.get('/course-pricing', getAllCoursePricing);
router.get('/course-pricing/:id', getCoursePricingById);
router.post('/course-pricing', createCoursePricing);
router.put('/course-pricing/:id', updateCoursePricing);
router.delete('/course-pricing/:id', deleteCoursePricing);

/**
 * Blog Posts CRUD Routes with File Upload Support
 */
router.get('/blogs', getAllBlogs);
router.get('/blogs/:id', getBlogById);
router.post('/blogs', uploadBlogImages, handleUploadError, createBlog);
router.put('/blogs/:id', uploadBlogImages, handleUploadError, updateBlog);
router.delete('/blogs/:id', deleteBlog);

/**
 * Company Info CRUD Routes
 */
router.get('/company-info', getAllCompanyInfo);
router.get('/company-info/:id', getCompanyInfoById);
router.post('/company-info', createCompanyInfo);
router.put('/company-info/:id', updateCompanyInfo);
router.delete('/company-info/:id', deleteCompanyInfo);

/**
 * Team Members CRUD Routes
 */
router.get('/team-members', getAllTeamMembers);
router.get('/team-members/:id', getTeamMemberById);
router.post('/team-members', uploadTeamImage, handleUploadError, createTeamMember);
router.put('/team-members/:id', uploadTeamImage, handleUploadError, updateTeamMember);
router.delete('/team-members/:id', deleteTeamMember);

/**
 * Values CRUD Routes
 */
router.get('/values', getAllValues);
router.get('/values/:id', getValueById);
router.post('/values', createValue);
router.put('/values/:id', updateValue);
router.delete('/values/:id', deleteValue);

/**
 * Stats CRUD Routes
 */
router.get('/stats', getAllStats);
router.get('/stats/:id', getStatById);
router.post('/stats', createStat);
router.put('/stats/:id', updateStat);
router.delete('/stats/:id', deleteStat);

/**
 * Milestones CRUD Routes
 */
router.get('/milestones', getAllMilestones);
router.get('/milestones/:id', getMilestoneById);
router.post('/milestones', createMilestone);
router.put('/milestones/:id', updateMilestone);
router.delete('/milestones/:id', deleteMilestone);

/**
 * Contact Data CRUD Routes
 */
router.get('/contact-data', getAllContactData);
router.get('/contact-data/:id', getContactDataById);
router.post('/contact-data', createContactData);
router.put('/contact-data/:id', updateContactData);
router.delete('/contact-data/:id', deleteContactData);

/**
 * Upcoming Skills CRUD Routes
 */
router.get('/upcoming-skills', getAllUpcomingSkills);
router.get('/upcoming-skills/:id', getUpcomingSkillById);
router.post('/upcoming-skills', createUpcomingSkill);
router.put('/upcoming-skills/:id', updateUpcomingSkill);
router.delete('/upcoming-skills/:id', deleteUpcomingSkill);

/**
 * Highlighted Countries CRUD Routes
 */
router.get('/highlighted-countries', getAllHighlightedCountries);
router.get('/highlighted-countries/:id', getHighlightedCountriesById);
router.post('/highlighted-countries', createHighlightedCountries);
router.put('/highlighted-countries/:id', updateHighlightedCountries);
router.delete('/highlighted-countries/:id', deleteHighlightedCountries);

/**
 * Mentors CRUD Routes
 */
router.get('/mentors', getAllMentors);
router.get('/mentors/:id', getMentorById);
router.post('/mentors', createMentor);
router.put('/mentors/:id', updateMentor);
router.delete('/mentors/:id', deleteMentor);

/**
 * Mentor Features CRUD Routes
 */
router.get('/mentor-features', getAllMentorFeatures);
router.get('/mentor-features/:id', getMentorFeatureById);
router.post('/mentor-features', createMentorFeature);
router.put('/mentor-features/:id', updateMentorFeature);
router.delete('/mentor-features/:id', deleteMentorFeature);

/**
 * Company Logos CRUD Routes
 */
router.get('/company-logos', getAllCompanyLogos);
router.get('/company-logos/:id', getCompanyLogoById);
router.post('/company-logos', createCompanyLogo);
router.put('/company-logos/:id', updateCompanyLogo);
router.delete('/company-logos/:id', deleteCompanyLogo);

/**
 * FAQs CRUD Routes
 */
router.get('/faqs', getAllFAQs);
router.get('/faqs/:id', getFAQById);
router.post('/faqs', createFAQ);
router.put('/faqs/:id', updateFAQ);
router.delete('/faqs/:id', deleteFAQ);

/**
 * Advantage Stats CRUD Routes
 */
router.get('/advantage-stats', getAllAdvantageStats);
router.get('/advantage-stats/:id', getAdvantageStatById);
router.post('/advantage-stats', createAdvantageStat);
router.put('/advantage-stats/:id', updateAdvantageStat);
router.delete('/advantage-stats/:id', deleteAdvantageStat);

/**
 * Testimonials CRUD Routes
 */
router.get('/testimonials', getAllTestimonials);
router.get('/testimonials/:id', getTestimonialById);
router.post('/testimonials', uploadTestimonialImage, handleUploadError, createTestimonial);
router.put('/testimonials/:id', uploadTestimonialImage, handleUploadError, updateTestimonial);
router.delete('/testimonials/:id', deleteTestimonial);

/**
 * Trustpilot Reviews CRUD Routes
 */
router.get('/trustpilot-reviews', getAllTrustpilotReviews);
router.get('/trustpilot-reviews/:id', getTrustpilotReviewById);
router.post('/trustpilot-reviews', uploadTrustpilotImage, handleUploadError, createTrustpilotReview);
router.put('/trustpilot-reviews/:id', uploadTrustpilotImage, handleUploadError, updateTrustpilotReview);
router.delete('/trustpilot-reviews/:id', deleteTrustpilotReview);

/**
 * Success Stats CRUD Routes
 */
router.get('/success-stats', getAllSuccessStats);
router.get('/success-stats/:id', getSuccessStatById);
router.post('/success-stats', createSuccessStat);
router.put('/success-stats/:id', updateSuccessStat);
router.delete('/success-stats/:id', deleteSuccessStat);

/**
 * Image Upload Utility Routes
 * @route POST /api/admin/upload/testimonial-avatar
 * @description Upload a testimonial avatar image and get back the filename
 */
router.post('/upload/testimonial-avatar', uploadTestimonialImage, handleUploadError, (req: Request, res: Response): void => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
      return;
    }
    
    // Set proper response headers
    res.setHeader('Content-Type', 'application/json');
    
    // Return just the filename
    res.status(200).json({
      success: true,
      filename: req.file.filename,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to upload image'
    });
  }
});

/**
 * @route POST /api/admin/upload/mentor-image
 * @description Upload a mentor profile image and get back the filename
 */
router.post('/upload/mentor-image', uploadTeamImage, handleUploadError, (req: Request, res: Response): void => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
      return;
    }
    
    // Set proper response headers
    res.setHeader('Content-Type', 'application/json');
    
    // Return just the filename
    res.status(200).json({
      success: true,
      filename: req.file.filename,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to upload image'
    });
  }
});

export default router;
