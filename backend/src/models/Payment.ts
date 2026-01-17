import mongoose, { Schema, Document } from 'mongoose';

// Payment Order Interface
export interface PaymentOrder {
  id: string;
  orderId: string;
  courseId: string;
  courseName: string;
  amount: number;
  currency: string;
  status: 'created' | 'paid' | 'failed' | 'cancelled';
  paymentProvider: 'razorpay' | 'paypal';
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  // Razorpay specific fields
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  // PayPal specific fields
  paypalOrderId?: string;
  paypalPaymentId?: string;
  paypalPayerId?: string;
  notes?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Payment Transaction Interface
export interface PaymentTransaction {
  id: string;
  orderId: string;
  paymentProvider: 'razorpay' | 'paypal';
  // Razorpay specific fields
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
  // PayPal specific fields
  paypalOrderId?: string;
  paypalPaymentId?: string;
  paypalPayerId?: string;
  amount: number;
  currency: string;
  status: 'success' | 'failed' | 'pending';
  method: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  courseInfo: {
    courseId: string;
    courseName: string;
    category: string;
  };
  paymentDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Payment Order Schema
const PaymentOrderSchema = new Schema<PaymentOrder & Document>({
  id: { type: String, required: true, unique: true },
  orderId: { type: String, required: true, unique: true },
  courseId: { type: String, required: true },
  courseName: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: 'GBP' },
  status: { 
    type: String, 
    required: true,
    enum: ['created', 'paid', 'failed', 'cancelled'],
    default: 'created'
  },
  paymentProvider: {
    type: String,
    required: true,
    enum: ['razorpay', 'paypal']
  },
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  // Razorpay specific fields
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  // PayPal specific fields
  paypalOrderId: { type: String },
  paypalPaymentId: { type: String },
  paypalPayerId: { type: String },
  notes: { type: Schema.Types.Mixed, default: {} }
}, { timestamps: true });

// Payment Transaction Schema
const PaymentTransactionSchema = new Schema<PaymentTransaction & Document>({
  id: { type: String, required: true, unique: true },
  orderId: { type: String, required: true },
  paymentProvider: {
    type: String,
    required: true,
    enum: ['razorpay', 'paypal']
  },
  // Razorpay specific fields
  razorpayPaymentId: { type: String },
  razorpayOrderId: { type: String },
  razorpaySignature: { type: String },
  // PayPal specific fields
  paypalOrderId: { type: String },
  paypalPaymentId: { type: String },
  paypalPayerId: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: 'GBP' },
  status: { 
    type: String, 
    required: true,
    enum: ['success', 'failed', 'pending'],
    default: 'pending'
  },
  method: { type: String, required: true },
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  courseInfo: {
    courseId: { type: String, required: true },
    courseName: { type: String, required: true },
    category: { type: String, required: true }
  },
  paymentDate: { type: Date, required: true }
}, { timestamps: true });

// Create and export models
export const PaymentOrderModel = mongoose.model<PaymentOrder & Document>('PaymentOrder', PaymentOrderSchema);
export const PaymentTransactionModel = mongoose.model<PaymentTransaction & Document>('PaymentTransaction', PaymentTransactionSchema);
