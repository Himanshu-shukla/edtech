import checkoutNodeJssdk from '@paypal/checkout-server-sdk';

// PayPal environment configuration
function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const mode = process.env.PAYPAL_MODE || 'sandbox';

  if (!clientId || !clientSecret) {
    throw new Error('PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET must be set in environment variables');
  }

  // Check for placeholder values
  if (clientId === 'your-paypal-client-id' || clientSecret === 'your-paypal-client-secret') {
    throw new Error('PayPal credentials are still set to placeholder values. Please update with actual PayPal app credentials.');
  }

  if (mode === 'live') {
    return new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret);
  } else {
    return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
  }
}

// PayPal client
function client() {
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

export interface PayPalOrderRequest {
  courseId: string;
  courseName: string;
  amount: number;
  currency: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  orderId: string;
}

export interface PayPalOrderResponse {
  id: string;
  status: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

export class PayPalService {
  private client: any;

  constructor() {
    this.client = client();
  }

  /**
   * Create a PayPal order
   */
  async createOrder(orderData: PayPalOrderRequest): Promise<PayPalOrderResponse> {
    const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      application_context: {
        brand_name: 'EdTech Informative',
        landing_page: 'LOGIN',
        user_action: 'PAY_NOW',
        return_url: `${process.env.FRONTEND_URL}/payment/success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`
      },
      purchase_units: [{
        reference_id: orderData.orderId,
        description: `Enrollment for ${orderData.courseName}`,
        amount: {
          currency_code: orderData.currency,
          value: orderData.amount.toFixed(2)
        },
        payee: {
          email_address: process.env.PAYPAL_MERCHANT_EMAIL || undefined
        },
        custom_id: orderData.courseId
      }],
      payer: {
        name: {
          given_name: orderData.customerInfo.name.split(' ')[0] || orderData.customerInfo.name,
          surname: orderData.customerInfo.name.split(' ').slice(1).join(' ') || ''
        },
        email_address: orderData.customerInfo.email,
        phone: {
          phone_number: {
            national_number: orderData.customerInfo.phone
          }
        }
      }
    });

    try {
      const response = await this.client.execute(request);
      return {
        id: response.result.id,
        status: response.result.status,
        links: response.result.links
      };
    } catch (error) {
      console.error('PayPal create order error:', error);
      throw new Error('Failed to create PayPal order');
    }
  }

  /**
   * Capture payment for an approved PayPal order
   */
  async capturePayment(orderId: string): Promise<any> {
    const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    try {
      const response = await this.client.execute(request);
      return response.result;
    } catch (error) {
      console.error('PayPal capture payment error:', error);
      throw new Error('Failed to capture PayPal payment');
    }
  }

  /**
   * Get order details from PayPal
   */
  async getOrderDetails(orderId: string): Promise<any> {
    const request = new checkoutNodeJssdk.orders.OrdersGetRequest(orderId);

    try {
      const response = await this.client.execute(request);
      return response.result;
    } catch (error) {
      console.error('PayPal get order details error:', error);
      throw new Error('Failed to get PayPal order details');
    }
  }

  /**
   * Refund a captured payment
   */
  async refundPayment(captureId: string, amount?: { currency_code: string; value: string }): Promise<any> {
    const request = new checkoutNodeJssdk.payments.CapturesRefundRequest(captureId);
    
    if (amount) {
      request.requestBody({
        amount: amount
      });
    } else {
      request.requestBody({});
    }

    try {
      const response = await this.client.execute(request);
      return response.result;
    } catch (error) {
      console.error('PayPal refund payment error:', error);
      throw new Error('Failed to refund PayPal payment');
    }
  }

  /**
   * Verify webhook signature (for webhook events)
   */
  async verifyWebhookSignature(
    headers: any,
    body: string,
    webhookId: string
  ): Promise<boolean> {
    try {
      const request = new checkoutNodeJssdk.notifications.VerifyWebhookSignatureRequest();
      request.requestBody({
        auth_algo: headers['paypal-auth-algo'],
        cert_id: headers['paypal-cert-id'],
        transmission_id: headers['paypal-transmission-id'],
        transmission_sig: headers['paypal-transmission-sig'],
        transmission_time: headers['paypal-transmission-time'],
        webhook_id: webhookId,
        webhook_event: JSON.parse(body)
      });

      const response = await this.client.execute(request);
      return response.result.verification_status === 'SUCCESS';
    } catch (error) {
      console.error('PayPal webhook verification error:', error);
      return false;
    }
  }
}

export default PayPalService;
