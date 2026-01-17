'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, Mail, Phone, Laptop, Target, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { bootcampApi, type BootcampApplication } from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface ApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
}

export default function ApplicationForm({ isOpen, onClose }: ApplicationFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<BootcampApplication>({
    fullName: '',
    email: '',
    phone: '',
    course: 'Agentic AI Career Program'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Validation functions
  const validateFullName = (name: string): string | undefined => {
    if (!name.trim()) return 'Full name is required';
    if (name.trim().length < 2) return 'Full name must be at least 2 characters';
    if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) return 'Full name can only contain letters, spaces, hyphens, and apostrophes';
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return 'Email address is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return 'Please enter a valid email address';
    return undefined;
  };

  const validatePhone = (phone: string): string | undefined => {
    if (!phone.trim()) return 'Phone number is required';
    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) return 'Phone number must be at least 10 digits';
    if (cleanPhone.length > 15) return 'Phone number cannot exceed 15 digits';
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      fullName: validateFullName(formData.fullName),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone)
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      fullName: true,
      email: true,
      phone: true
    });

    // Validate the form
    if (!validateForm()) {
      toast.error('Please fix the errors in the form before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await bootcampApi.submitApplication({
        ...formData,
        source: 'bootcamp_application'
      });
      
      setIsSubmitting(false);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        course: 'Agentic AI Career Program'
      });
      setErrors({});
      setTouched({});
      onClose();
      // Redirect to thank you page
      router.push('/thankyou');
    } catch (error) {
      setIsSubmitting(false);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Real-time validation for touched fields
    if (touched[name]) {
      const newErrors = { ...errors };
      switch (name) {
        case 'fullName':
          newErrors.fullName = validateFullName(value);
          break;
        case 'email':
          newErrors.email = validateEmail(value);
          break;
        case 'phone':
          newErrors.phone = validatePhone(value);
          break;
      }
      setErrors(newErrors);
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    
    // Validate field on blur
    const newErrors = { ...errors };
    switch (fieldName) {
      case 'fullName':
        newErrors.fullName = validateFullName(formData.fullName);
        break;
      case 'email':
        newErrors.email = validateEmail(formData.email);
        break;
      case 'phone':
        newErrors.phone = validatePhone(formData.phone);
        break;
    }
    setErrors(newErrors);
  };

  const handleCancel = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      course: 'Agentic AI Career Program'
    });
    setErrors({});
    setTouched({});
    onClose();
  };

  // Check if form is valid for submit button state
  const isFormValid = () => {
    return validateFullName(formData.fullName) === undefined &&
           validateEmail(formData.email) === undefined &&
           validatePhone(formData.phone) === undefined &&
           formData.fullName.trim() !== '' &&
           formData.email.trim() !== '' &&
           formData.phone.trim() !== '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col"
      >
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Apply to 4-Month AI Career Program</h2>
              <div className="flex items-center space-x-4 mt-2">
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Job Placement Guarantee
                </span>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Job Placement Assistance
                </span>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <form id="application-form" onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Simple Lead Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={() => handleBlur('fullName')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent text-lg transition-colors ${
                    errors.fullName && touched.fullName
                      ? 'border-red-500 focus:ring-red-500 bg-red-50'
                      : 'border-gray-300 focus:ring-primary'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && touched.fullName && (
                  <div className="flex items-center mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.fullName}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent text-lg transition-colors ${
                    errors.email && touched.email
                      ? 'border-red-500 focus:ring-red-500 bg-red-50'
                      : 'border-gray-300 focus:ring-primary'
                  }`}
                  placeholder="your@email.com"
                />
                {errors.email && touched.email && (
                  <div className="flex items-center mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={() => handleBlur('phone')}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent text-lg transition-colors ${
                    errors.phone && touched.phone
                      ? 'border-red-500 focus:ring-red-500 bg-red-50'
                      : 'border-gray-300 focus:ring-primary'
                  }`}
                  placeholder="+44 7XXX XXXXXX"
                />
                {errors.phone && touched.phone && (
                  <div className="flex items-center mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.phone}
                  </div>
                )}
              </div>
            </div>

            {/* Guarantees Section */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-600" />
                What You Get With Your Free Consultation
              </h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center text-green-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Job Placement Guarantee
                  </div>
                  <div className="flex items-center text-green-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Job Placement Assistance
                  </div>
                  <div className="flex items-center text-green-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Freelancing Business Setup
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-blue-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Double Income Promise
                  </div>
                  <div className="flex items-center text-blue-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    4-Month Comprehensive Training
                  </div>
                  <div className="flex items-center text-blue-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Lifetime Career Support
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Sticky Submit Button */}
        <div className="border-t border-gray-200 p-6 bg-white rounded-b-2xl">
          <button
            type="submit"
            form="application-form"
            disabled={isSubmitting || !isFormValid()}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transform transition-all duration-200 flex items-center justify-center ${
              isSubmitting || !isFormValid()
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:scale-[1.02]'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Get FREE AI Career Consultation
              </>
            )}
          </button>
          
          {!isFormValid() && !isSubmitting && (
            <p className="text-sm text-red-600 text-center mt-2 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              Please fill in all required fields correctly
            </p>
          )}
          
          <p className="text-xs text-gray-500 text-center mt-3">
            🔒 We'll call you within 2 hours to discuss your AI career opportunity. 100% Free consultation.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
