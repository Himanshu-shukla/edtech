import mongoose, { Schema, Document } from 'mongoose';
import { CourseIcons } from '../types';

// Course Icons Schema - Store as key-value pairs
const CourseIconsSchema = new Schema<CourseIcons & Document>({
  iconName: { type: String, required: true, unique: true },
  iconPath: { type: String, required: true }
}, { timestamps: true });

// Highlighted Countries Schema
const HighlightedCountriesSchema = new Schema<{ countries: string[] } & Document>({
  countries: [{ type: String, required: true }]
}, { timestamps: true });

// Create and export models
export const CourseIconModel = mongoose.model<{ iconName: string; iconPath: string } & Document>('CourseIcon', CourseIconsSchema);
export const HighlightedCountriesModel = mongoose.model<{ countries: string[] } & Document>('HighlightedCountries', HighlightedCountriesSchema);
