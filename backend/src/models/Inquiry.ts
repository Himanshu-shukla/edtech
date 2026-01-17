import mongoose, { Schema, Document } from 'mongoose';

// Inquiry Status Enum
export enum InquiryStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  FOLLOWED_UP = 'followed_up',
  CONVERTED = 'converted',
  CLOSED = 'closed',
  SPAM = 'spam'
}

// Inquiry Type Enum
export enum InquiryType {
  CONTACT_FORM = 'contact_form',
  STRATEGY_CALL = 'strategy_call',
  COURSE_INQUIRY = 'course_inquiry',
  GENERAL_INQUIRY = 'general_inquiry',
  INSTALLMENT_INQUIRY = 'installment_inquiry',
  BOOTCAMP = 'bootcamp'
}

// Inquiry Interface
export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: InquiryType;
  status: InquiryStatus;
  subject?: string;
  message?: string;
  courseId?: string;
  courseName?: string;
  source: string; // 'contact_modal', 'strategy_call_modal', 'pricing_section', etc.
  notes?: string;
  assignedTo?: string;
  followUpDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Inquiry Schema
const InquirySchema = new Schema<Inquiry & Document>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: Object.values(InquiryType),
    default: InquiryType.GENERAL_INQUIRY
  },
  status: { 
    type: String, 
    required: true,
    enum: Object.values(InquiryStatus),
    default: InquiryStatus.NEW
  },
  subject: { type: String },
  message: { type: String },
  courseId: { type: String },
  courseName: { type: String },
  source: { type: String, required: true },
  notes: { type: String },
  assignedTo: { type: String },
  followUpDate: { type: Date }
}, { timestamps: true });

// Create indexes for better query performance
InquirySchema.index({ email: 1 });
InquirySchema.index({ type: 1 });
InquirySchema.index({ status: 1 });
InquirySchema.index({ createdAt: -1 });
InquirySchema.index({ source: 1 });
InquirySchema.index({ assignedTo: 1 });

export const InquiryModel = mongoose.model<Inquiry & Document>('Inquiry', InquirySchema);
