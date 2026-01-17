import { Request, Response } from 'express';
import { getImageUrl } from '../middleware/upload';
import { 
  FAQModel,
  MentorModel,
  MentorFeatureModel,
  CompanyLogoModel,
  AdvantageStatModel,
  TestimonialModel,
  TrustpilotReviewModel,
  SuccessStatModel,
  CourseIconModel
} from '../models';

// FAQ Controllers
export const getFAQs = async (req: Request, res: Response): Promise<void> => {
  try {
    const faqs = await FAQModel.find().sort({ id: 1 });
    res.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mentor Controllers
export const getMentors = async (req: Request, res: Response): Promise<void> => {
  try {
    const mentors = await MentorModel.find();
    res.json(mentors);
  } catch (error) {
    console.error('Error fetching mentors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMentorFeatures = async (req: Request, res: Response): Promise<void> => {
  try {
    const features = await MentorFeatureModel.find();
    res.json(features);
  } catch (error) {
    console.error('Error fetching mentor features:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPartnerCompanies = async (req: Request, res: Response): Promise<void> => {
  try {
    const companies = await CompanyLogoModel.find();
    res.json(companies);
  } catch (error) {
    console.error('Error fetching partner companies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Statistics Controllers
export const getAdvantageStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await AdvantageStatModel.find();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching advantage stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



// Testimonial Controllers
export const getTestimonials = async (req: Request, res: Response): Promise<void> => {
  try {
    const testimonials = await TestimonialModel.find();
    
    // Add photo URLs to testimonials
    const testimonialsWithUrls = testimonials.map(testimonial => {
      const testimonialObj = testimonial.toObject();
      if (testimonialObj.photo) {
        testimonialObj.photo = getImageUrl(testimonialObj.photo, req, 'testimonial');
      }
      return testimonialObj;
    });
    
    res.json(testimonialsWithUrls);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Trustpilot Review Controllers
export const getTrustpilotReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await TrustpilotReviewModel.find().sort({ createdAt: -1 });
    
    // Add avatar URLs to reviews
    const reviewsWithUrls = reviews.map(review => {
      const reviewObj = review.toObject();
      if (reviewObj.avatar) {
        reviewObj.avatar = getImageUrl(reviewObj.avatar, req, 'trustpilot');
      }
      return reviewObj;
    });
    
    res.json(reviewsWithUrls);
  } catch (error) {
    console.error('Error fetching trustpilot reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Success Stats Controllers
export const getSuccessStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await SuccessStatModel.find();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching success stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Icon Controllers
export const getCourseIcons = async (req: Request, res: Response): Promise<void> => {
  try {
    const icons = await CourseIconModel.find();
    
    // Convert to object format like frontend expects
    const iconsObject = icons.reduce((acc: any, icon: any) => {
      acc[icon.iconName] = icon.iconPath;
      return acc;
    }, {});
    
    res.json(iconsObject);
  } catch (error) {
    console.error('Error fetching course icons:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getIconByName = async (req: Request, res: Response): Promise<void> => {
  try {
    const { iconName } = req.params;
    const icon = await CourseIconModel.findOne({ iconName });
    
    if (!icon) {
      // Return default icon if not found
      const defaultIcon = await CourseIconModel.findOne({ iconName: 'default' });
      if (defaultIcon) {
        res.json({ iconPath: defaultIcon.iconPath });
        return;
      }
      res.status(404).json({ error: 'Icon not found' });
      return;
    }
    
    res.json({ iconPath: icon.iconPath });
  } catch (error) {
    console.error('Error fetching icon:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Combined endpoints for better performance
export const getMentorData = async (req: Request, res: Response): Promise<void> => {
  try {
    const [mentors, features, partnerCompanies] = await Promise.all([
      MentorModel.find(),
      MentorFeatureModel.find(),
      CompanyLogoModel.find()
    ]);
    
    res.json({
      mentors,
      mentorFeatures: features,
      partnerCompanies
    });
  } catch (error) {
    console.error('Error fetching mentor data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getIconsData = async (req: Request, res: Response): Promise<void> => {
  try {
    const icons = await CourseIconModel.find();
    
    // Convert to frontend expected format
    const iconsObject = icons.reduce((acc: any, icon: any) => {
      acc[icon.iconName] = icon.iconPath;
      return acc;
    }, {});
    
    res.json({
      courseIcons: iconsObject
    });
  } catch (error) {
    console.error('Error fetching icons data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
