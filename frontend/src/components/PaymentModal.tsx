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

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative group">
        <input
          type={type}
          className={cn(
            "w-full bg-zinc-900/50 border border-zinc-800 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all placeholder:text-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed",
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
  // Updated state to include 'paylater'
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

  // Helper function for PayPal Order Creation (Reused for both Standard & PayLater)
  const createPayPalOrderHandler = async () => {
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

  // Helper for PayPal Approval (Reused)
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
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -z-10" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10" />

              {/* Header */}
              <div className="p-6 pb-2 flex justify-between items-start">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-orange-400 mb-3">
                    <Sparkles className="w-3 h-3" />
                    <span>Secure Enrollment</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">{course.title}</h2>
                </div>
                <button onClick={onClose} className="p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="px-6 py-4">
                <div className="flex justify-between items-center mb-2 text-[10px] uppercase tracking-wider font-bold text-zinc-500">
                  <span className={cn(currentStep >= 1 && "text-orange-400")}>Details</span>
                  <span className={cn(currentStep >= 2 && "text-orange-400")}>Method</span>
                  <span className={cn(currentStep >= 3 && "text-orange-400")}>Payment</span>
                </div>
                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "33%" }}
                    animate={{ width: `${(currentStep / 3) * 100}%` }}
                    className="h-full bg-gradient-to-r from-orange-600 to-yellow-500" 
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
                      <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="text-zinc-400 text-sm">Total Fee</p>
                          {appliedCoupon && <span className="text-xs text-zinc-600 line-through">£{coursePrice}</span>}
                        </div>
                        <span className="text-2xl font-bold text-white">£{finalPrice}</span>
                      </div>

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
                              appliedCoupon ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-zinc-800 text-white hover:bg-zinc-700"
                            )}
                          >
                            {isValidatingCoupon ? <Loader2 className="w-4 h-4 animate-spin"/> : appliedCoupon ? "Remove" : "Apply"}
                          </button>
                        </div>
                        {couponError && <p className="text-red-400 text-xs px-1">{couponError}</p>}
                        {appliedCoupon && <p className="text-emerald-400 text-xs px-1">Code applied!</p>}
                      </LabelInputContainer>

                      <div className="space-y-4">
                        <LabelInputContainer>
                          <Input placeholder="Full Name" value={customerInfo.name} onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} className={errors.name && "border-red-500/50"} />
                        </LabelInputContainer>
                        <LabelInputContainer>
                          <Input placeholder="Email Address" type="email" value={customerInfo.email} onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})} className={errors.email && "border-red-500/50"} />
                        </LabelInputContainer>
                        <LabelInputContainer>
                          <Input placeholder="Phone Number" type="tel" value={customerInfo.phone} onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})} className={errors.phone && "border-red-500/50"} />
                        </LabelInputContainer>
                      </div>

                      <button
                        onClick={() => { if(validateForm()) setCurrentStep(2); }}
                        className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                      >
                        Continue <ChevronRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}

                  {/* --- STEP 2: Method (UPDATED) --- */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="space-y-3">
                        {/* Option 1: Razorpay */}
                        <div 
                          onClick={() => setSelectedPaymentMethod('razorpay')}
                          className={cn(
                            "cursor-pointer rounded-2xl border p-4 transition-all duration-300 flex items-center gap-4",
                            selectedPaymentMethod === 'razorpay' ? "bg-zinc-800 border-orange-500 shadow-lg shadow-orange-900/20" : "bg-zinc-900/30 border-zinc-800 hover:bg-zinc-800"
                          )}
                        >
                          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-orange-500"><CreditCard className="w-6 h-6" /></div>
                          <div><h3 className="font-bold text-white">Razorpay</h3><p className="text-xs text-zinc-500">UPI, Cards, Netbanking</p></div>
                          {selectedPaymentMethod === 'razorpay' && <CheckCircle2 className="ml-auto w-5 h-5 text-orange-500" />}
                        </div>

                        {/* Option 2: PayPal Standard */}
                        <div 
                          onClick={() => setSelectedPaymentMethod('paypal')}
                          className={cn(
                            "cursor-pointer rounded-2xl border p-4 transition-all duration-300 flex items-center gap-4",
                            selectedPaymentMethod === 'paypal' ? "bg-zinc-800 border-yellow-500 shadow-lg shadow-yellow-900/20" : "bg-zinc-900/30 border-zinc-800 hover:bg-zinc-800"
                          )}
                        >
                          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-yellow-500"><Wallet className="w-6 h-6" /></div>
                          <div><h3 className="font-bold text-white">PayPal</h3><p className="text-xs text-zinc-500">One-Time Payment</p></div>
                          {selectedPaymentMethod === 'paypal' && <CheckCircle2 className="ml-auto w-5 h-5 text-yellow-500" />}
                        </div>

                        {/* Option 3: PayPal Pay Later */}
                        <div 
                          onClick={() => setSelectedPaymentMethod('paylater')}
                          className={cn(
                            "cursor-pointer rounded-2xl border p-4 transition-all duration-300 flex items-center gap-4",
                            selectedPaymentMethod === 'paylater' ? "bg-zinc-800 border-blue-500 shadow-lg shadow-blue-900/20" : "bg-zinc-900/30 border-zinc-800 hover:bg-zinc-800"
                          )}
                        >
                          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-blue-500"><Clock className="w-6 h-6" /></div>
                          <div><h3 className="font-bold text-white">Pay Later</h3><p className="text-xs text-zinc-500">3 Interest-Free Installments</p></div>
                          {selectedPaymentMethod === 'paylater' && <CheckCircle2 className="ml-auto w-5 h-5 text-blue-500" />}
                        </div>
                      </div>

                      <div className="flex gap-3 mt-8">
                        <button onClick={() => setCurrentStep(1)} className="p-3 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white">
                          <ArrowLeft className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => setCurrentStep(3)} 
                          className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-900/20"
                        >
                          Review & Pay
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* --- STEP 3: Confirm (LOGIC SPLIT) --- */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8 text-center"
                    >
                      <div className="py-4">
                        <p className="text-zinc-500 text-sm mb-1">Amount to Pay</p>
                        <h3 className="text-5xl font-bold text-white">£{finalPrice}</h3>
                      </div>

                      <div className="min-h-[60px]">
                        {/* CASE 1: RAZORPAY */}
                        {selectedPaymentMethod === 'razorpay' && (
                          <button
                            onClick={handleRazorpayPayment}
                            disabled={isProcessing}
                            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                          >
                            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                            {isProcessing ? "Processing..." : "Secure Pay"}
                          </button>
                        )}

                        {/* CASE 2: PAYPAL STANDARD */}
                        {selectedPaymentMethod === 'paypal' && (
                          <div className="relative z-10 w-full min-h-[60px]">
                            <PayPalButtons
                              style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
                              fundingSource="paypal" // Force Yellow Button
                              forceReRender={[finalPrice, course.id, couponCode]}
                              createOrder={createPayPalOrderHandler}
                              onApprove={onApproveHandler}
                              onError={(err) => {
                                console.error("PayPal Error:", err);
                                toast.error("PayPal failed to load.");
                              }}
                            />
                          </div>
                        )}

                        {/* CASE 3: PAYPAL PAY LATER */}
                        {selectedPaymentMethod === 'paylater' && (
                          <div className="relative z-10 w-full space-y-4">
                            {/* Message Banner */}
                            <div className="bg-white rounded-lg p-2">
                              <PayPalMessages 
                                style={{ layout: "text", text: { align: "center" } }}
                                amount={finalPrice.toString()}
                                forceReRender={[finalPrice]}
                              />
                            </div>
                            {/* Force Blue Button */}
                            <PayPalButtons
                              style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }}
                              fundingSource="paylater" 
                              forceReRender={[finalPrice, course.id, couponCode]}
                              createOrder={createPayPalOrderHandler}
                              onApprove={onApproveHandler}
                              onError={(err) => {
                                console.error("Pay Later Error:", err);
                                toast.error("Pay Later is not available for this transaction.");
                              }}
                            />
                          </div>
                        )}
                      </div>

                      <button onClick={() => setCurrentStep(2)} className="text-zinc-500 hover:text-white text-sm">
                        Change Method
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