import { Request, Response } from 'express';
import { TestimonialModel } from '../models';
import { getImageUrl } from '../middleware';
import fs from 'fs';
import path from 'path';

// Create a testimonial with image upload support
export const createTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const testimonialData = req.body;
    
    // If there's an image uploaded via multer middleware, save the filename to the photo field
    if (req.file) {
      testimonialData.photo = req.file.filename;
    }

    // Generate ID if not provided
    if (!testimonialData.id) {
      testimonialData.id = `testimonial-${Date.now()}`;
    }

    // Create new testimonial
    const testimonial = new TestimonialModel(testimonialData);
    await testimonial.save();

    // Transform the image URL in the response
    const responseData = testimonial.toObject() as any;
    if (responseData.photo) {
      responseData.photo = getImageUrl(responseData.photo, req, 'testimonial');
    }

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully.',
      data: responseData
    });
  } catch (error: any) {
    console.error('Create testimonial error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      res.status(409).json({
        success: false,
        message: 'A testimonial with this ID already exists.',
        error: error.message
      });
      return;
    }

    res.status(400).json({
      success: false,
      message: 'Invalid data for testimonial creation.',
      error: error.message
    });
  }
};

// Update a testimonial with image upload support
export const updateTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const testimonialData = req.body;
    
    // If there's an image uploaded via multer middleware, save the filename to the photo field
    if (req.file) {
      testimonialData.photo = req.file.filename;
    }

    const testimonial = await TestimonialModel.findByIdAndUpdate(id, testimonialData, { 
      new: true, 
      runValidators: true 
    });
    
    if (!testimonial) {
      res.status(404).json({
        success: false,
        message: 'Testimonial not found.'
      });
      return;
    }

    // Transform the image URL in the response
    const responseData = testimonial.toObject() as any;
    if (responseData.photo) {
      responseData.photo = getImageUrl(responseData.photo, req, 'testimonial');
    }

    res.json({
      success: true,
      message: 'Testimonial updated successfully.',
      data: responseData
    });
  } catch (error: any) {
    console.error('Update testimonial error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      res.status(409).json({
        success: false,
        message: 'A testimonial with this ID already exists.',
        error: error.message
      });
      return;
    }

    res.status(400).json({
      success: false,
      message: 'Invalid data for testimonial update.',
      error: error.message
    });
  }
};

// Get all testimonials with image URLs
export const getAllTestimonials = async (req: Request, res: Response): Promise<void> => {
  try {
    const testimonials = await TestimonialModel.find({}).sort({ createdAt: -1 });
    
    // Transform image URLs in the response
    const transformedTestimonials = testimonials.map(testimonial => {
      const testimonialObj = testimonial.toObject() as any;
      if (testimonialObj.photo) {
        testimonialObj.photo = getImageUrl(testimonialObj.photo, req, 'testimonial');
      }
      return testimonialObj;
    });

    res.json({
      success: true,
      message: 'Testimonials retrieved successfully.',
      data: transformedTestimonials
    });
  } catch (error: any) {
    console.error('Get all testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving testimonials.'
    });
  }
};

// Get a single testimonial by ID with image URL
export const getTestimonialById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const testimonial = await TestimonialModel.findById(id);
    
    if (!testimonial) {
      res.status(404).json({
        success: false,
        message: 'Testimonial not found.'
      });
      return;
    }

    // Transform image URL in the response
    const responseData = testimonial.toObject() as any;
    if (responseData.photo) {
      responseData.photo = getImageUrl(responseData.photo, req, 'testimonial');
    }

    res.json({
      success: true,
      message: 'Testimonial retrieved successfully.',
      data: responseData
    });
  } catch (error: any) {
    console.error('Get testimonial by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving testimonial.'
    });
  }
};

// Delete a testimonial (image deletion handled by mongoose pre-hook)
export const deleteTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const testimonial = await TestimonialModel.findByIdAndDelete(id);
    
    if (!testimonial) {
      res.status(404).json({
        success: false,
        message: 'Testimonial not found.'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Testimonial deleted successfully.'
    });
  } catch (error: any) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting testimonial.'
    });
  }
};
