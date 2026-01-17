import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { ApiResponse, AuthResponse, LoginCredentials, DashboardStats } from '../types';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token and handle FormData
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // If the data is FormData, delete the Content-Type header
    // to let the browser set it with the correct boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Payment API
export const paymentsApi = {
  getStats: async (period: number = 30): Promise<ApiResponse> => {
    const response = await api.get(`/payments/stats?period=${period}`);
    return response.data;
  },

  getTransactions: async (params?: { page?: number; limit?: number; status?: string; courseId?: string }): Promise<ApiResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.courseId) queryParams.append('courseId', params.courseId);
    
    const query = queryParams.toString();
    const response = await api.get(`/payments/transactions${query ? `?${query}` : ''}`);
    return response.data;
  },

  getOrders: async (params?: { page?: number; limit?: number; status?: string; courseId?: string }): Promise<ApiResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.courseId) queryParams.append('courseId', params.courseId);
    
    const query = queryParams.toString();
    const response = await api.get(`/payments/orders${query ? `?${query}` : ''}`);
    return response.data;
  }
};

export const couponsApi = {
  getAll: async (params?: { page?: number; limit?: number; search?: string; isActive?: boolean; discountType?: string }): Promise<ApiResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    if (params?.discountType) queryParams.append('discountType', params.discountType);
    
    const query = queryParams.toString();
    const response = await api.get(`/coupons/admin${query ? `?${query}` : ''}`);
    return response.data;
  },
  getById: async (id: string): Promise<ApiResponse> => {
    const response = await api.get(`/coupons/admin/${id}`);
    return response.data;
  },
  create: async (data: any): Promise<ApiResponse> => {
    const response = await api.post('/coupons/admin', data);
    return response.data;
  },
  update: async (id: string, data: any): Promise<ApiResponse> => {
    const response = await api.put(`/coupons/admin/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/coupons/admin/${id}`);
    return response.data;
  },
  getAnalytics: async (params?: { courseId?: string; days?: number }): Promise<ApiResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.courseId) queryParams.append('courseId', params.courseId);
    if (params?.days) queryParams.append('days', params.days.toString());
    
    const query = queryParams.toString();
    const response = await api.get(`/coupons/admin/analytics${query ? `?${query}` : ''}`);
    return response.data;
  }
};

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  getAllUsers: async (): Promise<ApiResponse> => {
    const response = await api.get('/auth/users');
    return response.data;
  },

  createUser: async (userData: unknown): Promise<ApiResponse> => {
    const response = await api.post('/auth/users', userData);
    return response.data;
  },

  deleteUser: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/auth/users/${id}`);
    return response.data;
  },
};

// Admin API
export const adminApi = {
  // Dashboard
  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  // Generic CRUD operations
  getAll: async (resource: string): Promise<ApiResponse> => {
    const response = await api.get(`/admin/${resource}`);
    return response.data;
  },

  getById: async (resource: string, id: string): Promise<ApiResponse> => {
    const response = await api.get(`/admin/${resource}/${id}`);
    return response.data;
  },

  create: async (resource: string, data: unknown): Promise<ApiResponse> => {
    const response = await api.post(`/admin/${resource}`, data);
    return response.data;
  },

  update: async (resource: string, id: string, data: unknown): Promise<ApiResponse> => {
    const response = await api.put(`/admin/${resource}/${id}`, data);
    return response.data;
  },

  delete: async (resource: string, id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/admin/${resource}/${id}`);
    return response.data;
  },
};

