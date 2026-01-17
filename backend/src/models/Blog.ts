import mongoose, { Schema, Document } from 'mongoose';
import { BlogPost } from '../types';
import fs from 'fs';
import path from 'path';

// Blog Post Schema
const BlogPostSchema = new Schema<BlogPost & Document>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  author: {
    name: { type: String, required: true },
    role: { type: String, required: true },
    avatar: { type: String, required: true }
  },
  category: { type: String, required: true },
  tags: [{ type: String, required: true }],
  publishedAt: { type: String, required: true },
  readTime: { type: Number, required: true },
  featured: { type: Boolean, required: true },
  image: { type: String, required: true } // Stores the filename of the uploaded image
}, { 
  timestamps: true
});

// Add indexes for better query performance
BlogPostSchema.index({ category: 1 });
BlogPostSchema.index({ featured: 1 });
BlogPostSchema.index({ publishedAt: 1 });

// Helper method to delete image file when blog post is deleted
BlogPostSchema.pre('findOneAndDelete', async function(next) {
  try {
    // @ts-ignore - get the document that will be deleted
    const doc = await this.model.findOne(this.getFilter());
    
    if (doc && doc.image) {
      // Don't delete if it's a URL (legacy data)
      if (!doc.image.startsWith('http')) {
        const imagePath = path.join(__dirname, '../../../uploads/blog-images', doc.image);
        
        // Check if file exists before attempting to delete
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);

        }
      }
    }
    next();
  } catch (error) {
    console.error('Error deleting image file:', error);
    next();
  }
});

// Helper method to clean up old image when updating with a new one
BlogPostSchema.pre('findOneAndUpdate', async function(next) {
  try {
    // Get the update data
    const update = this.getUpdate() as any;
    
    // If there's no new image being set, proceed with the update
    if (!update || !update.image) {
      return next();
    }
    
    // Get the document that will be updated
    const doc = await this.model.findOne(this.getFilter()) as any;
    
    // If old document exists, has an image, and we're setting a new image
    if (doc && doc.image && update.image !== doc.image) {
      // Don't delete if old image is a URL (legacy data)
      if (!doc.image.startsWith('http')) {
        const oldImagePath = path.join(__dirname, '../../../uploads/blog-images', doc.image);
        
        // Check if file exists before attempting to delete
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);

        }
      }
    }
    
    next();
  } catch (error) {
    console.error('Error cleaning up old image file:', error);
    next();
  }
});

// Create and export model
export const BlogPostModel = mongoose.model<BlogPost & Document>('BlogPost', BlogPostSchema);
