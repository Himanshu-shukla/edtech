import mongoose, { Document, Schema, Model } from 'mongoose';

// Coupon interface
export interface ICoupon extends Document {
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  courseIds: string[];
  isActive: boolean;
  expiryDate?: Date;
  usageLimit?: number;
  usedCount: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  
  // Virtual properties
  isExpired: boolean;
  isUsageLimitReached: boolean;
  isValid: boolean;
  
  // Instance methods
  calculateDiscount(originalPrice: number): {
    discountAmount: number;
    finalPrice: number;
    savings: number;
  };
}

// Static methods interface
export interface ICouponModel extends Model<ICoupon> {
  validateCoupon(code: string, courseId: string, originalPrice: number): Promise<ICoupon>;
  applyCoupon(code: string, courseId: string, originalPrice: number): Promise<{
    coupon: {
      code: string;
      description?: string;
      discountType: 'percentage' | 'flat';
      discountValue: number;
    };
    discount: {
      discountAmount: number;
      finalPrice: number;
      savings: number;
    };
  }>;
}

// Coupon Schema
const CouponSchema: Schema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
    match: /^[A-Z0-9]+$/
  },
  discountType: {
    type: String,
    required: true,
    enum: ['percentage', 'flat'],
    default: 'percentage'
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function(this: ICoupon, value: number) {
        if (this.discountType === 'percentage') {
          return value > 0 && value <= 100;
        }
        return value > 0;
      },
      message: 'Invalid discount value for the selected discount type'
    }
  },
  courseIds: {
    type: [String],
    required: true,
    index: true,
    validate: {
      validator: function(value: string[]) {
        return value && value.length > 0;
      },
      message: 'At least one course must be selected'
    }
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  expiryDate: {
    type: Date,
    default: null,
    validate: {
      validator: function(value: Date) {
        return !value || value > new Date();
      },
      message: 'Expiry date must be in the future'
    }
  },
  usageLimit: {
    type: Number,
    default: null,
    min: 1
  },
  usedCount: {
    type: Number,
    default: 0,
    min: 0
  },
  minPurchaseAmount: {
    type: Number,
    default: null,
    min: 0
  },
  maxDiscountAmount: {
    type: Number,
    default: null,
    min: 0
  },
  description: {
    type: String,
    maxlength: 200,
    trim: true
  },
  createdBy: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
CouponSchema.index({ code: 1, courseId: 1 });
CouponSchema.index({ isActive: 1, expiryDate: 1 });
CouponSchema.index({ courseId: 1, isActive: 1 });

// Virtual for checking if coupon is expired
CouponSchema.virtual('isExpired').get(function(this: ICoupon) {
  return this.expiryDate ? this.expiryDate < new Date() : false;
});

// Virtual for checking if usage limit reached
CouponSchema.virtual('isUsageLimitReached').get(function(this: ICoupon) {
  return this.usageLimit ? this.usedCount >= this.usageLimit : false;
});

// Virtual for checking if coupon is valid (active, not expired, not over-used)
CouponSchema.virtual('isValid').get(function(this: ICoupon) {
  return this.isActive && !this.isExpired && !this.isUsageLimitReached;
});

// Instance method to calculate discount
CouponSchema.methods.calculateDiscount = function(this: ICoupon, originalPrice: number) {
  let discountAmount = 0;
  
  // Check minimum purchase amount
  if (this.minPurchaseAmount && originalPrice < this.minPurchaseAmount) {
    throw new Error(`Minimum purchase amount of £${this.minPurchaseAmount} required for this coupon`);
  }
  
  // Calculate discount based on type
  if (this.discountType === 'percentage') {
    discountAmount = (originalPrice * this.discountValue) / 100;
  } else {
    discountAmount = this.discountValue;
  }
  
  // Apply maximum discount limit if set
  if (this.maxDiscountAmount && discountAmount > this.maxDiscountAmount) {
    discountAmount = this.maxDiscountAmount;
  }
  
  // Ensure discount doesn't exceed original price
  discountAmount = Math.min(discountAmount, originalPrice);
  
  const finalPrice = originalPrice - discountAmount;
  
  return {
    discountAmount: Math.round(discountAmount * 100) / 100, // Round to 2 decimal places
    finalPrice: Math.round(finalPrice * 100) / 100,
    savings: Math.round(discountAmount * 100) / 100
  };
};

// Static method to validate coupon for a course
CouponSchema.statics.validateCoupon = async function(code: string, courseId: string, originalPrice: number) {
  const coupon = await this.findOne({ 
    code: code.toUpperCase(), 
    courseIds: courseId,
    isActive: true 
  });
  
  if (!coupon) {
    throw new Error('Invalid or inactive coupon code');
  }
  
  if (coupon.isExpired) {
    throw new Error('This coupon has expired');
  }
  
  if (coupon.isUsageLimitReached) {
    throw new Error('This coupon has reached its usage limit');
  }
  
  if (coupon.minPurchaseAmount && originalPrice < coupon.minPurchaseAmount) {
    throw new Error(`Minimum purchase amount of £${coupon.minPurchaseAmount} required for this coupon`);
  }
  
  return coupon;
};

// Static method to apply coupon and increment usage
CouponSchema.statics.applyCoupon = async function(code: string, courseId: string, originalPrice: number) {
  const coupon = await (this as any).validateCoupon(code, courseId, originalPrice);
  const discountInfo = coupon.calculateDiscount(originalPrice);
  
  // Increment usage count
  await coupon.updateOne({ $inc: { usedCount: 1 } });
  
  return {
    coupon: {
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue
    },
    discount: discountInfo
  };
};

// Pre-save middleware to uppercase code
CouponSchema.pre('save', function(this: ICoupon, next) {
  this.code = this.code.toUpperCase();
  next();
});

export const CouponModel = mongoose.model<ICoupon, ICouponModel>('Coupon', CouponSchema);
export default CouponModel;
