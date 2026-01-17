import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { 
  createPayPalOrder, 
  capturePayPalPayment, 
  createPaymentOrder, 
  verifyPayment, 
  validateCoupon as apiValidateCoupon 
} from '../api';

// --- Types ---
// (Move this to types.ts in a real project, but keeping here for standalone usage)
interface Course {
  id: string;
  title: string;
  category: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  coursePrice?: number;
  source?: string;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

// --- Constants ---
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  course,
  coursePrice = 0,
  source = 'unknown'
}: PaymentModalProps) {
  // --- State ---
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: ''
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'razorpay' | 'paypal'>('razorpay');
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  
  // Price State
  const [finalPrice, setFinalPrice] = useState(coursePrice);

  // --- Effects ---

  // Update final price when base price or coupon changes
  useEffect(() => {
    if (!appliedCoupon) {
      setFinalPrice(coursePrice);
    }
  }, [coursePrice, appliedCoupon]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setAppliedCoupon(null);
      setCouponCode('');
      setFinalPrice(coursePrice);
      setErrors({});
      setCustomerInfo({ name: '', email: '', phone: '' });
      setIsProcessing(false);
    }
  }, [isOpen, coursePrice]);

  // --- Actions ---

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }
    setIsValidatingCoupon(true);
    setCouponError('');

    try {
      const data = await apiValidateCoupon(couponCode.trim(), course.id);

      if (data.success && data.valid) {
        setAppliedCoupon(data);
        setFinalPrice(data.discount.finalPrice);
        setCouponError('');
        toast.success('Coupon applied!');
      } else {
        setCouponError(data.error || 'Invalid coupon code');
        setAppliedCoupon(null);
        setFinalPrice(coursePrice);
      }
    } catch (error) {
      console.error(error);
      setCouponError('Failed to validate coupon');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {};
    if (!customerInfo.name.trim()) newErrors.name = 'Name is required';
    if (!customerInfo.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) newErrors.email = 'Invalid email';
    if (!customerInfo.phone.trim()) newErrors.phone = 'Phone is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRazorpayPayment = async () => {
    setIsProcessing(true);
    try {
      // 1. Create Order via API
      const response = await createPaymentOrder({
        courseId: course.id,
        courseName: course.title,
        amount: finalPrice, // Optional: Backend usually recalculates this for security
        currency: 'GBP',
        customerInfo,
        couponCode: appliedCoupon?.coupon?.code
      });

      if (!response.success) throw new Error(response.error);

      const order = response.order;
      
      // 2. Open Razorpay Checkout
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'EdTech Informative',
        description: `Enrollment for ${course.title}`,
        order_id: order.orderId, // Internal mapping ID from your backend
        handler: async function (paymentResponse: any) {
          try {
            // 3. Verify Payment via API
            const verifyRes = await verifyPayment({
              ...paymentResponse,
              customerInfo,
              courseInfo: course
            });

            if (verifyRes.success) {
              toast.success(`Welcome to ${course.title}!`);
              onClose();
            } else {
              throw new Error(verifyRes.error);
            }
          } catch (error) {
            console.error(error);
            toast.error('Verification failed. Please contact support.');
          }
        },
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone
        },
        theme: { color: '#0e1589' },
        modal: { 
          ondismiss: () => setIsProcessing(false) 
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Payment initialization failed');
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    // PayPal Provider wrapped at ROOT level to prevent race conditions
    <PayPalScriptProvider options={{ 
      clientId: PAYPAL_CLIENT_ID || "sb", 
      currency: "GBP",
      intent: "capture"
    }}>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
          onClick={onClose} 
        />
        
        {/* Modal Container */}
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-gray-900 border border-white/20 rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all mx-4">
            
            {/* Close Button */}
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header & Progress */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {currentStep === 1 && 'Contact Details'}
                {currentStep === 2 && 'Payment Method'}
                {currentStep === 3 && 'Review & Pay'}
              </h2>
              <div className="flex gap-2">
                {[1, 2, 3].map(step => (
                  <div 
                    key={step} 
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${currentStep >= step ? 'bg-orange-500' : 'bg-white/20'}`} 
                  />
                ))}
              </div>
            </div>

            {/* --- STEP 1: Details --- */}
            {currentStep === 1 && (
              <div className="space-y-4">
                {/* Price Summary */}
                <div className="bg-white/5 p-3 rounded border border-white/10 flex justify-between items-center">
                  <span className="text-white/70">Total Fee:</span>
                  <div className="text-right">
                    {appliedCoupon && (
                      <span className="block text-xs text-white/50 line-through">£{coursePrice}</span>
                    )}
                    <span className="text-xl font-bold text-green-400">£{finalPrice}</span>
                  </div>
                </div>

                {/* Coupon Input */}
                <div className="space-y-1">
                  <div className="flex gap-2">
                    <input 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Coupon Code"
                      className="flex-1 bg-white/5 border border-white/20 rounded px-3 py-2 text-white focus:border-orange-500 outline-none transition-colors"
                      disabled={!!appliedCoupon}
                    />
                    {appliedCoupon ? (
                      <button 
                        onClick={() => {
                          setAppliedCoupon(null);
                          setCouponCode('');
                          setFinalPrice(coursePrice);
                        }}
                        className="bg-red-500/20 text-red-400 px-4 rounded hover:bg-red-500/30 border border-red-500/50"
                      >
                        Remove
                      </button>
                    ) : (
                      <button 
                        onClick={handleValidateCoupon}
                        disabled={isValidatingCoupon || !couponCode}
                        className="bg-white/10 text-white px-4 rounded hover:bg-white/20 disabled:opacity-50 transition-colors"
                      >
                        {isValidatingCoupon ? '...' : 'Apply'}
                      </button>
                    )}
                  </div>
                  {appliedCoupon && <p className="text-green-400 text-xs">Coupon applied successfully!</p>}
                  {couponError && <p className="text-red-400 text-xs">{couponError}</p>}
                </div>

                {/* Contact Form */}
                <div className="space-y-3">
                  <div>
                    <input
                      placeholder="Full Name"
                      value={customerInfo.name}
                      onChange={(e) => {
                        setCustomerInfo({...customerInfo, name: e.target.value});
                        if (errors.name) setErrors({...errors, name: undefined});
                      }}
                      className={`w-full bg-white/5 border rounded p-3 text-white outline-none transition-colors ${errors.name ? 'border-red-500' : 'border-white/20 focus:border-orange-500'}`}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <input
                      placeholder="Email Address"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => {
                        setCustomerInfo({...customerInfo, email: e.target.value});
                        if (errors.email) setErrors({...errors, email: undefined});
                      }}
                      className={`w-full bg-white/5 border rounded p-3 text-white outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-white/20 focus:border-orange-500'}`}
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <input
                      placeholder="Phone Number"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => {
                        setCustomerInfo({...customerInfo, phone: e.target.value});
                        if (errors.phone) setErrors({...errors, phone: undefined});
                      }}
                      className={`w-full bg-white/5 border rounded p-3 text-white outline-none transition-colors ${errors.phone ? 'border-red-500' : 'border-white/20 focus:border-orange-500'}`}
                    />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <button
                  onClick={() => {
                    if(validateForm()) setCurrentStep(2);
                  }}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded mt-4 transition-colors shadow-lg shadow-orange-500/20"
                >
                  Continue
                </button>
              </div>
            )}

            {/* --- STEP 2: Method --- */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded border border-white/10 text-sm text-white/80 space-y-2">
                  <div className="flex justify-between"><span>Name:</span> <span className="text-white">{customerInfo.name}</span></div>
                  <div className="flex justify-between"><span>Email:</span> <span className="text-white">{customerInfo.email}</span></div>
                  <div className="h-px bg-white/10 my-2" />
                  <div className="flex justify-between text-lg font-bold"><span>Total:</span> <span className="text-green-400">£{finalPrice}</span></div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setSelectedPaymentMethod('razorpay')}
                    className={`w-full p-4 rounded-xl border text-left flex items-center gap-4 transition-all ${
                      selectedPaymentMethod === 'razorpay' 
                      ? 'border-orange-500 bg-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.2)]' 
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-2xl">💳</span>
                    <div>
                      <span className="block text-white font-bold">Razorpay</span>
                      <span className="text-xs text-white/50">Cards, UPI, Netbanking</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedPaymentMethod('paypal')}
                    className={`w-full p-4 rounded-xl border text-left flex items-center gap-4 transition-all ${
                      selectedPaymentMethod === 'paypal' 
                      ? 'border-orange-500 bg-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.2)]' 
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-2xl">🏦</span>
                    <div>
                      <span className="block text-white font-bold">PayPal</span>
                      <span className="text-xs text-white/50">International Payments</span>
                    </div>
                  </button>
                </div>

                <div className="flex gap-3 mt-4">
                  <button 
                    onClick={() => setCurrentStep(1)} 
                    className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setCurrentStep(3)} 
                    className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded font-bold transition-colors shadow-lg shadow-orange-500/20"
                  >
                    Review & Pay
                  </button>
                </div>
              </div>
            )}

            {/* --- STEP 3: Pay --- */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-white/70 mb-2">You are paying</p>
                  <p className="text-4xl font-bold text-green-400 mb-1">£{finalPrice}</p>
                  <p className="text-white/50 text-sm">
                    via {selectedPaymentMethod === 'razorpay' ? 'Razorpay' : 'PayPal'}
                  </p>
                </div>

                <div className="min-h-[150px]">
                  {selectedPaymentMethod === 'razorpay' ? (
                    <button
                      onClick={handleRazorpayPayment}
                      disabled={isProcessing}
                      className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-orange-500/20"
                    >
                      {isProcessing ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : 'Pay Now'}
                    </button>
                  ) : (
                    // PayPal Buttons - Protected by top-level Provider
                    <PayPalButtons
                      style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay", height: 50 }}
                      forceReRender={[finalPrice, course.id]}
                      createOrder={async () => {
                        try {
                          const response = await createPayPalOrder({
                            courseId: course.id,
                            customerInfo,
                            couponCode: appliedCoupon?.coupon?.code
                          });
                          
                          if (!response.success || !response.order?.id) {
                            throw new Error(response.error || 'Failed to initialize PayPal');
                          }
                          return response.order.id;
                        } catch (error: any) {
                          toast.error(error.message || "Could not initiate PayPal");
                          throw error;
                        }
                      }}
                      onApprove={async (data) => {
                        try {
                          const response = await capturePayPalPayment(data.orderID);
                          if (response.success) {
                            toast.success(`Welcome to ${course.title}!`);
                            onClose();
                          } else {
                            throw new Error(response.error);
                          }
                        } catch (error) {
                          console.error(error);
                          toast.error('Payment capture failed. Please contact support.');
                        }
                      }}
                      onError={(err) => {
                        console.error("PayPal SDK Error:", err);
                        toast.error("PayPal failed to load. Please try again.");
                      }}
                      onCancel={() => {
                        toast('Payment cancelled');
                      }}
                    />
                  )}
                </div>

                <button 
                  onClick={() => setCurrentStep(2)} 
                  className="w-full text-white/50 hover:text-white text-sm transition-colors"
                >
                  ← Change Payment Method
                </button>
              </div>
            )}

            <p className="text-center text-xs text-white/30 mt-6">
              256-bit SSL Secure payment encryption enabled.
            </p>

          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}