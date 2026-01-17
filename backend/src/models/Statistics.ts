import mongoose, { Schema, Document } from 'mongoose';
import { AdvantageStat, Testimonial, TrustpilotReview } from '../types';
import fs from 'fs';
import path from 'path';

// Advantage Stats Schema
const AdvantageStatSchema = new Schema<AdvantageStat & Document>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  value: { type: String, required: true },
  label: { type: String, required: true },
  description: { type: String, required: true },
  dots: { type: Number, required: true },
  accent: { 
    type: String, 
    required: true,
    enum: ['blue', 'orange', 'green']
  }
}, { timestamps: true });

// Testimonial Schema
const TestimonialSchema = new Schema<Testimonial & Document>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  company: { type: String },
  rating: { type: Number, required: true },
  review: { type: String, required: true },
  category: { type: String, required: true },
  photo: { type: String }, // Add photo field
  accent: { 
    type: String, 
    required: true,
    enum: ['blue', 'orange', 'green', 'red']
  }
}, { timestamps: true });

// Helper method to delete image file when testimonial is deleted
TestimonialSchema.pre('findOneAndDelete', async function(next) {
  try {
    // @ts-ignore - get the document that will be deleted
    const doc = await this.model.findOne(this.getFilter());
    
    if (doc && doc.photo) {
      // Don't delete if it's a URL (legacy data)
      if (!doc.photo.startsWith('http')) {
        const imagePath = path.join(__dirname, '../../../uploads/testimonial-images', doc.photo);
        
        // Check if file exists before attempting to delete
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }
    next();
  } catch (error) {
    console.error('Error deleting testimonial image file:', error);
    next();
  }
});

// Helper method to clean up old image when updating with a new one
TestimonialSchema.pre('findOneAndUpdate', async function(next) {
  try {
    // Get the update data
    const update = this.getUpdate() as any;
    
    // If there's no new image being set, proceed with the update
    if (!update || !update.photo) {
      return next();
    }
    
    // Get the document that will be updated
    const doc = await this.model.findOne(this.getFilter()) as any;
    
    // If old document exists, has an image, and we're setting a new image
    if (doc && doc.photo && update.photo !== doc.photo) {
      // Don't delete if old image is a URL (legacy data)
      if (!doc.photo.startsWith('http')) {
        const oldImagePath = path.join(__dirname, '../../../uploads/testimonial-images', doc.photo);
        
        // Check if file exists before attempting to delete
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }
    
    next();
  } catch (error) {
    console.error('Error cleaning up old testimonial image file:', error);
    next();
  }
});

// Create and export models
export const AdvantageStatModel = mongoose.model<AdvantageStat & Document>('AdvantageStat', AdvantageStatSchema);
export const TestimonialModel = mongoose.model<Testimonial & Document>('Testimonial', TestimonialSchema);

// Trustpilot Review Schema
const TrustpilotReviewSchema = new Schema<TrustpilotReview & Document>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  avatar: { type: String, required: true }, // Image filename
  location: { type: String, required: true },
  reviewCount: { type: Number, required: true, default: 1 },
  rating: { type: Number, required: true, min: 0, max: 5 },
  title: { type: String, required: true },
  review: { type: String, required: true },
  reviewDate: { type: String, required: true },
  verified: { type: Boolean, default: true }
}, { timestamps: true });

// Helper method to delete avatar image file when trustpilot review is deleted
TrustpilotReviewSchema.pre('findOneAndDelete', async function(next) {
  try {
    // @ts-ignore - get the document that will be deleted
    const doc = await this.model.findOne(this.getFilter());
    
    if (doc && doc.avatar) {
      // Don't delete if it's a URL (legacy data)
      if (!doc.avatar.startsWith('http')) {
        const imagePath = path.join(__dirname, '../../../uploads/trustpilot-images', doc.avatar);
        
        // Check if file exists before attempting to delete
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }
    next();
  } catch (error) {
    console.error('Error deleting trustpilot review avatar file:', error);
    next();
  }
});

// Helper method to clean up old avatar when updating with a new one
TrustpilotReviewSchema.pre('findOneAndUpdate', async function(next) {
  try {
    // Get the update data
    const update = this.getUpdate() as any;
    
    // If there's no new avatar being set, proceed with the update
    if (!update || !update.avatar) {
      return next();
    }
    
    // Get the document that will be updated
    const doc = await this.model.findOne(this.getFilter()) as any;
    
    // If old document exists, has an avatar, and we're setting a new avatar
    if (doc && doc.avatar && update.avatar !== doc.avatar) {
      // Don't delete if old avatar is a URL (legacy data)
      if (!doc.avatar.startsWith('http')) {
        const oldImagePath = path.join(__dirname, '../../../uploads/trustpilot-images', doc.avatar);
        
        // Check if file exists before attempting to delete
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }
    
    next();
  } catch (error) {
    console.error('Error cleaning up old trustpilot review avatar file:', error);
    next();
  }
});

export const TrustpilotReviewModel = mongoose.model<TrustpilotReview & Document>('TrustpilotReview', TrustpilotReviewSchema);
