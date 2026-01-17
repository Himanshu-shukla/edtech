import mongoose, { Schema, Document } from 'mongoose';
import { FAQ } from '../types';

// FAQ Schema
const FAQSchema = new Schema<FAQ & Document>({
  id: { type: Number, required: true, unique: true },
  question: { type: String, required: true },
  answer: { type: String, required: true }
}, { timestamps: true });

// Create and export model
export const FAQModel = mongoose.model<FAQ & Document>('FAQ', FAQSchema);
