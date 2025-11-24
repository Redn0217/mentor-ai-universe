import { supabase } from '@/lib/supabase';

// Razorpay configuration
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

export interface RazorpayOrderData {
  amount: number; // in paise (₹1 = 100 paise)
  currency: string;
  receipt: string;
  notes?: Record<string, any>;
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface SubscriptionData {
  user_id: string;
  plan_id: string;
  plan_name: string;
  amount: number;
  duration_months: number;
  payment_id?: string;
  order_id?: string;
  status: 'pending' | 'active' | 'failed' | 'cancelled';
}

class RazorpayService {
  private razorpayLoaded = false;

  // Load Razorpay script dynamically
  loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.razorpayLoaded) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        this.razorpayLoaded = true;
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  // Create Razorpay order via backend
  async createOrder(orderData: RazorpayOrderData): Promise<any> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3003'}/api/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  }

  // Verify payment signature via backend
  async verifyPayment(paymentData: RazorpayPaymentResponse): Promise<boolean> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3003'}/api/payment/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      const data = await response.json();
      return data.verified;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }

  // Open Razorpay checkout
  async openCheckout(
    amount: number,
    planName: string,
    planId: string,
    userEmail: string,
    userName: string,
    onSuccess: (response: RazorpayPaymentResponse) => void,
    onFailure: (error: any) => void
  ): Promise<void> {
    const scriptLoaded = await this.loadRazorpayScript();
    
    if (!scriptLoaded) {
      onFailure(new Error('Failed to load Razorpay SDK'));
      return;
    }

    try {
      // Create order
      const orderData: RazorpayOrderData = {
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          plan_id: planId,
          plan_name: planName,
        },
      };

      const order = await this.createOrder(orderData);

      // Razorpay checkout options
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Internsify',
        description: `${planName} Subscription`,
        order_id: order.id,
        prefill: {
          name: userName,
          email: userEmail,
        },
        theme: {
          color: '#3B82F6',
        },
        handler: function (response: RazorpayPaymentResponse) {
          onSuccess(response);
        },
        modal: {
          ondismiss: function () {
            onFailure(new Error('Payment cancelled by user'));
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      onFailure(error);
    }
  }

  // Save subscription to database
  async saveSubscription(subscriptionData: SubscriptionData): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .insert([subscriptionData]);

      if (error) {
        console.error('Error saving subscription:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving subscription:', error);
      return false;
    }
  }
}

export const razorpayService = new RazorpayService();

