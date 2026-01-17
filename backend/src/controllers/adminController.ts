import { Request, Response } from 'express';
import {
  CourseModel,
  CourseDetailsModel,
  CoursePricingModel,
  BlogPostModel,
  CompanyInfoModel,
  TeamMemberModel,
  ValueModel,
  StatModel,
  MilestoneModel,
  ContactDataModel,
  UpcomingSkillModel,
  HighlightedCountriesModel,
  MentorModel,
  MentorFeatureModel,
  CompanyLogoModel,
  FAQModel,
  AdvantageStatModel,
  TestimonialModel,
  SuccessStatModel
} from '../models';
import { PaymentTransactionModel } from '../models/Payment';
import { CustomerModel } from '../models/Customer';
import { InquiryModel } from '../models/Inquiry';
import { getImageUrl } from '../middleware';

// Generic CRUD operations for any model
class AdminController {
  
  /**
   * Generic GET all items for a model
   */
  static getAll = (Model: any) => async (req: Request, res: Response): Promise<void> => {
    try {
      const items = await Model.find({}).sort({ createdAt: -1 });
      res.json({
        success: true,
        message: `${Model.modelName} items retrieved successfully.`,
        data: items
      });
    } catch (error: any) {
      console.error(`Get all ${Model.modelName} error:`, error);
      res.status(500).json({
        success: false,
        message: `Server error while retrieving ${Model.modelName} items.`
      });
    }
  };

  /**
   * Generic GET single item by ID
   */
  static getById = (Model: any) => async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const item = await Model.findById(id);
      
      if (!item) {
        res.status(404).json({
          success: false,
          message: `${Model.modelName} not found.`
        });
        return;
      }

      res.json({
        success: true,
        message: `${Model.modelName} retrieved successfully.`,
        data: item
      });
    } catch (error: any) {
      console.error(`Get ${Model.modelName} by ID error:`, error);
      res.status(500).json({
        success: false,
        message: `Server error while retrieving ${Model.modelName}.`
      });
    }
  };

  /**
   * Generic CREATE item
   */
  static create = (Model: any) => async (req: Request, res: Response): Promise<void> => {
    try {
      const item = new Model(req.body);
      await item.save();

      res.status(201).json({
        success: true,
        message: `${Model.modelName} created successfully.`,
        data: item
      });
    } catch (error: any) {
      console.error(`Create ${Model.modelName} error:`, error);
      
      if (error.code === 11000) {
        res.status(409).json({
          success: false,
          message: `${Model.modelName} with this identifier already exists.`
        });
        return;
      }

      res.status(400).json({
        success: false,
        message: `Invalid data for ${Model.modelName} creation.`,
        error: error.message
      });
    }
  };

  /**
   * Generic UPDATE item by ID
   */
  static update = (Model: any) => async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const item = await Model.findByIdAndUpdate(id, req.body, { 
        new: true, 
        runValidators: true 
      });
      
      if (!item) {
        res.status(404).json({
          success: false,
          message: `${Model.modelName} not found.`
        });
        return;
      }

      res.json({
        success: true,
        message: `${Model.modelName} updated successfully.`,
        data: item
      });
    } catch (error: any) {
      console.error(`Update ${Model.modelName} error:`, error);
      res.status(400).json({
        success: false,
        message: `Invalid data for ${Model.modelName} update.`,
        error: error.message
      });
    }
  };

  /**
   * Generic DELETE item by ID
   */
  static delete = (Model: any) => async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const item = await Model.findByIdAndDelete(id);
      
      if (!item) {
        res.status(404).json({
          success: false,
          message: `${Model.modelName} not found.`
        });
        return;
      }

      res.json({
        success: true,
        message: `${Model.modelName} deleted successfully.`
      });
    } catch (error: any) {
      console.error(`Delete ${Model.modelName} error:`, error);
      res.status(500).json({
        success: false,
        message: `Server error while deleting ${Model.modelName}.`
      });
    }
  };
}

