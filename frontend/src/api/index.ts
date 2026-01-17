// API layer for backend server communications only
// UI utilities and third-party integrations remain in components

// Backend API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Generic API error handling
interface APIError {
  status: number;
  message: string;
  name: string;
}

const createAPIError = (status: number, message: string): APIError => ({
  status,
  message,
  name: 'APIError'
});

// Generic fetch wrapper with error handling
const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const apiError = createAPIError(response.status, `API Error: ${response.statusText}`);
      throw new Error(apiError.message);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.message.includes('API Error:')) {
      throw error;
    }
    console.error(`API request failed for ${endpoint}:`, error);
    throw new Error('Network error occurred. Please check your connection.');
  }
};

// ===== COMPANY & ABOUT DATA APIs =====

export const getCompanyInfo = async () => {
  return apiRequest<any>('/company/info');
};

export const getTeamMembers = async () => {
  return apiRequest<any>('/company/team');
};

export const getCompanyValues = async () => {
  return apiRequest<any>('/company/values');
};

export const getAboutStats = async () => {
  return apiRequest<any>('/company/stats');
};

export const getCompanyMilestones = async () => {
  return apiRequest<any>('/company/milestones');
};

export const getContactData = async () => {
  return apiRequest<any>('/company/contact');
};

export const getUpcomingSkills = async () => {
  return apiRequest<any>('/company/skills');
};

export const getHighlightedCountries = async () => {
  return apiRequest<any>('/company/countries');
};

// Combined about data endpoint
export const getAboutData = async () => {
  return apiRequest<any>('/company/about');
};

// ===== COURSES APIs =====

export const getAllCourses = async () => {
  return apiRequest<any>('/courses');
};

export const getFeaturedCourses = async () => {
  return apiRequest<any>('/courses/featured');
};

export const getCourseById = async (courseId: string) => {
  return apiRequest<any>(`/courses/${courseId}`);
};

export const getCourseDetails = async (courseId: string) => {
  return apiRequest<any>(`/courses/${courseId}/details`);
};

export const getCoursePricing = async () => {
  return apiRequest<any>('/courses/pricing/all');
};

export const getCoursePricingById = async (courseId: string) => {
  return apiRequest<any>(`/courses/pricing/${courseId}`);
};

// ===== BLOG APIs =====

export const getAllBlogPosts = async (params?: {
  category?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}) => {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.append('category', params.category);
  if (params?.featured) searchParams.append('featured', 'true');
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.offset) searchParams.append('offset', params.offset.toString());
  
  const query = searchParams.toString();
  return apiRequest<any>(`/blog${query ? `?${query}` : ''}`);
};

export const getBlogPostBySlug = async (slug: string) => {
  return apiRequest<any>(`/blog/slug/${slug}`);
};

export const getBlogPostById = async (postId: string) => {
  return apiRequest<any>(`/blog/id/${postId}`);
};

export const getFeaturedBlogPosts = async () => {
  return apiRequest<any>('/blog/featured');
};

export const getBlogCategories = async () => {
  return apiRequest<any>('/blog/categories');
};

export const getPostsByCategory = async (category: string) => {
  return apiRequest<any>(`/blog/category/${category}`);
};

export const getRelatedPosts = async (slug: string, limit = 3) => {
  return apiRequest<any>(`/blog/slug/${slug}/related?limit=${limit}`);
};

// ===== OTHER DATA APIs =====

export const getFAQs = async () => {
  return apiRequest<any>('/faqs');
};

export const getMentors = async () => {
  return apiRequest<any>('/mentors');
};

export const getMentorFeatures = async () => {
  return apiRequest<any>('/mentors/features');
};

export const getPartnerCompanies = async () => {
  // Placeholder - returns empty array for now  
  return [];
};

export const getAdvantageStats = async () => {
  return apiRequest<any>('/stats');
};

export const getTestimonials = async () => {
  return apiRequest<any>('/testimonials');
};

export const getTrustpilotReviews = async () => {
  return apiRequest<any>('/trustpilot-reviews');
};

export const getSuccessStats = async () => {
  return apiRequest<any>('/success-stats');
};

export const getCourseIcons = async () => {
  return apiRequest<any>('/icons');
};



export const getMentorData = async () => {
  const [mentors, mentorFeatures, partnerCompanies] = await Promise.all([
    getMentors(),
    getMentorFeatures(),
    apiRequest<any>('/mentors/companies')
  ]);
  return {
    mentors: mentors || [],
    mentorFeatures: mentorFeatures || [],
    partnerCompanies: partnerCompanies || []
  };
};

export const getIconsData = async () => {
  const courseIcons = await getCourseIcons();
  return { courseIcons };
};

// ===== CONTACT FORM APIs =====

export const submitContactForm = async (data: {
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message?: string;
  source?: string;
}) => {
  return apiRequest<any>('/contact/submit', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

export const submitStrategyCall = async (data: {
  name: string;
  email: string;
  phone: string;
  source?: string;
}) => {
  return apiRequest<any>('/contact/strategy-call', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

export const submitInstallmentInquiry = async (data: {
  name: string;
  email: string;
  phone: string;
  courseId?: string;
  courseName?: string;
  source?: string;
}) => {
  return apiRequest<any>('/contact/installment-inquiry', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

// ===== PAYMENT APIs =====

export const createPaymentOrder = async (orderData: {
  courseId: string;
  courseName: string;
  amount: number;
  currency: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  couponCode?: string;
}) => {
  return apiRequest<any>('/payments/create-order', {
    method: 'POST',
    body: JSON.stringify(orderData)
  });
};

export const verifyPayment = async (paymentData: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}) => {
  return apiRequest<any>('/payments/verify', {
    method: 'POST',
    body: JSON.stringify(paymentData)
  });
};

export const createPayPalOrder = async (orderData: {
  courseId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  couponCode?: string;
}) => {
  return apiRequest<any>('/payments/paypal/create-order', {
    method: 'POST',
    body: JSON.stringify(orderData)
  });
};

export const capturePayPalPayment = async (paypalOrderId: string) => {
  return apiRequest<any>('/payments/paypal/capture-payment', {
    method: 'POST',
    body: JSON.stringify({ paypalOrderId })
  });
};

export const validateCoupon = async (couponCode: string, courseId: string) => {
  return apiRequest<any>(`/coupons/validate?code=${couponCode}&courseId=${courseId}`);
};

// ===== HEALTH CHECK =====

export const healthCheck = async () => {
  return apiRequest<any>('/health');
};
