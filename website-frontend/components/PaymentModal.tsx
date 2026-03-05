import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { PayPalScriptProvider, PayPalButtons, PayPalMessages } from '@paypal/react-paypal-js';
import { X, CreditCard, Wallet, ChevronRight, ArrowLeft, ShieldCheck, Loader2, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Mock API Import ---
import {
  createPayPalOrder,
  capturePayPalPayment,
  createPaymentOrder,
  verifyPayment,
  validateCoupon as apiValidateCoupon
} from '../lib/api';

// --- Constants ---
const COUNTRY_CODES = [
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+1', country: 'CA', flag: '🇨🇦' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
];

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
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
  source?: string
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RAZORPAY_KEY_ID = process.env.VITE_RAZORPAY_KEY_ID;
const PAYPAL_CLIENT_ID = process.env.VITE_PAYPAL_CLIENT_ID;

// --- Components ---
const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>;
};

function loadScript(src: string) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

// Light Theme Input Component
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative group w-full">
        <input
          type={type}
          ref={ref}
          className={cn(
            "w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export default function PaymentModal({
  isOpen,
  onClose,
  course,
  coursePrice = 0,
}: PaymentModalProps) {
  // State
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    countryCode: '+44'
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'razorpay' | 'paypal' | 'paylater'>('razorpay');
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [finalPrice, setFinalPrice] = useState(coursePrice);

  // Price Update Logic
  useEffect(() => {
    if (appliedCoupon?.discount?.finalPrice !== undefined) {
      setFinalPrice(appliedCoupon.discount.finalPrice);
    } else {
      setFinalPrice(coursePrice);
    }
  }, [coursePrice, appliedCoupon]);

  // Reset state on close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setCurrentStep(1);
        setAppliedCoupon(null);
        setCouponCode('');
        setErrors({});
        setCustomerInfo({ name: '', email: '', phone: '', countryCode: '+44' });
        setIsProcessing(false);
        setSelectedPaymentMethod('razorpay');
      }, 300);
    }
  }, [isOpen]);

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Enter a code');
      return;
    }
    setIsValidatingCoupon(true);
    setCouponError('');

    try {
      const data = await apiValidateCoupon(couponCode.trim(), course.id);
      if (data.success && data.valid) {
        setAppliedCoupon(data);
        setCouponError('');
        toast.success('Coupon applied!');
      } else {
        setCouponError(data.error || 'Invalid code');
        setAppliedCoupon(null);
      }
    } catch (error) {
      setCouponError('Validation failed');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {};
    if (!customerInfo.name.trim()) newErrors.name = 'Required';
    if (!customerInfo.email.trim()) newErrors.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) newErrors.email = 'Invalid email';
    if (!customerInfo.phone.trim()) newErrors.phone = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getFullPhone = () => `${customerInfo.countryCode}${customerInfo.phone}`;

  // --- PayPal Handlers ---
  const createOrderHandler = async () => {
    try {
      const response = await createPayPalOrder({
        courseId: course.id,
        // Combine country code + phone
        customerInfo: { ...customerInfo, phone: getFullPhone() },
        couponCode: appliedCoupon?.coupon?.code
      });

      if (!response.success || !response.order?.id) {
        throw new Error(response.error || 'Initialization failed');
      }
      return response.order.id;
    } catch (error: any) {
      toast.error(`Order Error: ${error.message}`);
      throw error;
    }
  };

  const onApproveHandler = async (data: any) => {
    try {
      const response = await capturePayPalPayment(data.orderID);
      if (response.success) {
        toast.success(`Enrolled Successfully!`);
        onClose();
      } else {
        toast.error('Payment capture failed. Please try again.');
      }
    } catch (error: any) {
      toast.error('Transaction failed.');
    }
  };

  // --- Razorpay Handler ---
  const handleRazorpayPayment = async () => {
    if (!validateForm()) return;
    setIsProcessing(true);

    // 1. Load Script
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      toast.error("Razorpay SDK failed to load");
      setIsProcessing(false);
      return;
    }

    // 2. SANITIZE: Remove any spaces or special chars from the phone number
    const cleanPhone = customerInfo.phone.replace(/\D/g, '');
    const formattedContact = `${customerInfo.countryCode}${cleanPhone}`;

    try {
      // Use the formatted contact in your API call
      const response = await createPaymentOrder({
        courseId: course.id,
        courseName: course.title,
        amount: finalPrice,
        currency: 'GBP',
        customerInfo: { ...customerInfo, phone: formattedContact },
        couponCode: appliedCoupon?.coupon?.code
      });

      if (!response.success) throw new Error(response.error);

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: response.order.amount,
        currency: response.order.currency,
        name: 'EdTech Platform',
        description: course.title,
        order_id: response.order.orderId,
        handler: async function (paymentResponse: any) {
          try {
            const verifyRes = await verifyPayment({ ...paymentResponse, customerInfo, courseInfo: course });
            if (verifyRes.success) {
              toast.success(`Welcome to ${course.title}!`);
              onClose();
            } else throw new Error(verifyRes.error);
          } catch (error) {
            toast.error('Verification failed');
          }
        },
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: formattedContact,
        },
        theme: { color: '#f97316' },
        modal: { ondismiss: () => setIsProcessing(false) }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast.error(error.message || 'Payment failed');
      setIsProcessing(false);
    }
  };

  return (
    <PayPalScriptProvider options={{
      clientId: PAYPAL_CLIENT_ID || "sb",
      currency: "GBP",
      intent: "capture",
      components: "buttons,messages",
      "enable-funding": "paylater"
    }}>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white border border-gray-100 rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Background Orbs - Adjusted opacity for light theme */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200/40 rounded-full blur-3xl -z-10" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-200/40 rounded-full blur-3xl -z-10" />

              {/* Header */}
              <div className="p-6 pb-2 flex justify-between items-start">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-xs font-semibold text-orange-600 mb-3">
                    <Sparkles className="w-3 h-3" />
                    <span>Secure Enrollment</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{course.title}</h2>
                </div>
                <button onClick={onClose} className="p-2 rounded-full bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="px-6 py-4">
                <div className="flex justify-between items-center mb-2 text-[10px] uppercase tracking-wider font-bold text-gray-400">
                  <span className={cn(currentStep >= 1 && "text-orange-600")}>Details</span>
                  <span className={cn(currentStep >= 2 && "text-orange-600")}>Method</span>
                  <span className={cn(currentStep >= 3 && "text-orange-600")}>Payment</span>
                </div>
                <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "33%" }}
                    animate={{ width: `${(currentStep / 3) * 100}%` }}
                    className="h-full bg-gradient-to-r from-orange-500 to-yellow-500"
                  />
                </div>
              </div>

              <div className="p-6 pt-2 min-h-[440px]">
                <AnimatePresence mode="wait">

                  {/* --- STEP 1: Details --- */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-5"
                    >
                      {/* Price Summary */}
                      <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex justify-between items-center shadow-sm">
                        <div>
                          <p className="text-gray-500 text-sm font-medium">Total Fee</p>
                          {appliedCoupon && <span className="text-xs text-gray-400 line-through">£{coursePrice}</span>}
                        </div>
                        <span className="text-2xl font-bold text-gray-900">£{finalPrice}</span>
                      </div>

                      {/* Coupon Field - Placeholder Updated */}
                      <LabelInputContainer>
                        <div className="flex gap-2 relative">
                          <Input
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            placeholder="Scholarship Code"
                            disabled={!!appliedCoupon}
                          />
                          <button
                            onClick={appliedCoupon ? () => { setAppliedCoupon(null); setCouponCode(''); } : handleValidateCoupon}
                            disabled={isValidatingCoupon || (!couponCode && !appliedCoupon)}
                            className={cn(
                              "absolute right-1 top-1 bottom-1 px-4 rounded-lg text-xs font-bold transition-colors",
                              appliedCoupon
                                ? "bg-red-50 text-red-500 hover:bg-red-100"
                                : "bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400"
                            )}
                          >
                            {isValidatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : appliedCoupon ? "Remove" : "Apply"}
                          </button>
                        </div>
                        {couponError && <p className="text-red-500 text-xs px-1 font-medium">{couponError}</p>}
                        {appliedCoupon && <p className="text-emerald-600 text-xs px-1 font-medium">Code applied successfully!</p>}
                      </LabelInputContainer>

                      {/* User Form */}
                      <div className="space-y-4">
                        <LabelInputContainer>
                          <Input
                            placeholder="Full Name"
                            value={customerInfo.name}
                            onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                            className={errors.name && "border-red-500 focus:border-red-500 focus:ring-red-200"}
                          />
                        </LabelInputContainer>
                        <LabelInputContainer>
                          <Input
                            placeholder="Email Address"
                            type="email"
                            value={customerInfo.email}
                            onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                            className={errors.email && "border-red-500 focus:border-red-500 focus:ring-red-200"}
                          />
                        </LabelInputContainer>

                        {/* Country Code + Phone */}
                        <LabelInputContainer>
                          <div className="flex gap-2 h-[46px]">
                            <div className="relative group min-w-[100px]">
                              <select
                                value={customerInfo.countryCode}
                                onChange={(e) => setCustomerInfo({ ...customerInfo, countryCode: e.target.value })}
                                className="w-full h-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl pl-3 pr-8 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all appearance-none cursor-pointer"
                              >
                                {COUNTRY_CODES.map((item) => (
                                  <option key={item.code + item.country} value={item.code} className="bg-white text-gray-900">
                                    {item.flag} {item.code}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                <ChevronRight className="w-4 h-4 rotate-90" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <Input
                                placeholder="Phone Number"
                                type="tel"
                                value={customerInfo.phone}
                                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                                className={cn("h-full", errors.phone && "border-red-500")}
                              />
                            </div>
                          </div>
                        </LabelInputContainer>
                      </div>

                      <button
                        onClick={() => { if (validateForm()) setCurrentStep(2); }}
                        className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
                      >
                        Continue <ChevronRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}

                  {/* --- STEP 2: Method (Reordered) --- */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="space-y-3">
                        {/* 1. PayPal (Moved to Top) */}
                        <div
                          onClick={() => setSelectedPaymentMethod('paypal')}
                          className={cn(
                            "cursor-pointer rounded-2xl border p-4 transition-all duration-300 flex items-center gap-4",
                            selectedPaymentMethod === 'paypal'
                              ? "bg-blue-50 border-blue-500 shadow-md shadow-blue-100"
                              : "bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200"
                          )}
                        >
                          <div className="p-3 rounded-xl bg-white border border-gray-100 text-blue-600 shadow-sm"><Wallet className="w-6 h-6" /></div>
                          <div>
                            <h3 className="font-bold text-gray-900">PayPal</h3>
                            <p className="text-xs text-gray-500">One-Time Payment</p>
                          </div>
                          {selectedPaymentMethod === 'paypal' && <CheckCircle2 className="ml-auto w-5 h-5 text-blue-600" />}
                        </div>

                        {/* 2. Pay Later (Moved to Middle) */}
                        <div
                          onClick={() => setSelectedPaymentMethod('paylater')}
                          className={cn(
                            "cursor-pointer rounded-2xl border p-4 transition-all duration-300 flex items-center gap-4",
                            selectedPaymentMethod === 'paylater'
                              ? "bg-indigo-50 border-indigo-500 shadow-md shadow-indigo-100"
                              : "bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200"
                          )}
                        >
                          <div className="p-3 rounded-xl bg-white border border-gray-100 text-indigo-500 shadow-sm"><Clock className="w-6 h-6" /></div>
                          <div>
                            <h3 className="font-bold text-gray-900">Pay Later</h3>
                            <p className="text-xs text-gray-500">3 Interest-Free Installments</p>
                          </div>
                          {selectedPaymentMethod === 'paylater' && <CheckCircle2 className="ml-auto w-5 h-5 text-indigo-500" />}
                        </div>

                        {/* 3. Razorpay (Moved to Bottom) */}
                        <div
                          onClick={() => setSelectedPaymentMethod('razorpay')}
                          className={cn(
                            "cursor-pointer rounded-2xl border p-4 transition-all duration-300 flex items-center gap-4",
                            selectedPaymentMethod === 'razorpay'
                              ? "bg-orange-50 border-orange-500 shadow-md shadow-orange-100"
                              : "bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200"
                          )}
                        >
                          <div className="p-3 rounded-xl bg-white border border-gray-100 text-orange-500 shadow-sm"><CreditCard className="w-6 h-6" /></div>
                          <div>
                            <h3 className="font-bold text-gray-900">Razorpay</h3>
                            <p className="text-xs text-gray-500">UPI, Cards, Netbanking</p>
                          </div>
                          {selectedPaymentMethod === 'razorpay' && <CheckCircle2 className="ml-auto w-5 h-5 text-orange-500" />}
                        </div>
                      </div>

                      <div className="flex gap-3 mt-8">
                        <button onClick={() => setCurrentStep(1)} className="p-3 rounded-xl bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors">
                          <ArrowLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setCurrentStep(3)}
                          className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:from-orange-500 hover:to-orange-400 transition-all"
                        >
                          Review & Pay
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* --- STEP 3: Confirm & Pay --- */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8 text-center"
                    >
                      <div className="py-4">
                        <p className="text-gray-500 text-sm mb-1 font-medium">Amount to Pay</p>
                        <div className="flex items-center justify-center gap-3">
                          {appliedCoupon && (
                            <span className="text-gray-400 line-through text-2xl font-medium decoration-2">£{coursePrice}</span>
                          )}
                          <h3 className="text-5xl font-bold text-gray-900 tracking-tight">£{finalPrice}</h3>
                        </div>
                      </div>

                      {/* Payment Container */}
                      <div className="min-h-[160px] w-full flex flex-col justify-end">
                        {/* 1. Razorpay */}
                        {selectedPaymentMethod === 'razorpay' && (
                          <button
                            onClick={handleRazorpayPayment}
                            disabled={isProcessing}
                            className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-xl shadow-gray-200"
                          >
                            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                            {isProcessing ? "Processing..." : "Secure Pay"}
                          </button>
                        )}

                        {/* 2. PayPal / Pay Later */}
                        {(selectedPaymentMethod === 'paypal' || selectedPaymentMethod === 'paylater') && (
                          <div className="relative z-10 w-full space-y-4 animate-in fade-in zoom-in duration-300">

                            {/* Pay Later Message */}
                            {selectedPaymentMethod === 'paylater' && (
                              <div className="rounded-lg p-2 mb-2 min-h-[40px]">
                                <PayPalMessages
                                  style={{ layout: "text", text: { align: "center", color: "black" } }}
                                  amount={finalPrice.toString()}
                                  forceReRender={[finalPrice]}
                                />
                              </div>
                            )}

                            {/* The Buttons */}
                            <PayPalButtons
                              style={{
                                layout: "vertical",
                                color: "gold",
                                shape: "rect",
                                label: "pay"
                              }}
                              fundingSource={undefined}
                              forceReRender={[finalPrice, course.id, selectedPaymentMethod]}
                              createOrder={createOrderHandler}
                              onApprove={onApproveHandler}
                              onError={(err) => {
                                console.error("PayPal Error:", err);
                                if (!String(err).includes("popup close")) {
                                  toast.error("PayPal encountered an error. Try Razorpay?");
                                }
                              }}
                            />
                          </div>
                        )}
                      </div>

                      <button onClick={() => setCurrentStep(2)} className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors">
                        Change Payment Method
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PayPalScriptProvider>
  );
}