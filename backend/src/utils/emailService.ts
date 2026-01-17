
import nodemailer from 'nodemailer';
import { CompanyInfoModel, ContactDataModel } from '../models';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface PaymentConfirmationEmailData {
  customerName: string;
  customerEmail: string;
  courseTitle: string;
  courseCategory: string;
  amount: number;
  currency: string;
  orderId: string;
  transactionId: string;
  paymentDate: Date;
  supportEmail?: string;
  supportPhone?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configure email transporter
    const emailConfig: EmailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
      }
    };

    this.transporter = nodemailer.createTransport(emailConfig);
  }

  /**
   * Send payment confirmation email
   */
  async sendPaymentConfirmation(data: PaymentConfirmationEmailData): Promise<boolean> {
    try {
      // Fetch dynamic contact info
      const [companyInfo, contactData] = await Promise.all([
        EmailService.getCompanyInfo(),
        EmailService.getContactData()
      ]);
      let supportEmail = companyInfo?.supportEmail || 'support@edtechinformative.uk';
      let supportPhone = '';
      if (contactData?.offices?.length) {
        // Use the first office's phone as primary
        supportPhone = contactData.offices[0].phone;
      } else {
        supportPhone = '+1 (123) 456-7890';
      }
      const emailContent = this.generatePaymentConfirmationEmail({ ...data, supportEmail, supportPhone });

      const mailOptions = {
        from: `"EdTech Informative" <${process.env.SMTP_USER || 'noreply@edtechinformative.uk'}>`,
        to: data.customerEmail,
        subject: `Payment Confirmation - ${data.courseTitle}`,
        html: emailContent
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Payment confirmation email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('Failed to send payment confirmation email:', error);
      return false;
    }
  }

  // Static helper to fetch company info
  static async getCompanyInfo() {
    try {
      return await CompanyInfoModel.findOne();
    } catch {
      return null;
    }
  }

  // Static helper to fetch contact data
  static async getContactData() {
    try {
      return await ContactDataModel.findOne();
    } catch {
      return null;
    }
  }

  /**
   * Generate HTML email content for payment confirmation
   */
  private generatePaymentConfirmationEmail(data: PaymentConfirmationEmailData): string {
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: data.currency
    }).format(data.amount);

    const formattedDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(data.paymentDate);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Confirmation</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f6f9;
    }
    .container {
      background-color: #ffffff;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 3px 12px rgba(0,0,0,0.08);
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #0e1589;
      padding-bottom: 20px;
      margin-bottom: 25px;
    }
    .header h1 {
      color: #0e1589;
      margin: 0;
      font-size: 26px;
      font-weight: 700;
    }
    .success-icon {
      font-size: 48px;
      margin-bottom: 8px;
      color: #28a745;
    }
    .section {
      margin: 25px 0;
      border-radius: 8px;
      padding: 20px;
    }
    .course-details {
      background-color: #f8f9fa;
      border-left: 4px solid #0e1589;
    }
    .payment-details {
      background-color: #e8f5e8;
      border-left: 4px solid #28a745;
    }
    .next-steps {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
    }
    .section h3 {
      margin-top: 0;
      margin-bottom: 15px;
      font-size: 18px;
      font-weight: 600;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e5e5e5;
      font-size: 14px;
    }
    .info-label {
      font-weight: 600;
      color: #555;
    }
    .info-value {
      color: #333;
      text-align: right;
    }
    .contact-info {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      margin: 25px 0;
      text-align: center;
      font-size: 14px;
    }
    .footer {
      text-align: center;
      margin-top: 25px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      font-size: 13px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="success-icon">✅</div>
      <h1>Payment Confirmation</h1>
      <p style="margin: 5px 0; color: #555;">Thank you for your enrollment!</p>
    </div>

    <!-- Greeting -->
    <p>Dear <strong>${data.customerName}</strong>,</p>
    <p>We’re excited to confirm that your payment has been processed successfully.  
    You are now officially enrolled in one of our programs, and our team will reach out soon with course access details.</p>

    <!-- Course Details -->
    <div class="section course-details">
      <h3>📘 Course Details</h3>
      <div class="info-row"><span class="info-label">Course:</span><span class="info-value">${data.courseTitle}</span></div>
      <div class="info-row"><span class="info-label">Category:</span><span class="info-value">${data.courseCategory}</span></div>
    </div>

    <!-- Payment Details -->
    <div class="section payment-details">
      <h3>💳 Payment Information</h3>
      <div class="info-row"><span class="info-label">Amount Paid:</span><span class="info-value">${formattedAmount}</span></div>
      <div class="info-row"><span class="info-label">Order ID:</span><span class="info-value">${data.orderId}</span></div>
      <div class="info-row"><span class="info-label">Transaction ID:</span><span class="info-value">${data.transactionId}</span></div>
      <div class="info-row"><span class="info-label">Payment Date:</span><span class="info-value">${formattedDate}</span></div>
    </div>

<!-- Next Steps -->
<div class="section next-steps">
  <h3>🚀 What’s Next?</h3>
  <p>Our team will contact you shortly with the details regarding your course access.  
  If you don’t hear from us within 24 hours, please reach out to our support team.</p>
</div>

    <!-- Contact Info -->
    <div class="contact-info">
      <p><strong>Need Help?</strong></p>
      <p>Email: <a href="mailto:${data.supportEmail}">${data.supportEmail}</a><br>
      Phone: ${data.supportPhone}</p>
    </div>

    <!-- Closing -->
    <p>We’re thrilled to have you as part of our learning community.  
    Get ready for an inspiring educational journey!</p>

    <p>Best regards,<br><strong>The EdTech Informative Team</strong></p>

    <!-- Footer -->
    <div class="footer">
      <p>This is an automated confirmation email. Please do not reply.</p>
      <p>&copy; ${new Date().getFullYear()} EdTech Informative. All rights reserved.</p>
    </div>
  </div>
</body>
</html>

    `;
  }

  /**
   * Test email service configuration
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email service connection verified successfully');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }
}

export default EmailService;