// Course Controllers
export const getAllCourses = AdminController.getAll(CourseModel);
export const getCourseById = AdminController.getById(CourseModel);
export const createCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const courseData = req.body;
    if (req.file) {
      courseData.image = req.file.filename;
    }
    const course = new CourseModel(courseData);
    await course.save();
    const responseData = course.toObject() as any;
    if (responseData.image) {
      responseData.imageUrl = getImageUrl(responseData.image, req, 'course');
    }
    res.status(201).json({
      success: true,
      message: 'Course created successfully.',
      data: responseData
    });
  } catch (error: any) {
    console.error('Create course error:', error);
    if (error.code === 11000) {
      res.status(409).json({
        success: false,
        message: 'A course with this identifier already exists.',
        error: error.message
      });
      return;
    }
    res.status(400).json({
      success: false,
      message: 'Invalid data for course creation.',
      error: error.message
    });
  }
};

export const updateCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const courseData = req.body;
    if (req.file) {
      courseData.image = req.file.filename;
    }
    const course = await CourseModel.findByIdAndUpdate(id, courseData, {
      new: true,
      runValidators: true
    });
    if (!course) {
      res.status(404).json({
        success: false,
        message: 'Course not found.'
      });
      return;
    }
    const responseData = course.toObject() as any;
    if (responseData.image) {
      responseData.imageUrl = getImageUrl(responseData.image, req, 'course');
    }
    res.json({
      success: true,
      message: 'Course updated successfully.',
      data: responseData
    });
  } catch (error: any) {
    console.error('Update course error:', error);
    if (error.code === 11000) {
      res.status(409).json({
        success: false,
        message: 'A course with this identifier already exists.',
        error: error.message
      });
      return;
    }
    res.status(400).json({
      success: false,
      message: 'Invalid data for course update.',
      error: error.message
    });
  }
};
export const deleteCourse = AdminController.delete(CourseModel);

// Course Details Controllers
export const getAllCourseDetails = AdminController.getAll(CourseDetailsModel);
export const getCourseDetailsById = AdminController.getById(CourseDetailsModel);
export const createCourseDetails = AdminController.create(CourseDetailsModel);
export const updateCourseDetails = AdminController.update(CourseDetailsModel);
export const deleteCourseDetails = AdminController.delete(CourseDetailsModel);

// Course Pricing Controllers
export const getAllCoursePricing = AdminController.getAll(CoursePricingModel);
export const getCoursePricingById = AdminController.getById(CoursePricingModel);
export const createCoursePricing = AdminController.create(CoursePricingModel);
export const updateCoursePricing = AdminController.update(CoursePricingModel);
export const deleteCoursePricing = AdminController.delete(CoursePricingModel);

// Blog Controllers
export const getAllBlogs = AdminController.getAll(BlogPostModel);
export const getBlogById = AdminController.getById(BlogPostModel);
export const createBlog = AdminController.create(BlogPostModel);
export const updateBlog = AdminController.update(BlogPostModel);
export const deleteBlog = AdminController.delete(BlogPostModel);

// Company Info Controllers
export const getAllCompanyInfo = AdminController.getAll(CompanyInfoModel);
export const getCompanyInfoById = AdminController.getById(CompanyInfoModel);
export const createCompanyInfo = AdminController.create(CompanyInfoModel);
export const updateCompanyInfo = AdminController.update(CompanyInfoModel);
export const deleteCompanyInfo = AdminController.delete(CompanyInfoModel);

// Team Member Controllers with image upload support
export const getAllTeamMembers = async (req: Request, res: Response): Promise<void> => {
  try {
    const teamMembers = await TeamMemberModel.find({}).sort({ createdAt: -1 });
    
    // Transform image URLs in the response
    const transformedTeamMembers = teamMembers.map(member => {
      const memberObj = member.toObject() as any;
      if (memberObj.image) {
        memberObj.imageUrl = getImageUrl(memberObj.image, req, 'team');
      }
      return memberObj;
    });

    res.json({
      success: true,
      message: 'Team members retrieved successfully.',
      data: transformedTeamMembers
    });
  } catch (error: any) {
    console.error('Get all team members error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving team members.'
    });
  }
};

