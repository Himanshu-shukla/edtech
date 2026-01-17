import mongoose, { Schema, Document } from 'mongoose';
import { Course, CourseDetails, CoursePricing } from '../types';
import fs from 'fs';
import path from 'path';

// Course Schema
const CourseSchema = new Schema<Course & Document>({
  id: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  badge: { type: String, required: true },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  duration: { type: String, required: true },
  extra: { type: String, required: true },
  accent: { 
    type: String, 
    required: true,
    enum: ['edtech-green', 'edtech-orange', 'edtech-red']
  },
  iconName: { type: String },
  featured: { type: Boolean, default: false },
  image: { type: String }
}, { timestamps: true });

// Course Details Schema
const CourseDetailsSchema = new Schema<CourseDetails & Document>({
  courseId: { type: String, required: true, unique: true },
  overview: { type: String, required: true },
  features: [{
    icon: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true }
  }],
  curriculum: [{
    module: { type: String, required: true },
    duration: { type: String, required: true },
    topics: [{
      topic: { type: String, required: true },
      subtopics: [{ type: String, required: true }]
    }]
  }],
  tools: [{
    name: { type: String, required: true },
    icon: { type: String, required: true }
  }],
  prerequisites: { type: String, required: true },
  testimonials: [{
    name: { type: String, required: true },
    role: { type: String, required: true },
    avatar: { type: String, required: true },
    rating: { type: Number, required: true },
    content: { type: String, required: true },
    color: { type: String, required: true }
  }],
  successStats: [{
    label: { type: String, required: true },
    value: { type: String, required: true },
    color: { type: String, required: true }
  }],
  pricing: {
    current: { type: Number, required: true },
    original: { type: Number, required: true },
    discount: { type: String, required: true },
    deadline: { type: String, required: true },
    features: [{
      text: { type: String, required: true },
      icon: { type: String, required: true }
    }]
  },
  courseInfo: {
    startDate: { type: String, required: true },
    format: { type: String, required: true },
    support: { type: String, required: true },
    studentsEnrolled: { type: String, required: true }
  },
  trustIndicators: {
    rating: { type: String, required: true },
    reviewCount: { type: String, required: true },
    testimonialPreview: {
      text: { type: String, required: true },
      author: { type: String, required: true }
    }
  }
}, { timestamps: true });

// Course Pricing Schema
const CoursePricingSchema = new Schema<CoursePricing & Document>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  installmentPrice: { type: Number, required: true },
  installmentMonths: { type: Number, required: true },
  discount: { type: String, required: true },
  duration: { type: String, required: true },
  extra: { type: String, required: true },
  description: { type: String, required: true },
  features: [{ type: String, required: true }],
  highlighted: { type: Boolean, required: true },
  accent: { 
    type: String, 
    required: true,
    enum: ['edtech-green', 'edtech-orange', 'edtech-red', 'edtech-blue']
  },
  badge: { type: String, required: true },
  cta: { type: String, required: true },
  popular: { type: Boolean, default: false }
}, { timestamps: true });


// Helper method to delete image file when course is deleted
CourseSchema.pre('findOneAndDelete', async function(next) {
  try {
    // @ts-ignore - get the document that will be deleted
    const doc = await this.model.findOne(this.getFilter());
    if (doc && doc.image) {
      // Don't delete if it's a URL (legacy data)
      if (!doc.image.startsWith('http')) {
        const imagePath = path.join(__dirname, '../../../uploads/course-images', doc.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }
    next();
  } catch (error) {
    console.error('Error deleting course image file:', error);
    next();
  }
});

// Helper method to clean up old image when updating with a new one
CourseSchema.pre('findOneAndUpdate', async function(next) {
  try {
    const update = this.getUpdate() as any;
    if (!update || !update.image) {
      return next();
    }
    const doc = await this.model.findOne(this.getFilter()) as any;
    if (doc && doc.image && update.image !== doc.image) {
      if (!doc.image.startsWith('http')) {
        const oldImagePath = path.join(__dirname, '../../../uploads/course-images', doc.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }
    next();
  } catch (error) {
    console.error('Error cleaning up old course image file:', error);
    next();
  }
});

// Create and export models
export const CourseModel = mongoose.model<Course & Document>('Course', CourseSchema);
export const CourseDetailsModel = mongoose.model<CourseDetails & Document>('CourseDetails', CourseDetailsSchema);
export const CoursePricingModel = mongoose.model<CoursePricing & Document>('CoursePricing', CoursePricingSchema);
