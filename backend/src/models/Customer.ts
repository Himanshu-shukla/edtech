import mongoose, { Schema, Document } from 'mongoose';

// Customer Status Enum
export enum CustomerStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  INSTALLMENT_PENDING = 'installment_pending' // New status for installment inquiries
}

// Payment Status Enum
export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

// Payment Type Enum
export enum PaymentType {
  FULL_PAYMENT = 'full_payment',
  INSTALLMENT = 'installment'
}

// Customer Interface
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  courseId: string;
  courseName: string;
  courseCategory: string;
  paymentType: PaymentType;
  paymentStatus: PaymentStatus;
  customerStatus: CustomerStatus;
  amount: number;
  currency: string;
  paymentId?: string;
  orderId?: string;
  installmentDetails?: {
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    installmentCount: number;
    nextDueDate?: Date;
  };
  notes?: string;
  source: string; // 'payment_modal', 'installment_form', 'contact_form', 'pricing_section'
  createdAt: Date;
  updatedAt: Date;
}

// Customer Schema
const CustomerSchema = new Schema<Customer & Document>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  courseId: { type: String, required: true },
  courseName: { type: String, required: true },
  courseCategory: { type: String, required: true },
  paymentType: { 
    type: String, 
    required: true,
    enum: Object.values(PaymentType),
    default: PaymentType.FULL_PAYMENT
  },
  paymentStatus: { 
    type: String, 
    required: true,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING
  },
  customerStatus: { 
    type: String, 
    required: true,
    enum: Object.values(CustomerStatus),
    default: CustomerStatus.PENDING
  },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: 'GBP' },
  paymentId: { type: String },
  orderId: { type: String },
  installmentDetails: {
    totalAmount: { type: Number },
    paidAmount: { type: Number, default: 0 },
    remainingAmount: { type: Number },
    installmentCount: { type: Number },
    nextDueDate: { type: Date }
  },
  notes: { type: String },
  source: { type: String, required: true }
}, { timestamps: true });

// Create indexes for better query performance
CustomerSchema.index({ email: 1 });
CustomerSchema.index({ courseId: 1 });
CustomerSchema.index({ paymentStatus: 1 });
CustomerSchema.index({ customerStatus: 1 });
CustomerSchema.index({ createdAt: -1 });
CustomerSchema.index({ source: 1 });

export const CustomerModel = mongoose.model<Customer & Document>('Customer', CustomerSchema);
