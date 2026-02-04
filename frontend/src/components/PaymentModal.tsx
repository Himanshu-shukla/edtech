import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { PayPalScriptProvider, PayPalButtons, PayPalMessages } from '@paypal/react-paypal-js';
import { X, CreditCard, Wallet, ChevronRight, ArrowLeft, ShieldCheck, Loader2, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import {
  createPayPalOrder,
  capturePayPalPayment,
  createPaymentOrder,
  verifyPayment,
  validateCoupon as apiValidateCoupon
} from '../api';

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

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

// --- Components ---
const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>;
};

// Updated Input for Light Theme
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative group">
        <input
          type={type}
          className={cn(
            "w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
          ref={ref}
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
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({ name: '', email: '', phone: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'razorpay' | 'paypal' | 'paylater'>('razorpay');
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});

  // Coupon & Price State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [finalPrice, setFinalPrice] = useState(coursePrice);

  useEffect(() => {
    if (!appliedCoupon) setFinalPrice(coursePrice);
  }, [coursePrice, appliedCoupon]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setCurrentStep(1);
        setAppliedCoupon(null);
        setCouponCode('');
        setFinalPrice(coursePrice);
        setErrors({});
        setCustomerInfo({ name: '', email: '', phone: '' });
        setIsProcessing(false);
      }, 300);
    }
  }, [isOpen, coursePrice]);

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
        setFinalPrice(data.discount.finalPrice);
        setCouponError('');
        toast.success('Coupon applied!');
      } else {
        setCouponError(data.error || 'Invalid code');
        setAppliedCoupon(null);
        setFinalPrice(coursePrice);
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

  const createOrderHandler = async () => {
    try {
      const response = await createPayPalOrder({
        courseId: course.id,
        customerInfo,
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

  const handleRazorpayPayment = async () => {
    setIsProcessing(true);
    try {
      const response = await createPaymentOrder({
        courseId: course.id,
        courseName: course.title,
        amount: finalPrice,
        currency: 'GBP',
        customerInfo,
        couponCode: appliedCoupon?.coupon?.code
      });

      if (!response.success) throw new Error(response.error);

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: response.order.amount,
        currency: response.order.currency,
        name: 'EdTech Informative',
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
        prefill: { name: customerInfo.name, email: customerInfo.email, contact: customerInfo.phone },
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
            {/* Backdrop - Kept dark for focus */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Subtle Light Gradients */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/50 rounded-full blur-3xl -z-10" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl -z-10" />

              {/* Header */}
              <div className="p-6 pb-2 flex justify-between items-start">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-semibold text-orange-600 mb-3">
                    <Sparkles className="w-3 h-3" />
                    <span>Secure Enrollment</span>
                  </div>
                  <h2 className="text-2xl font-bold text-zinc-900">{course.title}</h2>
                </div>
                <button onClick={onClose} className="p-2 rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Steps Progress */}
              <div className="px-6 py-4">
                <div className="flex justify-between items-center mb-2 text-[10px] uppercase tracking-wider font-bold text-zinc-400">
                  <span className={cn(currentStep >= 1 && "text-orange-600")}>Details</span>
                  <span className={cn(currentStep >= 2 && "text-orange-600")}>Method</span>
                  <span className={cn(currentStep >= 3 && "text-orange-600")}>Payment</span>
                </div>
                <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "33%" }}
                    animate={{ width: `${(currentStep / 3) * 100}%` }}
                    className="h-full bg-gradient-to-r from-orange-500 to-yellow-500" 
                  />
                </div>
              </div>

              <div className="p-6 pt-2 min-h-[400px]">
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
                      <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl flex justify-between items-center shadow-sm">
                        <div>
                          <p className="text-zinc-500 text-sm font-medium">Total Fee</p>
                          {appliedCoupon && <span className="text-xs text-zinc-400 line-through">£{coursePrice}</span>}
                        </div>
                        <span className="text-2xl font-bold text-zinc-900">£{finalPrice}</span>
                      </div>

                      {/* Coupon Field */}
                      <LabelInputContainer>
                        <div className="flex gap-2 relative">
                          <Input 
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            placeholder="Coupon Code"
                            disabled={!!appliedCoupon}
                          />
                          <button 
                            onClick={appliedCoupon ? () => { setAppliedCoupon(null); setCouponCode(''); setFinalPrice(coursePrice); } : handleValidateCoupon}
                            disabled={isValidatingCoupon || (!couponCode && !appliedCoupon)}
                            className={cn(
                              "absolute right-1 top-1 bottom-1 px-4 rounded-lg text-xs font-bold transition-colors",
                              appliedCoupon 
                                ? "bg-red-50 text-red-600 hover:bg-red-100" 
                                : "bg-zinc-900 text-white hover:bg-zinc-800 disabled:bg-zinc-200"
                            )}
                          >
                            {isValidatingCoupon ? <Loader2 className="w-4 h-4 animate-spin"/> : appliedCoupon ? "Remove" : "Apply"}
                          </button>
                        </div>
                        {couponError && <p className="text-red-500 text-xs px-1 font-medium">{couponError}</p>}
                        {appliedCoupon && <p className="text-emerald-600 text-xs px-1 font-medium">Code applied successfully!</p>}
                      </LabelInputContainer>

                      {/* User Form */}
                      <div className="space-y-4">
                        <LabelInputContainer>
                          <Input placeholder="Full Name" value={customerInfo.name} onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} className={errors.name && "border-red-500 focus:border-red-500 focus:ring-red-200"} />
                        </LabelInputContainer>
                        <LabelInputContainer>
                          <Input placeholder="Email Address" type="email" value={customerInfo.email} onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})} className={errors.email && "border-red-500 focus:border-red-500 focus:ring-red-200"} />
                        </LabelInputContainer>
                        <LabelInputContainer>
                          <Input placeholder="Phone Number" type="tel" value={customerInfo.phone} onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})} className={errors.phone && "border-red-500 focus:border-red-500 focus:ring-red-200"} />
                        </LabelInputContainer>
                      </div>

                      <button
                        onClick={() => { if(validateForm()) setCurrentStep(2); }}
                        className="w-full bg-zinc-900 text-white font-bold py-3.5 rounded-xl hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-zinc-200"
                      >
                        Continue <ChevronRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}

                  {/* --- STEP 2: Method --- */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="space-y-3">
                        {/* Option 1: Razorpay */}
                        <div 
                          onClick={() => setSelectedPaymentMethod('razorpay')}
                          className={cn(
                            "cursor-pointer rounded-2xl border p-4 transition-all duration-300 flex items-center gap-4",
                            selectedPaymentMethod === 'razorpay' 
                              ? "bg-orange-50 border-orange-500 shadow-md" 
                              : "bg-white border-zinc-200 hover:bg-zinc-50"
                          )}
                        >
                          <div className="p-3 rounded-xl bg-white border border-zinc-100 text-orange-500 shadow-sm"><CreditCard className="w-6 h-6" /></div>
                          <div>
                            <h3 className="font-bold text-zinc-900">Razorpay</h3>
                            <p className="text-xs text-zinc-500">UPI, Cards, Netbanking</p>
                          </div>
                          {selectedPaymentMethod === 'razorpay' && <CheckCircle2 className="ml-auto w-5 h-5 text-orange-500" />}
                        </div>

                        {/* Option 2: PayPal Standard */}
                        <div 
                          onClick={() => setSelectedPaymentMethod('paypal')}
                          className={cn(
                            "cursor-pointer rounded-2xl border p-4 transition-all duration-300 flex items-center gap-4",
                            selectedPaymentMethod === 'paypal' 
                              ? "bg-yellow-50 border-yellow-500 shadow-md" 
                              : "bg-white border-zinc-200 hover:bg-zinc-50"
                          )}
                        >
                          <div className="p-3 rounded-xl bg-white border border-zinc-100 text-yellow-600 shadow-sm"><Wallet className="w-6 h-6" /></div>
                          <div>
                            <h3 className="font-bold text-zinc-900">PayPal</h3>
                            <p className="text-xs text-zinc-500">One-Time Payment</p>
                          </div>
                          {selectedPaymentMethod === 'paypal' && <CheckCircle2 className="ml-auto w-5 h-5 text-yellow-500" />}
                        </div>

                        {/* Option 3: PayPal Pay Later */}
                        <div 
                          onClick={() => setSelectedPaymentMethod('paylater')}
                          className={cn(
                            "cursor-pointer rounded-2xl border p-4 transition-all duration-300 flex items-center gap-4",
                            selectedPaymentMethod === 'paylater' 
                              ? "bg-blue-50 border-blue-500 shadow-md" 
                              : "bg-white border-zinc-200 hover:bg-zinc-50"
                          )}
                        >
                          <div className="p-3 rounded-xl bg-white border border-zinc-100 text-blue-600 shadow-sm"><Clock className="w-6 h-6" /></div>
                          <div>
                            <h3 className="font-bold text-zinc-900">Pay Later</h3>
                            <p className="text-xs text-zinc-500">3 Interest-Free Installments</p>
                          </div>
                          {selectedPaymentMethod === 'paylater' && <CheckCircle2 className="ml-auto w-5 h-5 text-blue-500" />}
                        </div>
                      </div>

                      <div className="flex gap-3 mt-8">
                        <button onClick={() => setCurrentStep(1)} className="p-3 rounded-xl bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 transition-colors">
                          <ArrowLeft className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => setCurrentStep(3)} 
                          className="flex-1 bg-zinc-900 text-white font-bold rounded-xl shadow-lg hover:bg-zinc-800 transition-all"
                        >
                          Review & Pay
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* --- STEP 3: Confirm --- */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8 text-center"
                    >
                      <div className="py-4">
                        <p className="text-zinc-500 text-sm mb-1 font-medium">Amount to Pay</p>
                        <h3 className="text-5xl font-bold text-zinc-900 tracking-tight">£{finalPrice}</h3>
                      </div>

                      <div className="min-h-[120px]">
                        {/* CASE 1: RAZORPAY */}
                        {selectedPaymentMethod === 'razorpay' && (
                          <button
                            onClick={handleRazorpayPayment}
                            disabled={isProcessing}
                            className="w-full bg-zinc-900 text-white font-bold py-4 rounded-xl hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 shadow-xl shadow-zinc-200"
                          >
                            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                            {isProcessing ? "Processing..." : "Secure Pay"}
                          </button>
                        )}

                        {/* CASE 2 & 3: PAYPAL */}
                        {(selectedPaymentMethod === 'paypal' || selectedPaymentMethod === 'paylater') && (
                          <div className="relative z-10 w-full space-y-4">
                            
                            {/* Pay Later Message */}
                            {selectedPaymentMethod === 'paylater' && (
                              <div className="border border-blue-100 rounded-lg p-2 text-zinc-900">
                                <PayPalMessages 
                                  style={{ layout: "text", text: { align: "center", color: "black" } }}
                                  amount={finalPrice.toString()}
                                  forceReRender={[finalPrice]}
                                />
                              </div>
                            )}

                            {/* Smart Buttons */}
                            <PayPalButtons
                              style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
                              fundingSource={undefined} 
                              forceReRender={[finalPrice, course.id, couponCode]}
                              createOrder={createOrderHandler}
                              onApprove={onApproveHandler}
                              onError={(err) => {
                                console.error("PayPal Error:", err);
                                if (!String(err).includes("popup close")) {
                                  toast.error("PayPal failed to load.");
                                }
                              }}
                            />
                          </div>
                        )}
                      </div>

                      <button onClick={() => setCurrentStep(2)} className="text-zinc-400 hover:text-zinc-600 text-sm font-medium transition-colors">
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