export const getTeamMemberById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const teamMember = await TeamMemberModel.findById(id);
    
    if (!teamMember) {
      res.status(404).json({
        success: false,
        message: 'Team member not found.'
      });
      return;
    }

    // Transform image URL in the response
    const responseData = teamMember.toObject() as any;
    if (responseData.image) {
      responseData.imageUrl = getImageUrl(responseData.image, req, 'team');
    }

    res.json({
      success: true,
      message: 'Team member retrieved successfully.',
      data: responseData
    });
  } catch (error: any) {
    console.error('Get team member by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving team member.'
    });
  }
};

export const createTeamMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const teamMemberData = req.body;
    
    // If there's an image uploaded, set the image property to the filename
    if (req.file) {
      teamMemberData.image = req.file.filename;
    }

    // Create new team member
    const teamMember = new TeamMemberModel(teamMemberData);
    await teamMember.save();

    // Transform the image URL in the response
    const responseData = teamMember.toObject() as any;
    if (responseData.image) {
      responseData.imageUrl = getImageUrl(responseData.image, req, 'team');
    }

    res.status(201).json({
      success: true,
      message: 'Team member created successfully.',
      data: responseData
    });
  } catch (error: any) {
    console.error('Create team member error:', error);
    
    if (error.code === 11000) {
      res.status(409).json({
        success: false,
        message: 'A team member with this identifier already exists.',
        error: error.message
      });
      return;
    }

    res.status(400).json({
      success: false,
      message: 'Invalid data for team member creation.',
      error: error.message
    });
  }
};

export const updateTeamMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const teamMemberData = req.body;
    
    // If there's an image uploaded, set the image property to the filename
    if (req.file) {
      teamMemberData.image = req.file.filename;
    }

    const teamMember = await TeamMemberModel.findByIdAndUpdate(id, teamMemberData, { 
      new: true, 
      runValidators: true 
    });
    
    if (!teamMember) {
      res.status(404).json({
        success: false,
        message: 'Team member not found.'
      });
      return;
    }

    // Transform the image URL in the response
    const responseData = teamMember.toObject() as any;
    if (responseData.image) {
      responseData.imageUrl = getImageUrl(responseData.image, req, 'team');
    }

    res.json({
      success: true,
      message: 'Team member updated successfully.',
      data: responseData
    });
  } catch (error: any) {
    console.error('Update team member error:', error);
    
    if (error.code === 11000) {
      res.status(409).json({
        success: false,
        message: 'A team member with this identifier already exists.',
        error: error.message
      });
      return;
    }

    res.status(400).json({
      success: false,
      message: 'Invalid data for team member update.',
      error: error.message
    });
  }
};

export const deleteTeamMember = AdminController.delete(TeamMemberModel);

// Value Controllers
export const getAllValues = AdminController.getAll(ValueModel);
export const getValueById = AdminController.getById(ValueModel);
export const createValue = AdminController.create(ValueModel);
export const updateValue = AdminController.update(ValueModel);
export const deleteValue = AdminController.delete(ValueModel);

// Stat Controllers
export const getAllStats = AdminController.getAll(StatModel);
export const getStatById = AdminController.getById(StatModel);
export const createStat = AdminController.create(StatModel);
export const updateStat = AdminController.update(StatModel);
export const deleteStat = AdminController.delete(StatModel);

// Milestone Controllers
export const getAllMilestones = AdminController.getAll(MilestoneModel);
export const getMilestoneById = AdminController.getById(MilestoneModel);
export const createMilestone = AdminController.create(MilestoneModel);
export const updateMilestone = AdminController.update(MilestoneModel);
export const deleteMilestone = AdminController.delete(MilestoneModel);

