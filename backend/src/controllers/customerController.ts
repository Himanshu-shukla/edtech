import { Request, Response } from 'express';
import { CustomerModel, Customer, CustomerStatus, PaymentStatus, PaymentType } from '../models/Customer';
import { generateId } from '../utils/idGenerator';

// Get all customers with filtering and pagination
export const getAllCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      status,
      paymentStatus,
      paymentType,
      courseId,
      source,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    
    // Build filter object
    const filter: any = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { courseName: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) filter.customerStatus = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (paymentType) filter.paymentType = paymentType;
    if (courseId) filter.courseId = courseId;
    if (source) filter.source = source;
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate as string);
      if (endDate) filter.createdAt.$lte = new Date(endDate as string);
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    const [customers, total] = await Promise.all([
      CustomerModel.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      CustomerModel.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / Number(limit));

    res.json({
      success: true,
      data: customers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customers'
    });
  }
};

// Get customer by ID
export const getCustomerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const customer = await CustomerModel.findOne({ id }).lean();
    
    if (!customer) {
      res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
      return;
    }

    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customer'
    });
  }
};

// Create new customer
export const createCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const customerData = req.body;
    customerData.id = generateId('CUST');
    
    const customer = await CustomerModel.create(customerData);
    
    res.status(201).json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create customer'
    });
  }
};

// Update customer
export const updateCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const customer = await CustomerModel.findOneAndUpdate(
      { id },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!customer) {
      res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
      return;
    }

    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update customer'
    });
  }
};

// Delete customer
export const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const customer = await CustomerModel.findOneAndDelete({ id });
    
    if (!customer) {
      res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete customer'
    });
  }
};

// Get customer statistics
export const getCustomerStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { period = 30 } = req.query;
    const days = Number(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [
      totalCustomers,
      newCustomers,
      paidCustomers,
      pendingCustomers,
      courseStats,
      statusStats,
      paymentTypeStats
    ] = await Promise.all([
      CustomerModel.countDocuments(),
      CustomerModel.countDocuments({ createdAt: { $gte: startDate } }),
      CustomerModel.countDocuments({ paymentStatus: PaymentStatus.PAID }),
      CustomerModel.countDocuments({ paymentStatus: PaymentStatus.PENDING }),
      CustomerModel.aggregate([
        {
          $group: {
            _id: '$courseName',
            count: { $sum: 1 },
            totalRevenue: { $sum: '$amount' }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      CustomerModel.aggregate([
        {
          $group: {
            _id: '$customerStatus',
            count: { $sum: 1 }
          }
        }
      ]),
      CustomerModel.aggregate([
        {
          $group: {
            _id: '$paymentType',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    res.json({
      success: true,
      stats: {
        totalCustomers,
        newCustomers,
        paidCustomers,
        pendingCustomers,
        courseStats,
        statusStats,
        paymentTypeStats
      }
    });
  } catch (error) {
    console.error('Error fetching customer stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customer statistics'
    });
  }
};

// Export customers data
export const exportCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { format = 'csv', ...filters } = req.query;
    
    // Apply same filters as getAllCustomers
    const filter: any = {};
    if (filters.search) {
      filter.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
        { phone: { $regex: filters.search, $options: 'i' } },
        { courseName: { $regex: filters.search, $options: 'i' } }
      ];
    }
    
    if (filters.status) filter.customerStatus = filters.status;
    if (filters.paymentStatus) filter.paymentStatus = filters.paymentStatus;
    if (filters.paymentType) filter.paymentType = filters.paymentType;
    if (filters.courseId) filter.courseId = filters.courseId;
    if (filters.source) filter.source = filters.source;

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=customers.csv');
      
      // Write CSV header
      const headers = ['ID', 'Name', 'Email', 'Phone', 'Course', 'Category', 'PaymentType', 'PaymentStatus', 'CustomerStatus', 'Amount', 'Currency', 'Source', 'CreatedAt', 'UpdatedAt'];
      res.write(headers.join(',') + '\n');
      
      // Stream data in batches to avoid memory issues
      const batchSize = 1000;
      let skip = 0;
      let hasMore = true;
      
      while (hasMore) {
        const customers = await CustomerModel
          .find(filter)
          .skip(skip)
          .limit(batchSize)
          .lean();
        
        if (customers.length === 0) {
          hasMore = false;
          break;
        }
        
        // Write batch data
        for (const customer of customers) {
          const csvRow = [
            customer.id,
            customer.name,
            customer.email,
            customer.phone,
            customer.courseName,
            customer.courseCategory,
            customer.paymentType,
            customer.paymentStatus,
            customer.customerStatus,
            customer.amount,
            customer.currency,
            customer.source,
            customer.createdAt,
            customer.updatedAt
          ].map(value => `"${value || ''}"`).join(',');
          
          res.write(csvRow + '\n');
        }
        
        skip += batchSize;
        
        // If we got less than batchSize, we're done
        if (customers.length < batchSize) {
          hasMore = false;
        }
      }
      
      res.end();
    } else {
      // For JSON, still use pagination to avoid memory issues
      const limit = 10000; // Max 10k records for JSON export
      const customers = await CustomerModel.find(filter).limit(limit).lean();
      
      res.json({
        success: true,
        data: customers,
        message: customers.length === limit ? 'Results limited to 10,000 records. Use CSV for full export.' : undefined
      });
    }
  } catch (error) {
    console.error('Error exporting customers:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export customers'
    });
  }
};
