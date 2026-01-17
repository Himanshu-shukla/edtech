import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { X, CreditCard, Wallet, ChevronRight, ArrowLeft, ShieldCheck, Loader2, Tag } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Mock API Imports (Keep your original imports here) ---
import { 
  createPayPalOrder, 
  capturePayPalPayment, 
  createPaymentOrder, 
  verifyPayment, 
  validateCoupon as apiValidateCoupon 
} from '../api';

// --- Utility for Tailwind classes ---
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

// --- Sub-Components for UI Polish ---

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <motion.div
        initial={{ opacity: 0.8, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
        className="group relative rounded-lg p-[1px]"
      >
        {/* Gradient Border Effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-neutral-700 to-transparent group-hover:via-neutral-500 opacity-50 transition-all duration-500" />
        <input
          type={type}
          className={cn(
            "relative flex h-11 w-full rounded-md border-none bg-zinc-800 px-3 py-2 text-sm text-white shadow-input placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-600 disabled:cursor-not-allowed disabled:opacity-50 transition duration-400",
            className
          )}
          ref={ref}
          {...props}
        />
      </motion.div>
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
  // --- State ---
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({ name: '', email: '', phone: '' });
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
      }, 300); // Wait for animation to finish
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
        description: `Enrollment for ${course.title}`,
        order_id: response.order.orderId,
        handler: async function (paymentResponse: any) {
          try {
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
        theme: { color: '#f97316' }, // Matches orange-500
        modal: { ondismiss: () => setIsProcessing(false) }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Payment initialization failed');
      setIsProcessing(false);
    }
  };

  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID || "sb", currency: "GBP", intent: "capture" }}>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl"
            >
              {/* Background Gradient Blob */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-orange-500/20 blur-[80px] rounded-full pointer-events-none" />

              {/* Header */}
              <div className="relative px-6 pt-6 pb-2 flex justify-between items-start z-10">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400">
                    Enrollment
                  </h2>
                  <p className="text-zinc-500 text-sm mt-1">{course.title}</p>
                </div>
                <button 
                  onClick={onClose} 
                  className="p-2 rounded-full bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="px-6 py-4">
                <div className="flex justify-between items-center mb-2 text-xs font-medium text-zinc-500">
                  <span className={cn(currentStep >= 1 && "text-orange-400")}>Details</span>
                  <span className={cn(currentStep >= 2 && "text-orange-400")}>Payment</span>
                  <span className={cn(currentStep >= 3 && "text-orange-400")}>Confirm</span>
                </div>
                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "33%" }}
                    animate={{ width: `${(currentStep / 3) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-orange-600 to-yellow-500" 
                  />
                </div>
              </div>

              {/* Content Area */}
              <div className="p-6 pt-2">
                <AnimatePresence mode="wait">
                  {/* --- STEP 1: Details --- */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-5"
                    >
                      {/* Price Card */}
                      <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="text-zinc-400 text-sm">Total Fee</p>
                          {appliedCoupon && <span className="text-xs text-zinc-600 line-through">£{coursePrice}</span>}
                        </div>
                        <span className="text-2xl font-bold text-white">£{finalPrice}</span>
                      </div>

                      {/* Coupon Section */}
                      <div className="space-y-2">
                        <LabelInputContainer>
                          <div className="flex gap-2 relative">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                              <Tag className="w-4 h-4 text-zinc-500" />
                            </div>
                            <Input 
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                              placeholder="Have a coupon code?"
                              className="pl-9 pr-24"
                              disabled={!!appliedCoupon}
                            />
                            <div className="absolute inset-y-0 right-1 flex items-center">
                               {appliedCoupon ? (
                                <button 
                                  onClick={() => {
                                    setAppliedCoupon(null);
                                    setCouponCode('');
                                    setFinalPrice(coursePrice);
                                  }}
                                  className="text-xs bg-red-500/10 text-red-500 px-3 py-1.5 rounded hover:bg-red-500/20 transition-colors"
                                >
                                  Remove
                                </button>
                              ) : (
                                <button 
                                  onClick={handleValidateCoupon}
                                  disabled={isValidatingCoupon || !couponCode}
                                  className="text-xs bg-zinc-700 text-white px-3 py-1.5 rounded hover:bg-zinc-600 disabled:opacity-50 transition-colors"
                                >
                                  {isValidatingCoupon ? 'Checking...' : 'Apply'}
                                </button>
                              )}
                            </div>
                          </div>
                        </LabelInputContainer>
                        {appliedCoupon && <p className="text-emerald-400 text-xs px-1">Coupon applied successfully!</p>}
                        {couponError && <p className="text-red-400 text-xs px-1">{couponError}</p>}
                      </div>

                      {/* Form Inputs */}
                      <div className="space-y-4">
                        <LabelInputContainer>
                          <Input
                            placeholder="Full Name"
                            value={customerInfo.name}
                            onChange={(e) => {
                              setCustomerInfo({...customerInfo, name: e.target.value});
                              if (errors.name) setErrors({...errors, name: undefined});
                            }}
                            className={errors.name ? "border-red-500/50 focus-visible:ring-red-500" : ""}
                          />
                          {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}
                        </LabelInputContainer>

                        <LabelInputContainer>
                          <Input
                            placeholder="Email Address"
                            type="email"
                            value={customerInfo.email}
                            onChange={(e) => {
                              setCustomerInfo({...customerInfo, email: e.target.value});
                              if (errors.email) setErrors({...errors, email: undefined});
                            }}
                            className={errors.email ? "border-red-500/50 focus-visible:ring-red-500" : ""}
                          />
                          {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
                        </LabelInputContainer>

                        <LabelInputContainer>
                          <Input
                            placeholder="Phone Number"
                            type="tel"
                            value={customerInfo.phone}
                            onChange={(e) => {
                              setCustomerInfo({...customerInfo, phone: e.target.value});
                              if (errors.phone) setErrors({...errors, phone: undefined});
                            }}
                            className={errors.phone ? "border-red-500/50 focus-visible:ring-red-500" : ""}
                          />
                          {errors.phone && <p className="text-red-400 text-xs">{errors.phone}</p>}
                        </LabelInputContainer>
                      </div>

                      <button
                        onClick={() => { if(validateForm()) setCurrentStep(2); }}
                        className="w-full group relative overflow-hidden rounded-lg bg-white p-3 text-center font-bold text-black transition hover:bg-zinc-200"
                      >
                         <span className="flex items-center justify-center gap-2">
                           Continue to Payment <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                         </span>
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
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Summary Capsule */}
                      <div className="bg-zinc-900 border border-dashed border-zinc-700 p-4 rounded-xl flex flex-col gap-2">
                         <div className="flex justify-between text-sm">
                           <span className="text-zinc-500">Student</span>
                           <span className="text-zinc-300 truncate max-w-[150px]">{customerInfo.name}</span>
                         </div>
                         <div className="flex justify-between text-sm">
                           <span className="text-zinc-500">Total</span>
                           <span className="text-orange-400 font-bold">£{finalPrice}</span>
                         </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Select Method</p>
                        
                        <div 
                          onClick={() => setSelectedPaymentMethod('razorpay')}
                          className={cn(
                            "cursor-pointer group relative overflow-hidden rounded-xl border p-4 transition-all duration-300",
                            selectedPaymentMethod === 'razorpay' 
                              ? "bg-zinc-800 border-orange-500/50 shadow-[0_0_20px_-5px_rgba(249,115,22,0.3)]" 
                              : "bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700"
                          )}
                        >
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-orange-500">
                              <CreditCard className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">Razorpay</h3>
                              <p className="text-xs text-zinc-500">Cards, UPI, Netbanking</p>
                            </div>
                            {selectedPaymentMethod === 'razorpay' && (
                              <div className="ml-auto w-4 h-4 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
                            )}
                          </div>
                        </div>

                        <div 
                          onClick={() => setSelectedPaymentMethod('paypal')}
                          className={cn(
                            "cursor-pointer group relative overflow-hidden rounded-xl border p-4 transition-all duration-300",
                            selectedPaymentMethod === 'paypal' 
                              ? "bg-zinc-800 border-blue-500/50 shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]" 
                              : "bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700"
                          )}
                        >
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-blue-500">
                              <Wallet className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">PayPal</h3>
                              <p className="text-xs text-zinc-500">International Payments</p>
                            </div>
                            {selectedPaymentMethod === 'paypal' && (
                              <div className="ml-auto w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button 
                          onClick={() => setCurrentStep(1)} 
                          className="flex-1 py-3 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                        >
                          <ArrowLeft className="w-5 h-5 mx-auto" />
                        </button>
                        <button 
                          onClick={() => setCurrentStep(3)} 
                          className="flex-[3] bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white rounded-lg font-bold shadow-lg shadow-orange-900/20 transition-all"
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
                      transition={{ duration: 0.3 }}
                      className="space-y-6 text-center py-4"
                    >
                      <div>
                        <p className="text-zinc-500 mb-1">Total Amount</p>
                        <h3 className="text-5xl font-bold text-white tracking-tighter">£{finalPrice}</h3>
                        <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
                          <ShieldCheck className="w-3 h-3 text-emerald-500" />
                          Secure payment via {selectedPaymentMethod === 'razorpay' ? 'Razorpay' : 'PayPal'}
                        </div>
                      </div>

                      <div className="min-h-[140px] px-2">
                        {selectedPaymentMethod === 'razorpay' ? (
                          <button
                            onClick={handleRazorpayPayment}
                            disabled={isProcessing}
                            className="w-full relative group overflow-hidden bg-white text-black font-bold py-4 rounded-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                          >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                              {isProcessing ? (
                                <>
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                "Pay Now"
                              )}
                            </span>
                            {/* Hover shimmer effect */}
                            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-zinc-200/50 to-transparent" />
                          </button>
                        ) : (
                          <div className="relative z-20">
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
                                  if (!response.success || !response.order?.id) throw new Error(response.error || 'Failed to initialize PayPal');
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
                                  } else throw new Error(response.error);
                                } catch (error) {
                                  toast.error('Payment capture failed.');
                                }
                              }}
                              onError={() => toast.error("PayPal failed to load.")}
                            />
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={() => setCurrentStep(2)} 
                        className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors flex items-center justify-center gap-1 mx-auto"
                      >
                        <ArrowLeft className="w-3 h-3" /> Change Payment Method
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