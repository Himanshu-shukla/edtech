import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  X, User, Mail, Phone, ArrowRight, 
  CheckCircle2, ShieldCheck, Clock, Loader2 
} from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { submitInstallmentInquiry } from '../api';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Props ---
interface CourseEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseName: string;
  courseCategory?: string;
  source?: string;
}

// --- Internal Components ---

const InputGroup = ({ 
  id, 
  label, 
  icon: Icon, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  required = false 
}: any) => (
  <div className="space-y-2">
    <label htmlFor={id} className="text-xs font-medium text-zinc-400 ml-1">
      {label} {required && <span className="text-emerald-500">*</span>}
    </label>
    <div className="relative group">
      <div className="absolute left-3 top-2.5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <input
        type={type}
        id={id}
        name={id}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-zinc-900/50 border border-zinc-800 text-white rounded-xl py-2.5 pl-10 pr-4 outline-none placeholder:text-zinc-600 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all duration-300"
      />
    </div>
  </div>
);

export default function CourseEnrollmentModal({ 
  isOpen, 
  onClose, 
  courseId,
  courseName,
  source = 'unknown'
}: CourseEnrollmentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setFormData({ name: '', email: '', phone: '' }), 300);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const result = await submitInstallmentInquiry({
        ...formData,
        courseId,
        courseName,
        source: source || 'course_enrollment_modal'
      });
      toast.success(result.message || "Application submitted successfully!");
      onClose();
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
          
          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-900/50 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="px-6 pt-8 pb-4 relative z-10">
              <h2 className="text-2xl font-bold text-white mb-2">
                Start Learning
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                You are applying for <span className="text-emerald-400 font-semibold">{courseName}</span>.
              </p>
              <p className="text-zinc-500 text-xs mt-1">
                Fill in your details below and our academic counselors will reach out to you shortly.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5 relative z-10">
              
              <InputGroup
                id="name"
                label="Full Name"
                icon={User}
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                required
              />

              <InputGroup
                id="email"
                label="Email Address"
                icon={Mail}
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />

              <InputGroup
                id="phone"
                label="Phone Number"
                icon={Phone}
                type="tel"
                placeholder="+1 234 567 890"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />

              {/* Action Buttons */}
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative flex-[2] overflow-hidden group px-4 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-900/20 hover:bg-emerald-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                >
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Apply Now
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </button>
              </div>
            </form>

            {/* Footer Trust Indicators */}
            <div className="px-6 py-4 bg-zinc-900/50 border-t border-zinc-800 flex justify-between items-center text-[10px] text-zinc-500 font-medium">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-emerald-500" />
                <span>Quick Response</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-blue-500" />
                <span>Data Secure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-orange-500" />
                <span>Expert Guidance</span>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}