// Contact Data Controllers
export const getAllContactData = AdminController.getAll(ContactDataModel);
export const getContactDataById = AdminController.getById(ContactDataModel);
export const createContactData = AdminController.create(ContactDataModel);
export const updateContactData = AdminController.update(ContactDataModel);
export const deleteContactData = AdminController.delete(ContactDataModel);

// Upcoming Skill Controllers
export const getAllUpcomingSkills = AdminController.getAll(UpcomingSkillModel);
export const getUpcomingSkillById = AdminController.getById(UpcomingSkillModel);
export const createUpcomingSkill = AdminController.create(UpcomingSkillModel);
export const updateUpcomingSkill = AdminController.update(UpcomingSkillModel);
export const deleteUpcomingSkill = AdminController.delete(UpcomingSkillModel);

// Highlighted Countries Controllers
export const getAllHighlightedCountries = AdminController.getAll(HighlightedCountriesModel);
export const getHighlightedCountriesById = AdminController.getById(HighlightedCountriesModel);
export const createHighlightedCountries = AdminController.create(HighlightedCountriesModel);
export const updateHighlightedCountries = AdminController.update(HighlightedCountriesModel);
export const deleteHighlightedCountries = AdminController.delete(HighlightedCountriesModel);

// Mentor Controllers
export const getAllMentors = AdminController.getAll(MentorModel);
export const getMentorById = AdminController.getById(MentorModel);
export const createMentor = AdminController.create(MentorModel);
export const updateMentor = AdminController.update(MentorModel);
export const deleteMentor = AdminController.delete(MentorModel);

// Mentor Feature Controllers
export const getAllMentorFeatures = AdminController.getAll(MentorFeatureModel);
export const getMentorFeatureById = AdminController.getById(MentorFeatureModel);
export const createMentorFeature = AdminController.create(MentorFeatureModel);
export const updateMentorFeature = AdminController.update(MentorFeatureModel);
export const deleteMentorFeature = AdminController.delete(MentorFeatureModel);

// Company Logo Controllers
export const getAllCompanyLogos = AdminController.getAll(CompanyLogoModel);
export const getCompanyLogoById = AdminController.getById(CompanyLogoModel);
export const createCompanyLogo = AdminController.create(CompanyLogoModel);
export const updateCompanyLogo = AdminController.update(CompanyLogoModel);
export const deleteCompanyLogo = AdminController.delete(CompanyLogoModel);

// FAQ Controllers
export const getAllFAQs = AdminController.getAll(FAQModel);
export const getFAQById = AdminController.getById(FAQModel);
export const createFAQ = AdminController.create(FAQModel);
export const updateFAQ = AdminController.update(FAQModel);
export const deleteFAQ = AdminController.delete(FAQModel);

// Advantage Stat Controllers
export const getAllAdvantageStats = AdminController.getAll(AdvantageStatModel);
export const getAdvantageStatById = AdminController.getById(AdvantageStatModel);
export const createAdvantageStat = AdminController.create(AdvantageStatModel);
export const updateAdvantageStat = AdminController.update(AdvantageStatModel);
export const deleteAdvantageStat = AdminController.delete(AdvantageStatModel);

// Testimonial Controllers
export const getAllTestimonials = AdminController.getAll(TestimonialModel);
export const getTestimonialById = AdminController.getById(TestimonialModel);
export const createTestimonial = AdminController.create(TestimonialModel);
export const updateTestimonial = AdminController.update(TestimonialModel);
export const deleteTestimonial = AdminController.delete(TestimonialModel);

// Success Stat Controllers
export const getAllSuccessStats = AdminController.getAll(SuccessStatModel);
export const getSuccessStatById = AdminController.getById(SuccessStatModel);
export const createSuccessStat = AdminController.create(SuccessStatModel);
export const updateSuccessStat = AdminController.update(SuccessStatModel);
export const deleteSuccessStat = AdminController.delete(SuccessStatModel);

