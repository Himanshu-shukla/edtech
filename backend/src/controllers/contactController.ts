import { Request, Response } from 'express';
import { InquiryModel, CustomerModel, InquiryType } from '../models';
import { generateInquiryId, generateCustomerId } from '../utils/idGenerator';
import mongoose, { Schema } from 'mongoose';

const LEADS_DB_URI = process.env.LEADS_DB_URI || 'mongodb://admin-edtech:Edtechinformative1127@168.231.78.166:27017/lead-manager?authSource=admin';

const leadsConnection = mongoose.createConnection(LEADS_DB_URI);


const ExternalLeadSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  position: { type: String, default: '' },
  folder: { type: String, default: '' },
  source: { type: String, default: 'Manual' },
  status: { type: String, default: 'New' },
  priority: { type: String, default: 'Medium' },
  leadScore: { type: Number, default: 0 },
  notes: { type: [Schema.Types.Mixed], default: [] } 
}, { 
  timestamps: true 
});

const ExternalLeadModel = leadsConnection.model('Lead', ExternalLeadSchema, 'leads');

// Submit contact form
export const submitContactForm = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, subject, message, source = 'contact_form', courseName } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, phone'
      });
      return;
    }

    // Create inquiry record
    const inquiry = new InquiryModel({
      id: generateInquiryId(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      type: 'contact_form',
      status: 'new',
      subject: subject?.trim() || 'General Inquiry',
      message: message?.trim() || '',
      courseName: courseName?.trim() || undefined,
      source,
      notes: `Contact form submission from ${source}${courseName ? ` for course: ${courseName}` : ''}`
    });

    await inquiry.save();

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully. We will get back to you soon!',
      inquiry: {
        id: inquiry.id,
        status: inquiry.status
      }
    });

  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit contact form'
    });
  }
};

// Submit strategy call booking
export const submitStrategyCall = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      name, 
      email, 
      phone, 
      source = 'strategy_call_modal',
      position = 'Data Analytics & Gen AI' 
    } = req.body;

    // --- VALIDATION ---
    if (!name || !email || !phone) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, phone'
      });
      return;
    }

    // --- STEP 1: Save to Local InquiryModel (Your original logic) ---
    const inquiry = new InquiryModel({
      id: generateInquiryId(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      type: 'strategy_call',
      status: 'new',
      subject: 'Strategy Call Booking',
      message: 'User requested a strategy call to discuss career goals.',
      source,
      notes: `Strategy call booking from ${source}`
    });

    await inquiry.save();

    // --- STEP 2: Save to External Lead Management DB ---
    try {
      // We format the note to look like a proper log entry
      const newLead = new ExternalLeadModel({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        position: position,
        folder: 'website',      // Hardcoded
        source: source,
        priority: 'Medium',
        status: 'New',          // Set status to New for incoming leads
        leadScore: 10,          // Give them a starting score
        notes: [
          `Strategy Call Request. Source: ${source}. Created via Website.`
        ]
      });

      await newLead.save();
      console.log(`Lead synced to external DB for ${email}`);

    } catch (dbError) {
      // If the external DB fails, log it, but don't fail the user's request
      console.error('Failed to save to external Leads DB:', dbError);
    }

    // --- RESPONSE ---
    res.status(201).json({
      success: true,
      message: 'Strategy call booked successfully! Our team will contact you within 24 hours.',
      inquiry: {
        id: inquiry.id,
        status: inquiry.status
      }
    });

  } catch (error) {
    console.error('Error booking strategy call:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to book strategy call'
    });
  }
};

// Submit bootcamp application - Creates inquiry with type 'bootcamp'
export const submitBootcampApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, subject, message, source = 'bootcamp_application', courseName } = req.body;

    // Debug logging
    console.log('Received bootcamp application data:', {
      name, email, phone, subject, message, source, courseName
    });

    // Validate required fields
    if (!name || !email || !phone) {
      console.log('Validation failed: Missing required fields');
      res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, phone'
      });
      return;
    }

    // Create inquiry record for bootcamp application
    const inquiryData = {
      id: generateInquiryId(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      type: InquiryType.BOOTCAMP,
      status: 'new',
      subject: subject?.trim() || `${courseName || 'Bootcamp'} Application`,
      message: message?.trim() || 'Bootcamp application submitted',
      courseName: courseName?.trim() || undefined,
      source,
      notes: `Bootcamp application from ${source}${courseName ? ` for course: ${courseName}` : ''}`
    };

    console.log('Creating inquiry with data:', inquiryData);

    // Test if the InquiryType enum includes bootcamp
    console.log('Available inquiry types:', Object.values(InquiryType));

    const inquiry = new InquiryModel(inquiryData);

    console.log('Saving inquiry to database...');
    await inquiry.save();
    console.log('Inquiry saved successfully with ID:', inquiry.id);

    res.status(201).json({
      success: true,
      message: 'Bootcamp application submitted successfully. We will contact you within 2 hours!',
      inquiry: {
        id: inquiry.id,
        status: inquiry.status
      }
    });

  } catch (error) {
    console.error('Error submitting bootcamp application:', error);
    
    // Log detailed error information for debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Check if it's a MongoDB validation error
    if (error && typeof error === 'object' && 'name' in error) {
      const mongoError = error as any;
      if (mongoError.name === 'ValidationError') {
        console.error('Validation errors:', mongoError.errors);
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: mongoError.errors
        });
        return;
      }
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to submit bootcamp application'
    });
  }
};

// Submit installment inquiry - Creates a Customer record instead of Inquiry
export const submitInstallmentInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, courseId, courseName, source = 'pricing_section' } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, phone'
      });
      return;
    }

    // Create customer record for installment inquiry
    const customer = new CustomerModel({
      id: generateCustomerId(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      courseId: courseId || 'unknown',
      courseName: courseName || 'Unknown Course',
      courseCategory: 'General',
      paymentType: 'installment',
      paymentStatus: 'pending',
      customerStatus: 'installment_pending',
      amount: 0, // Will be set when installment plan is created
      currency: 'GBP',
      source,
      notes: `Installment inquiry from ${source} for course: ${courseName || 'Unknown'}. Customer interested in installment payment plan.`
    });

    await customer.save();

    res.status(201).json({
      success: true,
      message: 'Installment inquiry submitted successfully! Our team will contact you with payment plan options.',
      customer: {
        id: customer.id,
        status: customer.customerStatus
      }
    });

  } catch (error) {
    console.error('Error submitting installment inquiry:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit installment inquiry'
    });
  }
};
