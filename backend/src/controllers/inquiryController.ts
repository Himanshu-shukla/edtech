import { Request, Response } from 'express';
import { InquiryModel, Inquiry, InquiryStatus, InquiryType } from '../models/Inquiry';
import { generateId } from '../utils/idGenerator';

// Get all inquiries with filtering and pagination
export const getAllInquiries = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      status,
      type,
      source,
      assignedTo,
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
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
        { courseName: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (source) filter.source = source;
    if (assignedTo) filter.assignedTo = assignedTo;
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate as string);
      if (endDate) filter.createdAt.$lte = new Date(endDate as string);
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    const [inquiries, total] = await Promise.all([
      InquiryModel.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      InquiryModel.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / Number(limit));

    res.json({
      success: true,
      data: inquiries,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch inquiries'
    });
  }
};

// Get inquiry by ID
export const getInquiryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const inquiry = await InquiryModel.findOne({ id }).lean();
    
    if (!inquiry) {
      res.status(404).json({
        success: false,
        error: 'Inquiry not found'
      });
      return;
    }

    res.json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    console.error('Error fetching inquiry:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch inquiry'
    });
  }
};

// Create new inquiry
export const createInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const inquiryData = req.body;
    inquiryData.id = generateId('INQ');
    
    const inquiry = await InquiryModel.create(inquiryData);
    
    res.status(201).json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create inquiry'
    });
  }
};

// Update inquiry
export const updateInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const inquiry = await InquiryModel.findOneAndUpdate(
      { id },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!inquiry) {
      res.status(404).json({
        success: false,
        error: 'Inquiry not found'
      });
      return;
    }

    res.json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    console.error('Error updating inquiry:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update inquiry'
    });
  }
};

// Delete inquiry
export const deleteInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const inquiry = await InquiryModel.findOneAndDelete({ id });
    
    if (!inquiry) {
      res.status(404).json({
        success: false,
        error: 'Inquiry not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Inquiry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete inquiry'
    });
  }
};

// Get inquiry statistics
export const getInquiryStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { period = 30 } = req.query;
    const days = Number(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [
      totalInquiries,
      newInquiries,
      contactedInquiries,
      convertedInquiries,
      typeStats,
      statusStats,
      sourceStats
    ] = await Promise.all([
      InquiryModel.countDocuments(),
      InquiryModel.countDocuments({ createdAt: { $gte: startDate } }),
      InquiryModel.countDocuments({ status: InquiryStatus.CONTACTED }),
      InquiryModel.countDocuments({ status: InquiryStatus.CONVERTED }),
      InquiryModel.aggregate([
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 }
          }
        }
      ]),
      InquiryModel.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      InquiryModel.aggregate([
        {
          $group: {
            _id: '$source',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
    ]);

    res.json({
      success: true,
      stats: {
        totalInquiries,
        newInquiries,
        contactedInquiries,
        convertedInquiries,
        typeStats,
        statusStats,
        sourceStats
      }
    });
  } catch (error) {
    console.error('Error fetching inquiry stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch inquiry statistics'
    });
  }
};

// Export inquiries data
export const exportInquiries = async (req: Request, res: Response): Promise<void> => {
  try {
    const { format = 'csv', ...filters } = req.query;
    
    // Apply same filters as getAllInquiries
    const filter: any = {};
    if (filters.search) {
      filter.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
        { phone: { $regex: filters.search, $options: 'i' } },
        { subject: { $regex: filters.search, $options: 'i' } },
        { message: { $regex: filters.search, $options: 'i' } },
        { courseName: { $regex: filters.search, $options: 'i' } }
      ];
    }
    
    if (filters.status) filter.status = filters.status;
    if (filters.type) filter.type = filters.type;
    if (filters.source) filter.source = filters.source;
    if (filters.assignedTo) filter.assignedTo = filters.assignedTo;

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=inquiries.csv');
      
      // Write CSV header
      const headers = ['ID', 'Name', 'Email', 'Phone', 'Type', 'Status', 'Subject', 'Message', 'Course', 'Source', 'AssignedTo', 'FollowUpDate', 'CreatedAt', 'UpdatedAt'];
      res.write(headers.join(',') + '\n');
      
      // Stream data in batches to avoid memory issues
      const batchSize = 1000;
      let skip = 0;
      let hasMore = true;
      
      while (hasMore) {
        const inquiries = await InquiryModel
          .find(filter)
          .skip(skip)
          .limit(batchSize)
          .lean();
        
        if (inquiries.length === 0) {
          hasMore = false;
          break;
        }
        
        // Write batch data
        for (const inquiry of inquiries) {
          const csvRow = [
            inquiry.id,
            inquiry.name,
            inquiry.email,
            inquiry.phone,
            inquiry.type,
            inquiry.status,
            inquiry.subject || '',
            inquiry.message || '',
            inquiry.courseName || '',
            inquiry.source,
            inquiry.assignedTo || '',
            inquiry.followUpDate || '',
            inquiry.createdAt,
            inquiry.updatedAt
          ].map(value => `"${value || ''}"`).join(',');
          
          res.write(csvRow + '\n');
        }
        
        skip += batchSize;
        
        // If we got less than batchSize, we're done
        if (inquiries.length < batchSize) {
          hasMore = false;
        }
      }
      
      res.end();
    } else {
      // For JSON, still use pagination to avoid memory issues
      const limit = 10000; // Max 10k records for JSON export
      const inquiries = await InquiryModel.find(filter).limit(limit).lean();
      
      res.json({
        success: true,
        data: inquiries,
        message: inquiries.length === limit ? 'Results limited to 10,000 records. Use CSV for full export.' : undefined
      });
    }
  } catch (error) {
    console.error('Error exporting inquiries:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export inquiries'
    });
  }
};
