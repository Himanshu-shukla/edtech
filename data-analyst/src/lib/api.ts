// API utilities for connecting to the backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// API endpoints
export const API_ENDPOINTS = {
  // Courses
  COURSES: '/courses',
  COURSE_BY_ID: (id: string) => `/courses/${id}`,
  FEATURED_COURSES: '/courses/featured',

  // Contact forms (Public endpoints)
  CONTACT_SUBMIT: '/contact/submit',
  STRATEGY_CALL: '/contact/strategy-call',
  INSTALLMENT_INQUIRY: '/contact/installment-inquiry',
  BOOTCAMP_APPLICATION: '/contact/bootcamp-application',

  // Company info
  COMPANY_INFO: '/company/info',
  TEAM_MEMBERS: '/company/team',
  TESTIMONIALS: '/testimonials',

  // Statistics
  STATS: '/statistics',
  SUCCESS_STATS: '/statistics/success',

  // Blog
  BLOG_POSTS: '/blog',
  BLOG_POST_BY_SLUG: (slug: string) => `/blog/${slug}`,

  // FAQ
  FAQ: '/faq',
} as const;

// Types for API responses
export interface BootcampApplication {
  fullName: string;
  email: string;
  phone: string;
  experience?: 'beginner' | 'intermediate' | 'advanced';
  motivation?: string;
  availability?: 'full-time' | 'part-time' | 'both' | 'career-change';
  hasLaptop?: boolean;
  source?: string;
  course?: string;
  currentIncome?: string;
  targetIncome?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  source: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  price: {
    current: number;
    original?: number;
    discount?: string;
  };
  features: string[];
  technologies: string[];
  image?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  review: string;
  image?: string;
}

// API service functions
export const bootcampApi = {
  // Submit bootcamp application (using dedicated bootcamp endpoint)
  submitApplication: (data: BootcampApplication) =>
    apiClient.post(API_ENDPOINTS.BOOTCAMP_APPLICATION, {
      name: data.fullName,
      email: data.email,
      phone: data.phone,
      subject: `${data.course || 'Data Analytics Career Program'} - Free Consultation Request`,
      message: `User requested a free consultation for the 6-month Data Analytics Career Program${data.course ? ` (${data.course})` : ''}. Please contact within 2 hours to discuss their data analytics career opportunities.`,
      source: data.source || 'bootcamp_application',
      courseName: data.course || 'Data Analytics Career Program'
    }),

  // Submit contact form
  submitContact: (data: ContactForm) =>
    apiClient.post(API_ENDPOINTS.CONTACT_SUBMIT, data),

  // Get courses
  getCourses: () =>
    apiClient.get<Course[]>(API_ENDPOINTS.COURSES),

  // Get featured courses
  getFeaturedCourses: () =>
    apiClient.get<Course[]>(API_ENDPOINTS.FEATURED_COURSES),

  // Get testimonials
  getTestimonials: () =>
    apiClient.get<Testimonial[]>(API_ENDPOINTS.TESTIMONIALS),

  // Get company info
  getCompanyInfo: () =>
    apiClient.get(API_ENDPOINTS.COMPANY_INFO),

  // Get statistics
  getStats: () =>
    apiClient.get(API_ENDPOINTS.STATS),

  // Get FAQ
  getFAQ: () =>
    apiClient.get(API_ENDPOINTS.FAQ),
};

export default apiClient;
