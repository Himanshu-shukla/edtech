import { Request, Response } from 'express';
import { CouponModel } from '../models';

// Validate coupon for frontend use
export const validateCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { couponCode, courseId, originalPrice } = req.body;

    // Validate required fields
    if (!couponCode || !courseId || !originalPrice) {
      res.status(400).json({
        success: false,
        error: 'Coupon code, course ID, and original price are required'
      });
      return;
    }

    // Validate original price
    if (typeof originalPrice !== 'number' || originalPrice <= 0) {
      res.status(400).json({
        success: false,
        error: 'Invalid original price'
      });
      return;
    }

    try {
      // Validate coupon using static method
      const coupon = await CouponModel.validateCoupon(couponCode, courseId, originalPrice);
      const discountInfo = coupon.calculateDiscount(originalPrice);

      res.json({
        success: true,
        valid: true,
        coupon: {
          code: coupon.code,
          description: coupon.description,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue
        },
        discount: {
          type: coupon.discountType,
          value: coupon.discountValue,
          amount: discountInfo.discountAmount,
          finalPrice: discountInfo.finalPrice,
          savings: discountInfo.savings
        }
      });
    } catch (couponError: any) {
      res.status(400).json({
        success: false,
        valid: false,
        error: couponError.message
      });
    }
  } catch (error) {
    console.error('Error validating coupon:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Get all coupons (Admin only)
export const getAllCoupons = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      courseId, 
      isActive,
      discountType,
      search 
    } = req.query;

    const query: any = {};

    // Apply filters
    if (courseId) query.courseIds = courseId;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (discountType) query.discountType = discountType;
    
    // Search by code or description
    if (search) {
      query.$or = [
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const [coupons, total] = await Promise.all([
      CouponModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      CouponModel.countDocuments(query)
    ]);

    // Add computed fields
    const couponsWithStatus = coupons.map(coupon => ({
      ...coupon,
      isExpired: coupon.expiryDate ? coupon.expiryDate < new Date() : false,
      isUsageLimitReached: coupon.usageLimit ? coupon.usedCount >= coupon.usageLimit : false,
      remainingUses: coupon.usageLimit ? Math.max(0, coupon.usageLimit - coupon.usedCount) : null
    }));

    res.json({
      success: true,
      coupons: couponsWithStatus,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Get coupon by ID (Admin only)
export const getCouponById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const coupon = await CouponModel.findById(id);
    
    if (!coupon) {
      res.status(404).json({
        success: false,
        error: 'Coupon not found'
      });
      return;
    }

    res.json({
      success: true,
      coupon: {
        ...coupon.toObject(),
        isExpired: coupon.isExpired,
        isUsageLimitReached: coupon.isUsageLimitReached,
        remainingUses: coupon.usageLimit ? Math.max(0, coupon.usageLimit - coupon.usedCount) : null
      }
    });
  } catch (error) {
    console.error('Error fetching coupon:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Create new coupon (Admin only)
export const createCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      code,
      discountType,
      discountValue,
      courseIds,
      isActive = true,
      expiryDate,
      usageLimit,
      minPurchaseAmount,
      maxDiscountAmount,
      description
    } = req.body;

    // Validate required fields
    if (!code || !discountType || !discountValue || !courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
      res.status(400).json({
        success: false,
        error: 'Code, discount type, discount value, and at least one course are required'
      });
      return;
    }

    // Check if coupon code already exists
    const existingCoupon = await CouponModel.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      res.status(400).json({
        success: false,
        error: 'Coupon code already exists'
      });
      return;
    }

    // Get admin user ID from auth middleware
    const createdBy = (req as any).user?.id || 'admin';

    const coupon = new CouponModel({
      code,
      discountType,
      discountValue,
      courseIds,
      isActive,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      usageLimit,
      minPurchaseAmount,
      maxDiscountAmount,
      description,
      createdBy
    });

    await coupon.save();

    res.status(201).json({
      success: true,
      coupon: {
        ...coupon.toObject(),
        isExpired: coupon.isExpired,
        isUsageLimitReached: coupon.isUsageLimitReached
      },
      message: 'Coupon created successfully'
    });
  } catch (error: any) {
    console.error('Error creating coupon:', error);
    
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        error: 'Coupon code already exists'
      });
      return;
    }
    
    if (error.name === 'ValidationError') {
      const errorMessage = Object.values(error.errors).map((err: any) => err.message).join(', ');
      res.status(400).json({
        success: false,
        error: errorMessage
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Update coupon (Admin only)
export const updateCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      code,
      discountType,
      discountValue,
      courseIds,
      isActive,
      expiryDate,
      usageLimit,
      minPurchaseAmount,
      maxDiscountAmount,
      description
    } = req.body;

    const coupon = await CouponModel.findById(id);
    
    if (!coupon) {
      res.status(404).json({
        success: false,
        error: 'Coupon not found'
      });
      return;
    }

    // Check if updating code to an existing one
    if (code && code.toUpperCase() !== coupon.code) {
      const existingCoupon = await CouponModel.findOne({ 
        code: code.toUpperCase(),
        _id: { $ne: id }
      });
      if (existingCoupon) {
        res.status(400).json({
          success: false,
          error: 'Coupon code already exists'
        });
        return;
      }
    }

    // Update fields
    if (code !== undefined) coupon.code = code;
    if (discountType !== undefined) coupon.discountType = discountType;
    if (discountValue !== undefined) coupon.discountValue = discountValue;
    if (courseIds !== undefined) coupon.courseIds = courseIds;
    if (isActive !== undefined) coupon.isActive = isActive;
    if (expiryDate !== undefined) coupon.expiryDate = expiryDate ? new Date(expiryDate) : undefined;
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
    if (minPurchaseAmount !== undefined) coupon.minPurchaseAmount = minPurchaseAmount;
    if (maxDiscountAmount !== undefined) coupon.maxDiscountAmount = maxDiscountAmount;
    if (description !== undefined) coupon.description = description;

    await coupon.save();

    res.json({
      success: true,
      coupon: {
        ...coupon.toObject(),
        isExpired: coupon.isExpired,
        isUsageLimitReached: coupon.isUsageLimitReached
      },
      message: 'Coupon updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating coupon:', error);
    
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        error: 'Coupon code already exists'
      });
      return;
    }
    
    if (error.name === 'ValidationError') {
      const errorMessage = Object.values(error.errors).map((err: any) => err.message).join(', ');
      res.status(400).json({
        success: false,
        error: errorMessage
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Delete coupon (Admin only)
export const deleteCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const coupon = await CouponModel.findById(id);
    
    if (!coupon) {
      res.status(404).json({
        success: false,
        error: 'Coupon not found'
      });
      return;
    }

    // Check if coupon has been used
    if (coupon.usedCount > 0) {
      res.status(400).json({
        success: false,
        error: 'Cannot delete coupon that has been used. Consider deactivating it instead.'
      });
      return;
    }

    await CouponModel.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Get coupon analytics (Admin only)
export const getCouponAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId, days = 30 } = req.query;
    
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - Number(days));

    const matchQuery: any = { createdAt: { $gte: dateLimit } };
    if (courseId) matchQuery.courseId = courseId;

    const analytics = await CouponModel.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalCoupons: { $sum: 1 },
          activeCoupons: { $sum: { $cond: ['$isActive', 1, 0] } },
          totalRedemptions: { $sum: '$usedCount' },
          percentageDiscounts: { $sum: { $cond: [{ $eq: ['$discountType', 'percentage'] }, 1, 0] } },
          flatDiscounts: { $sum: { $cond: [{ $eq: ['$discountType', 'flat'] }, 1, 0] } }
        }
      }
    ]);

    const topCoupons = await CouponModel.find(matchQuery)
      .sort({ usedCount: -1 })
      .limit(5)
      .select('code usedCount discountType discountValue courseId');

    res.json({
      success: true,
      analytics: analytics[0] || {
        totalCoupons: 0,
        activeCoupons: 0,
        totalRedemptions: 0,
        percentageDiscounts: 0,
        flatDiscounts: 0
      },
      topCoupons
    });
  } catch (error) {
    console.error('Error fetching coupon analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