/**
 * Dashboard statistics
 */
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    // Parallel data fetching for performance
    const [
      // Revenue Metrics
      totalRevenue,
      monthlyRevenue,
      previousMonthRevenue,
      totalTransactions,
      
      // Customer Metrics
      totalCustomers,
      newCustomers,
      previousMonthCustomers,
      paidCustomers,
      pendingCustomers,
      
      // Inquiry Metrics
      totalInquiries,
      newInquiries,
      previousMonthInquiries,
      convertedInquiries,
      
      // Top Courses
      topCourses,
      
      // Content Counts
      coursesCount,
      blogsCount,
      teamMembersCount
    ] = await Promise.all([
      // Revenue calculations
      PaymentTransactionModel.aggregate([
        { $match: { status: 'success' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      PaymentTransactionModel.aggregate([
        { $match: { status: 'success', paymentDate: { $gte: thirtyDaysAgo } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      PaymentTransactionModel.aggregate([
        { $match: { status: 'success', paymentDate: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      PaymentTransactionModel.countDocuments({ status: 'success' }),
      
      // Customer calculations
      CustomerModel.countDocuments(),
      CustomerModel.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      CustomerModel.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } }),
      CustomerModel.countDocuments({ paymentStatus: 'paid' }),
      CustomerModel.countDocuments({ paymentStatus: 'pending' }),
      
      // Inquiry calculations
      InquiryModel.countDocuments(),
      InquiryModel.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      InquiryModel.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } }),
      InquiryModel.countDocuments({ status: 'converted' }),
      
      // Top performing courses
      PaymentTransactionModel.aggregate([
        { $match: { status: 'success' } },
        { 
          $group: { 
            _id: '$courseInfo.courseId',
            courseName: { $first: '$courseInfo.courseName' },
            revenue: { $sum: '$amount' },
            enrollments: { $sum: 1 }
          } 
        },
        { $sort: { revenue: -1 } },
        { $limit: 5 }
      ]),
      
      // Content counts
      CourseModel.countDocuments(),
      BlogPostModel.countDocuments(),
      TeamMemberModel.countDocuments()
    ]);

    // Calculate derived metrics
    const totalRev = totalRevenue[0]?.total || 0;
    const monthlyRev = monthlyRevenue[0]?.total || 0;
    const prevMonthRev = previousMonthRevenue[0]?.total || 0;
    const avgOrderValue = totalTransactions > 0 ? totalRev / totalTransactions : 0;
    
    const revenueGrowth = prevMonthRev > 0 ? ((monthlyRev - prevMonthRev) / prevMonthRev) * 100 : 0;
    const customerGrowth = previousMonthCustomers > 0 ? ((newCustomers - previousMonthCustomers) / previousMonthCustomers) * 100 : 0;
    const inquiryGrowth = previousMonthInquiries > 0 ? ((newInquiries - previousMonthInquiries) / previousMonthInquiries) * 100 : 0;
    const conversionRate = totalInquiries > 0 ? (convertedInquiries / totalInquiries) * 100 : 0;

    res.json({
      success: true,
      message: 'Dashboard statistics retrieved successfully.',
      data: {
        // Revenue Metrics
        totalRevenue: totalRev,
        monthlyRevenue: monthlyRev,
        revenueGrowth: Math.round(revenueGrowth * 100) / 100,
        averageOrderValue: Math.round(avgOrderValue * 100) / 100,
        
        // Customer Metrics
        totalCustomers,
        newCustomers,
        paidCustomers,
        pendingCustomers,
        customerGrowth: Math.round(customerGrowth * 100) / 100,
        
        // Business Performance
        totalInquiries,
        newInquiries,
        convertedInquiries,
        conversionRate: Math.round(conversionRate * 100) / 100,
        inquiryGrowth: Math.round(inquiryGrowth * 100) / 100,
        
        // Top Performance
        topCourses: topCourses.map(course => ({
          courseName: course.courseName || 'Unknown Course',
          revenue: course.revenue,
          enrollments: course.enrollments
        })),
        
        // Content Stats
        courses: coursesCount,
        blogs: blogsCount,
        teamMembers: teamMembersCount,
        
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving dashboard statistics.'
    });
  }
};
