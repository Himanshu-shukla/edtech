import dotenv from 'dotenv';

dotenv.config();

// --- Types & Interfaces ---

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

interface PayPalAuthResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

export class PayPalService {
  private clientId: string;
  private clientSecret: string;
  private baseUrl: string;

  constructor() {
    const mode = process.env.PAYPAL_MODE || 'sandbox';
    
    // Select credentials based on environment
    if (mode === 'live') {
      this.clientId = process.env.PAYPAL_CLIENT_ID_LIVE || '';
      this.clientSecret = process.env.PAYPAL_CLIENT_SECRET_LIVE || '';
      this.baseUrl = 'https://api-m.paypal.com';
    } else {
      this.clientId = process.env.PAYPAL_CLIENT_ID_SB || '';
      this.clientSecret = process.env.PAYPAL_CLIENT_SECRET_SB || '';
      this.baseUrl = 'https://api-m.sandbox.paypal.com';
    }

    if (!this.clientId || !this.clientSecret) {
      throw new Error(`PayPal credentials missing for mode: ${mode}`);
    }
  }

  /**
   * Generate an access token using Client Credentials
   */
  private async getAccessToken(): Promise<string> {
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    
    try {
      const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Auth failed: ${errorText}`);
      }

      const data = await response.json() as PayPalAuthResponse;
      return data.access_token;
    } catch (error) {
      console.error('PayPal Auth Error:', error);
      throw new Error('Failed to authenticate with PayPal');
    }
  }

  /**
   * Create a PayPal order (V2 API)
   */
  async createOrder(orderData: PayPalOrderRequest): Promise<PayPalOrderResponse> {
    const accessToken = await this.getAccessToken();

    const payload = {
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
        // Optional: Payee info is often inferred from client ID, but can be explicit
        payee: process.env.PAYPAL_MERCHANT_EMAIL ? {
            email_address: process.env.PAYPAL_MERCHANT_EMAIL
        } : undefined,
        custom_id: orderData.courseId
      }],
      // Only include payer info if strict requirements exist, otherwise PayPal collects this on their page
      payer: {
        email_address: orderData.customerInfo.email,
        name: {
            given_name: orderData.customerInfo.name.split(' ')[0],
            surname: orderData.customerInfo.name.split(' ').slice(1).join(' ') || undefined
        }
      }
    };

    try {
      const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('PayPal Order Creation Failed:', JSON.stringify(errorData, null, 2));
        throw new Error('Failed to create PayPal order');
      }

      const result = await response.json() as any;
      
      return {
        id: result.id,
        status: result.status,
        links: result.links
      };
    } catch (error) {
      console.error('PayPal create order error:', error);
      throw error;
    }
  }

  /**
   * Capture payment for an approved PayPal order
   */
  async capturePayment(orderId: string): Promise<any> {
    const accessToken = await this.getAccessToken();

    try {
      const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        // Empty body is required for capture
        body: JSON.stringify({}) 
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Capture Failed:', JSON.stringify(errorData, null, 2));
        throw new Error('Failed to capture PayPal payment');
      }

      return await response.json();
    } catch (error) {
      console.error('PayPal capture payment error:', error);
      throw error;
    }
  }

  /**
   * Get order details from PayPal
   */
  async getOrderDetails(orderId: string): Promise<any> {
    const accessToken = await this.getAccessToken();

    try {
      const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get order details');
      }

      return await response.json();
    } catch (error) {
      console.error('PayPal get details error:', error);
      throw error;
    }
  }

  /**
   * Refund a captured payment
   */
  async refundPayment(captureId: string, amount?: { currency_code: string; value: string }): Promise<any> {
    const accessToken = await this.getAccessToken();

    const payload = amount ? { amount } : {};

    try {
      const response = await fetch(`${this.baseUrl}/v2/payments/captures/${captureId}/refund`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to refund payment');
      }

      return await response.json();
    } catch (error) {
      console.error('PayPal refund error:', error);
      throw error;
    }
  }

  /**
   * Verify webhook signature
   * Note: This uses the API endpoint to verify signatures, replacing the old SDK method.
   */
  async verifyWebhookSignature(
    headers: any,
    body: string, // Raw string body is required
    webhookId: string
  ): Promise<boolean> {
    const accessToken = await this.getAccessToken();

    try {
      const payload = {
        auth_algo: headers['paypal-auth-algo'],
        cert_url: headers['paypal-cert-url'], // Note: API expects 'cert_url', SDK used 'cert_id' sometimes
        transmission_id: headers['paypal-transmission-id'],
        transmission_sig: headers['paypal-transmission-sig'],
        transmission_time: headers['paypal-transmission-time'],
        webhook_id: webhookId,
        webhook_event: JSON.parse(body)
      };

      const response = await fetch(`${this.baseUrl}/v1/notifications/verify-webhook-signature`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json() as any;
      return result.verification_status === 'SUCCESS';
    } catch (error) {
      console.error('PayPal webhook verification error:', error);
      return false;
    }
  }
}

export default PayPalService;