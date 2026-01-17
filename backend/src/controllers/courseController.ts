import { Request, Response } from 'express';
import { CourseModel, CourseDetailsModel, CoursePricingModel } from '../models';

// Get all courses
export const getAllCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const courses = await CourseModel.find();
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get featured courses
export const getFeaturedCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const courses = await CourseModel.find({ featured: true }).limit(6);
    res.json(courses);
  } catch (error) {
    console.error('Error fetching featured courses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get course by ID
export const getCourseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const course = await CourseModel.findOne({ id });
    
    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }
    
    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get course details by ID
export const getCourseDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const courseDetails = await CourseDetailsModel.findOne({ courseId: id });
    
    if (!courseDetails) {
      res.status(404).json({ 
        success: false, 
        error: 'Course details not found. This course may not be available for purchase.' 
      });
      return;
    }
    
    res.json(courseDetails);
  } catch (error) {
    console.error('Error fetching course details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all course pricing
export const getCoursePricing = async (req: Request, res: Response): Promise<void> => {
  try {
    const pricing = await CoursePricingModel.find();
    res.json(pricing);
  } catch (error) {
    console.error('Error fetching course pricing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get course pricing by ID
export const getCoursePricingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const pricing = await CoursePricingModel.findOne({ id });
    
    if (!pricing) {
      res.status(404).json({ error: 'Course pricing not found' });
      return;
    }
    
    res.json(pricing);
  } catch (error) {
    console.error('Error fetching course pricing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