// Specific resource APIs for better type safety
export const coursesApi = {
  getAll: () => adminApi.getAll('courses'),
  getById: (id: string) => adminApi.getById('courses', id),
  create: (data: unknown) => {
    // For multipart/form-data (file uploads)
    if (data instanceof FormData) {
      return api.post('/admin/courses', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => response.data);
    }
    // For regular JSON data
    return adminApi.create('courses', data);
  },
  update: (id: string, data: unknown) => {
    // For multipart/form-data (file uploads)
    if (data instanceof FormData) {
      return api.put(`/admin/courses/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => response.data);
    }
    // For regular JSON data
    return adminApi.update('courses', id, data);
  },
  delete: (id: string) => adminApi.delete('courses', id),
};

export const courseDetailsApi = {
  getAll: () => adminApi.getAll('course-details'),
  getById: (id: string) => adminApi.getById('course-details', id),
  create: (data: unknown) => adminApi.create('course-details', data),
  update: (id: string, data: unknown) => adminApi.update('course-details', id, data),
  delete: (id: string) => adminApi.delete('course-details', id),
};

export const coursePricingApi = {
  getAll: () => adminApi.getAll('course-pricing'),
  getById: (id: string) => adminApi.getById('course-pricing', id),
  create: (data: unknown) => adminApi.create('course-pricing', data),
  update: (id: string, data: unknown) => adminApi.update('course-pricing', id, data),
  delete: (id: string) => adminApi.delete('course-pricing', id),
};

export const blogsApi = {
  getAll: () => adminApi.getAll('blogs'),
  getById: (id: string) => adminApi.getById('blogs', id),
  create: (data: unknown) => {
    // For multipart/form-data (file uploads)
    if (data instanceof FormData) {
      return api.post('/admin/blogs', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => response.data);
    }
    // For regular JSON data
    return adminApi.create('blogs', data);
  },
  update: (id: string, data: unknown) => {
    // For multipart/form-data (file uploads)
    if (data instanceof FormData) {
      return api.put(`/admin/blogs/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => response.data);
    }
    // For regular JSON data
    return adminApi.update('blogs', id, data);
  },
  delete: (id: string) => adminApi.delete('blogs', id),
};

export const teamMembersApi = {
  getAll: () => adminApi.getAll('team-members'),
  getById: (id: string) => adminApi.getById('team-members', id),
  create: (data: unknown) => {
    // For multipart/form-data (file uploads)
    if (data instanceof FormData) {
      return api.post('/admin/team-members', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => response.data);
    }
    // For regular JSON data
    return adminApi.create('team-members', data);
  },
  update: (id: string, data: unknown) => {
    // For multipart/form-data (file uploads)
    if (data instanceof FormData) {
      return api.put(`/admin/team-members/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => response.data);
    }
    // For regular JSON data
    return adminApi.update('team-members', id, data);
  },
  delete: (id: string) => adminApi.delete('team-members', id),
};

export const companyInfoApi = {
  getAll: () => adminApi.getAll('company-info'),
  getById: (id: string) => adminApi.getById('company-info', id),
  create: (data: unknown) => adminApi.create('company-info', data),
  update: (id: string, data: unknown) => adminApi.update('company-info', id, data),
  delete: (id: string) => adminApi.delete('company-info', id),
};

export const upcomingSkillsApi = {
  getAll: () => adminApi.getAll('upcoming-skills'),
  getById: (id: string) => adminApi.getById('upcoming-skills', id),
  create: (data: unknown) => adminApi.create('upcoming-skills', data),
  update: (id: string, data: unknown) => adminApi.update('upcoming-skills', id, data),
  delete: (id: string) => adminApi.delete('upcoming-skills', id),
};

export const valuesApi = {
  getAll: () => adminApi.getAll('values'),
  getById: (id: string) => adminApi.getById('values', id),
  create: (data: unknown) => adminApi.create('values', data),
  update: (id: string, data: unknown) => adminApi.update('values', id, data),
  delete: (id: string) => adminApi.delete('values', id),
};

export const statsApi = {
  getAll: () => adminApi.getAll('stats'),
  getById: (id: string) => adminApi.getById('stats', id),
  create: (data: unknown) => adminApi.create('stats', data),
  update: (id: string, data: unknown) => adminApi.update('stats', id, data),
  delete: (id: string) => adminApi.delete('stats', id),
};

export const milestonesApi = {
  getAll: () => adminApi.getAll('milestones'),
  getById: (id: string) => adminApi.getById('milestones', id),
  create: (data: unknown) => adminApi.create('milestones', data),
  update: (id: string, data: unknown) => adminApi.update('milestones', id, data),
  delete: (id: string) => adminApi.delete('milestones', id),
};

export const contactDataApi = {
  getAll: () => adminApi.getAll('contact-data'),
  getById: (id: string) => adminApi.getById('contact-data', id),
  create: (data: unknown) => adminApi.create('contact-data', data),
  update: (id: string, data: unknown) => adminApi.update('contact-data', id, data),
  delete: (id: string) => adminApi.delete('contact-data', id),
};

export const highlightedCountriesApi = {
  getAll: () => adminApi.getAll('highlighted-countries'),
  getById: (id: string) => adminApi.getById('highlighted-countries', id),
  create: (data: unknown) => adminApi.create('highlighted-countries', data),
  update: (id: string, data: unknown) => adminApi.update('highlighted-countries', id, data),
  delete: (id: string) => adminApi.delete('highlighted-countries', id),
};

export const mentorsApi = {
  getAll: () => adminApi.getAll('mentors'),
  getById: (id: string) => adminApi.getById('mentors', id),
  create: (data: unknown) => adminApi.create('mentors', data),
  update: (id: string, data: unknown) => adminApi.update('mentors', id, data),
  delete: (id: string) => adminApi.delete('mentors', id),
};

export const mentorFeaturesApi = {
  getAll: () => adminApi.getAll('mentor-features'),
  getById: (id: string) => adminApi.getById('mentor-features', id),
  create: (data: unknown) => adminApi.create('mentor-features', data),
  update: (id: string, data: unknown) => adminApi.update('mentor-features', id, data),
  delete: (id: string) => adminApi.delete('mentor-features', id),
};

export const companyLogosApi = {
  getAll: () => adminApi.getAll('company-logos'),
  getById: (id: string) => adminApi.getById('company-logos', id),
  create: (data: unknown) => adminApi.create('company-logos', data),
  update: (id: string, data: unknown) => adminApi.update('company-logos', id, data),
  delete: (id: string) => adminApi.delete('company-logos', id),
};

export const faqsApi = {
  getAll: () => adminApi.getAll('faqs'),
  getById: (id: string) => adminApi.getById('faqs', id),
  create: (data: unknown) => adminApi.create('faqs', data),
  update: (id: string, data: unknown) => adminApi.update('faqs', id, data),
  delete: (id: string) => adminApi.delete('faqs', id),
};

export const advantageStatsApi = {
  getAll: () => adminApi.getAll('advantage-stats'),
  getById: (id: string) => adminApi.getById('advantage-stats', id),
  create: (data: unknown) => adminApi.create('advantage-stats', data),
  update: (id: string, data: unknown) => adminApi.update('advantage-stats', id, data),
  delete: (id: string) => adminApi.delete('advantage-stats', id),
};

export const testimonialsApi = {
  getAll: () => adminApi.getAll('testimonials'),
  getById: (id: string) => adminApi.getById('testimonials', id),
  create: (data: unknown) => {
    // For multipart/form-data (file uploads)
    if (data instanceof FormData) {
      return api.post('/admin/testimonials', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => response.data);
    }
    // For regular JSON data
    return adminApi.create('testimonials', data);
  },
  update: (id: string, data: unknown) => {
    // For multipart/form-data (file uploads)
    if (data instanceof FormData) {
      return api.put(`/admin/testimonials/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => response.data);
    }
    // For regular JSON data
    return adminApi.update('testimonials', id, data);
  },
  delete: (id: string) => adminApi.delete('testimonials', id),
};

