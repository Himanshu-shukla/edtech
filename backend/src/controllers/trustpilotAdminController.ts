import { Request, Response } from 'express';
import { TrustpilotReviewModel } from '../models';
import { getImageUrl } from '../middleware';
import fs from 'fs';
import path from 'path';

// Create a trustpilot review with avatar image upload support
export const createTrustpilotReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviewData = req.body;
    
    // If there's an image uploaded via multer middleware, save the filename to the avatar field
    if (req.file) {
      reviewData.avatar = req.file.filename;
    }

    // Generate ID if not provided
    if (!reviewData.id) {
      reviewData.id = `trustpilot-${Date.now()}`;
    }

    // Create new trustpilot review
    const review = new TrustpilotReviewModel(reviewData);
    await review.save();

    // Transform the avatar URL in the response
    const responseData = review.toObject() as any;
    if (responseData.avatar) {
      responseData.avatar = getImageUrl(responseData.avatar, req, 'trustpilot');
    }

    res.status(201).json({
      success: true,
      message: 'Trustpilot review created successfully.',
      data: responseData
    });
  } catch (error: any) {
    console.error('Create trustpilot review error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      res.status(409).json({
        success: false,
        message: 'A trustpilot review with this ID already exists.',
        error: error.message
      });
      return;
    }

    res.status(400).json({
      success: false,
      message: 'Invalid data for trustpilot review creation.',
      error: error.message
    });
  }
};

// Update a trustpilot review with avatar image upload support
export const updateTrustpilotReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const reviewData = req.body;
    
    // If there's an image uploaded via multer middleware, save the filename to the avatar field
    if (req.file) {
      reviewData.avatar = req.file.filename;
    }

    const review = await TrustpilotReviewModel.findByIdAndUpdate(id, reviewData, { 
      new: true, 
      runValidators: true 
    });
    
    if (!review) {
      res.status(404).json({
        success: false,
        message: 'Trustpilot review not found.'
      });
      return;
    }

    // Transform the avatar URL in the response
    const responseData = review.toObject() as any;
    if (responseData.avatar) {
      responseData.avatar = getImageUrl(responseData.avatar, req, 'trustpilot');
    }

    res.json({
      success: true,
      message: 'Trustpilot review updated successfully.',
      data: responseData
    });
  } catch (error: any) {
    console.error('Update trustpilot review error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      res.status(409).json({
        success: false,
        message: 'A trustpilot review with this ID already exists.',
        error: error.message
      });
      return;
    }

    res.status(400).json({
      success: false,
      message: 'Invalid data for trustpilot review update.',
      error: error.message
    });
  }
};

// Get all trustpilot reviews with avatar URLs
export const getAllTrustpilotReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await TrustpilotReviewModel.find({}).sort({ createdAt: -1 });
    
    // Transform avatar URLs in the response
    const transformedReviews = reviews.map(review => {
      const reviewObj = review.toObject() as any;
      if (reviewObj.avatar) {
        reviewObj.avatar = getImageUrl(reviewObj.avatar, req, 'trustpilot');
      }
      return reviewObj;
    });

    res.json({
      success: true,
      message: 'Trustpilot reviews retrieved successfully.',
      data: transformedReviews
    });
  } catch (error: any) {
    console.error('Get all trustpilot reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving trustpilot reviews.'
    });
  }
};

// Get a single trustpilot review by ID with avatar URL
export const getTrustpilotReviewById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const review = await TrustpilotReviewModel.findById(id);
    
    if (!review) {
      res.status(404).json({
        success: false,
        message: 'Trustpilot review not found.'
      });
      return;
    }

    // Transform avatar URL in the response
    const responseData = review.toObject() as any;
    if (responseData.avatar) {
      responseData.avatar = getImageUrl(responseData.avatar, req, 'trustpilot');
    }

    res.json({
      success: true,
      message: 'Trustpilot review retrieved successfully.',
      data: responseData
    });
  } catch (error: any) {
    console.error('Get trustpilot review by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving trustpilot review.'
    });
  }
};

// Delete a trustpilot review (avatar image deletion handled by mongoose pre-hook)
export const deleteTrustpilotReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const review = await TrustpilotReviewModel.findByIdAndDelete(id);
    
    if (!review) {
      res.status(404).json({
        success: false,
        message: 'Trustpilot review not found.'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Trustpilot review deleted successfully.'
    });
  } catch (error: any) {
    console.error('Delete trustpilot review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting trustpilot review.'
    });
  }
};
