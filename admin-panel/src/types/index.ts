// Authentication types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

// Auth Context types
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

// Dashboard stats
export interface DashboardStats {
  // Revenue Metrics
  totalRevenue: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  averageOrderValue: number;
  
  // Customer Metrics
  totalCustomers: number;
  newCustomers: number;
  paidCustomers: number;
  pendingCustomers: number;
  customerGrowth: number;
  
  // Business Performance
  totalInquiries: number;
  newInquiries: number;
  convertedInquiries: number;
  conversionRate: number;
  inquiryGrowth: number;
  
  // Top Performance
  topCourses: Array<{
    courseName: string;
    revenue: number;
    enrollments: number;
  }>;
  
  // Content Stats (secondary)
  courses: number;
  blogs: number;
  teamMembers: number;
  
  lastUpdated: string;
}

// Course types (from backend)
export interface Course {
  _id: string;
  id: string;
  category: string;
  badge: string;
  title: string;
  desc: string;
  duration: string;
  extra: string;
  accent: 'edtech-green' | 'edtech-orange' | 'edtech-red';
  iconName?: string;
  featured?: boolean;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseDetails {
  _id: string;
  courseId: string;
  overview: string;
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  curriculum: Array<{
    module: string;
    duration: string;
    topics: Array<{
      topic: string;
      subtopics: string[];
    }>;
  }>;
  tools: Array<{
    name: string;
    icon: string;
  }>;
  prerequisites: string;
  testimonials: Array<{
    name: string;
    role: string;
    avatar: string;
    rating: number;
    content: string;
    color: string;
  }>;
  successStats: Array<{
    label: string;
    value: string;
    color: string;
  }>;
  pricing: {
    current: number;
    original: number;
    discount: string;
    deadline: string;
    features: Array<{
      text: string;
      icon: string;
    }>;
  };
  courseInfo: {
    startDate: string;
    format: string;
    support: string;
    studentsEnrolled: string;
  };
  trustIndicators: {
    rating: string;
    reviewCount: string;
    testimonialPreview: {
      text: string;
      author: string;
    };
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CoursePricing {
  _id: string;
  id: string;
  name: string;
  category: string;
  originalPrice: number;
  currentPrice: number;
  installmentPrice: number;
  installmentMonths: number;
  discount: string;
  duration: string;
  extra: string;
  description: string;
  features: string[];
  highlighted: boolean;
  accent: 'edtech-green' | 'edtech-orange' | 'edtech-red' | 'edtech-blue';
  badge: string;
  cta: string;
  popular?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogPost {
  _id: string;
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  featured: boolean;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin: string;
  twitter: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanyInfo {
  _id: string;
  whatsappNumber: string;
  supportEmail: string;
  heroRoles: string[];
  carouselRoles: string[];
  marketingStats: Array<{ number: string; label: string }>;
  whatsappQuickMessages: string[];
  pricingFaq: Array<{
    id: number;
    question: string;
    answer: string;
  }>;
  courseBenefitsComparison: Array<{
    feature: string;
    description: string;
    us: boolean | string;
    others: boolean | string;
  }>;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface UpcomingSkill {
  _id: string;
  id: string;
  name: string;
  category: string;
  demand: string;
  growth: string;
  icon: string;
  accent: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Value {
  _id: string;
  iconPath: string;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Stat {
  _id: string;
  number: string;
  label: string;
  color: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SuccessStat {
  _id: string;
  value: string;
  label: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Milestone {
  _id: string;
  year: string;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactData {
  _id: string;
  offices: Array<{
    name: string;
    address: string;
    email?: string;
    phone: string;
    mapUrl?: string;
  }>;
  responseTime: string;
  mapEmbedUrl: string;
  createdAt?: string;
  updatedAt?: string;
}
