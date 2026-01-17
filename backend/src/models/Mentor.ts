import mongoose, { Schema, Document } from 'mongoose';
import { Mentor, MentorFeature, CompanyLogo } from '../types';

// Mentor Schema
const MentorSchema = new Schema<Mentor & Document>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  company: { type: String, required: true },
  image: { type: String, required: true },
  accent: { 
    type: String, 
    required: true,
    enum: ['blue', 'orange', 'green']
  }
}, { timestamps: true });

// Mentor Feature Schema
const MentorFeatureSchema = new Schema<MentorFeature & Document>({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true }
}, { timestamps: true });

// Company Logo Schema
const CompanyLogoSchema = new Schema<CompanyLogo & Document>({
  name: { type: String, required: true, unique: true },
  logo: { type: String, required: true }
}, { timestamps: true });

// Create and export models
export const MentorModel = mongoose.model<Mentor & Document>('Mentor', MentorSchema);
export const MentorFeatureModel = mongoose.model<MentorFeature & Document>('MentorFeature', MentorFeatureSchema);
export const CompanyLogoModel = mongoose.model<CompanyLogo & Document>('CompanyLogo', CompanyLogoSchema);
