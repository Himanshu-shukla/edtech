// Types that match the backend interfaces exactly

// About & Company Types
export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin: string;
  twitter: string;
}

export interface Value {
  iconPath: string;
  title: string;
  description: string;
}

export interface Stat {
  number: string;
  label: string;
  color: string;
}

export interface SuccessStat {
  value: string;
  label: string;
}

export interface Milestone {
  year: string;
  title: string;
  description: string;
}

export interface ContactOffice {
  name: string;
  address: string;
  email?: string;
  phone: string;
  mapUrl?: string;
}

export interface UpcomingSkill {
  id: string;
  name: string;
  category: string;
  demand: string;
  growth: string;
  icon: string;
  accent: string;
}

export interface PricingFAQ {
  id: number;
  question: string;
  answer: string;
}

export interface CourseBenefit {
  feature: string;
  description: string;
  us: boolean | string;
  others: boolean | string;
}

export interface CompanyInfo {
  whatsappNumber: string;
  supportEmail: string;
  heroRoles: string[];
  carouselRoles: string[];
  marketingStats: { number: string; label: string }[];
  whatsappQuickMessages: string[];
  pricingFaq: PricingFAQ[];
  courseBenefitsComparison: CourseBenefit[];
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export interface ContactData {
  offices: ContactOffice[];
  responseTime: string;
  mapEmbedUrl: string;
}

// Course Types
export interface Course {
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
  image?: string; // Course image filename
  pricing?: {
    current: number;
    original?: number;
    discount?: string;
  };
}

export interface CourseDetails {
  overview: string;
  features?: Array<{
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
  pricing?: {
    current: number;
    original?: number;
    discount?: string;
    deadline?: string;
    features?: Array<{
      text: string;
      icon: string;
    }>;
  } | null;
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
}

// Blog Types
export interface BlogPost {
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
}

// FAQ Types
export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

// Pricing Types
export interface CoursePricing {
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
}

// Mentor Types
export interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  accent: 'blue' | 'orange' | 'green';
}

export interface MentorFeature {
  icon: string;
  title: string;
  description: string;
}

export interface CompanyLogo {
  name: string;
  logo: string;
}

// Statistics Types
export interface AdvantageStat {
  id: string;
  title: string;
  value: string;
  label: string;
  description: string;
  dots: number;
  accent: 'blue' | 'orange' | 'green';
}

// Testimonial Types
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  rating: number;
  review: string;
  category: string;
  accent: 'blue' | 'orange' | 'green' | 'red';
  photo?: string;
}

// Course-specific testimonial with avatar
export interface CourseTestimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  rating: number;
  review: string;
  avatar: string; // URL to avatar image
  color: string; // CSS color class
}

// Icons Types
export interface CourseIcons {
  [key: string]: string;
}

// GeoJSON Types
export interface GeoJsonFeature {
  type: 'Feature';
  properties: {
    name: string;
  };
  geometry: {
    type: string;
    coordinates: any;
  };
  id: string;
}

export interface GeoJsonCollection {
  type: 'FeatureCollection';
  features: GeoJsonFeature[];
}

// API Response Types
export interface AboutDataResponse {
  companyInfo: CompanyInfo;
  teamMembers: TeamMember[];
  companyValues: Value[];
  aboutStats: Stat[];
  companyMilestones: Milestone[];
  contactData: ContactData;
  upcomingSkills: UpcomingSkill[];
  highlightedCountries: string[];
}

export interface MentorDataResponse {
  mentors: Mentor[];
  mentorFeatures: MentorFeature[];
  partnerCompanies: CompanyLogo[];
}

export interface IconsDataResponse {
  courseIcons: CourseIcons;
}