export const trustpilotReviewsApi = {
  getAll: () => adminApi.getAll('trustpilot-reviews'),
  getById: (id: string) => adminApi.getById('trustpilot-reviews', id),
  create: (data: unknown) => {
    // For multipart/form-data (file uploads)
    if (data instanceof FormData) {
      return api.post('/admin/trustpilot-reviews', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => response.data);
    }
    // For regular JSON data
    return adminApi.create('trustpilot-reviews', data);
  },
  update: (id: string, data: unknown) => {
    // For multipart/form-data (file uploads)
    if (data instanceof FormData) {
      return api.put(`/admin/trustpilot-reviews/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => response.data);
    }
    // For regular JSON data
    return adminApi.update('trustpilot-reviews', id, data);
  },
  delete: (id: string) => adminApi.delete('trustpilot-reviews', id),
};

export const successStatsApi = {
  getAll: () => adminApi.getAll('success-stats'),
  getById: (id: string) => adminApi.getById('success-stats', id),
  create: (data: unknown) => adminApi.create('success-stats', data),
  update: (id: string, data: unknown) => adminApi.update('success-stats', id, data),
  delete: (id: string) => adminApi.delete('success-stats', id),
};

// Customer API
export const customersApi = {
  getAll: async (params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    status?: string; 
    paymentStatus?: string; 
    paymentType?: string; 
    courseId?: string; 
    source?: string; 
    startDate?: string; 
    endDate?: string; 
    sortBy?: string; 
    sortOrder?: string; 
  }): Promise<ApiResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.paymentStatus) queryParams.append('paymentStatus', params.paymentStatus);
    if (params?.paymentType) queryParams.append('paymentType', params.paymentType);
    if (params?.courseId) queryParams.append('courseId', params.courseId);
    if (params?.source) queryParams.append('source', params.source);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    
    const query = queryParams.toString();
    const response = await api.get(`/customers${query ? `?${query}` : ''}`);
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse> => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  create: async (data: any): Promise<ApiResponse> => {
    const response = await api.post('/customers', data);
    return response.data;
  },

  update: async (id: string, data: any): Promise<ApiResponse> => {
    const response = await api.put(`/customers/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  },

  getStats: async (period: number = 30): Promise<ApiResponse> => {
    const response = await api.get(`/customers/stats?period=${period}`);
    return response.data;
  },

  export: async (params?: { format?: string; [key: string]: any }): Promise<void> => {
    const queryParams = new URLSearchParams();
    if (params?.format) queryParams.append('format', params.format);
    // Add other filter params
    Object.keys(params || {}).forEach(key => {
      if (key !== 'format' && params![key]) {
        queryParams.append(key, params![key]);
      }
    });
    
    const query = queryParams.toString();
    const response = await api.get(`/customers/export${query ? `?${query}` : ''}`, {
      responseType: 'blob'
    });
    
    // Create blob and download
    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `customers-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

// Inquiry API
export const inquiriesApi = {
  getAll: async (params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    status?: string; 
    type?: string; 
    source?: string; 
    assignedTo?: string; 
    startDate?: string; 
    endDate?: string; 
    sortBy?: string; 
    sortOrder?: string; 
  }): Promise<ApiResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.source) queryParams.append('source', params.source);
    if (params?.assignedTo) queryParams.append('assignedTo', params.assignedTo);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    
    const query = queryParams.toString();
    const response = await api.get(`/inquiries${query ? `?${query}` : ''}`);
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse> => {
    const response = await api.get(`/inquiries/${id}`);
    return response.data;
  },

  create: async (data: any): Promise<ApiResponse> => {
    const response = await api.post('/inquiries', data);
    return response.data;
  },

  update: async (id: string, data: any): Promise<ApiResponse> => {
    const response = await api.put(`/inquiries/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/inquiries/${id}`);
    return response.data;
  },

  getStats: async (period: number = 30): Promise<ApiResponse> => {
    const response = await api.get(`/inquiries/stats?period=${period}`);
    return response.data;
  },

  export: async (params?: { format?: string; [key: string]: any }): Promise<void> => {
    const queryParams = new URLSearchParams();
    if (params?.format) queryParams.append('format', params.format);
    // Add other filter params
    Object.keys(params || {}).forEach(key => {
      if (key !== 'format' && params![key]) {
        queryParams.append(key, params![key]);
      }
    });
    
    const query = queryParams.toString();
    const response = await api.get(`/inquiries/export${query ? `?${query}` : ''}`, {
      responseType: 'blob'
    });
    
    // Create blob and download
    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inquiries-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

// Icons API
export const iconsApi = {
  getAll: async (): Promise<ApiResponse> => {
    const response = await api.get('/icons/all');
    return response.data;
  },
  getCourseIcons: async (): Promise<Record<string, string>> => {
    const response = await api.get('/icons');
    return response.data;
  },
  getByName: async (iconName: string): Promise<ApiResponse> => {
    const response = await api.get(`/icons/${iconName}`);
    return response.data;
  },
  create: (data: unknown) => adminApi.create('course-icons', data),
  update: (id: string, data: unknown) => adminApi.update('course-icons', id, data),
  delete: (id: string) => adminApi.delete('course-icons', id),
};

// Utility function to upload testimonial avatar images
export const uploadTestimonialAvatar = async (file: File): Promise<{ success: boolean; filename?: string; message?: string }> => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    // Don't manually set Content-Type - let the browser set it with boundary
    const response = await api.post('/admin/upload/testimonial-avatar', formData);
    
    return {
      success: response.data.success,
      filename: response.data.filename,
      message: response.data.message
    };
  } catch (error: any) {
    console.error('Upload error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || error.message || 'Upload failed' 
    };
  }
};

// Utility function to upload mentor profile images
export const uploadMentorImage = async (file: File): Promise<{ success: boolean; filename?: string; message?: string }> => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    // Don't manually set Content-Type - let the browser set it with boundary
    const response = await api.post('/admin/upload/mentor-image', formData);
    
    return {
      success: response.data.success,
      filename: response.data.filename,
      message: response.data.message
    };
  } catch (error: any) {
    console.error('Upload error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || error.message || 'Upload failed' 
    };
  }
};

export default api;
