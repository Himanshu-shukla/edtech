// Data Adapter Layer
// This file provides the same interface as static data imports but fetches from API
// Allows existing components to work without modifications

import * as api from '../api';
import type {
  TeamMember,
  Value,
  Stat,
  Milestone,
  ContactData,
  CompanyInfo,
  UpcomingSkill,
  Course,
  CourseDetails,
  CoursePricing,
  BlogPost,
  FAQ,
  Mentor,
  MentorFeature,
  CompanyLogo,
  AdvantageStat,
  Testimonial,
  SuccessStat,
  CourseIcons,
  AboutDataResponse,
  MentorDataResponse,
  IconsDataResponse,
  PricingFAQ,
  CourseBenefit
} from '../types';

// Cache to avoid repeated API calls for static data
const memoryCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const CACHE_PREFIX = 'edtech_cache_';

// Persistent cache helpers
const getPersistentCache = (key: string): { data: any; timestamp: number } | null => {
  try {
    const cached = localStorage.getItem(CACHE_PREFIX + key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.warn('Error reading from localStorage cache:', error);
    return null;
  }
};

const setPersistentCache = (key: string, data: any, timestamp: number): void => {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ data, timestamp }));
  } catch (error) {
    console.warn('Error writing to localStorage cache:', error);
  }
};

// Generic caching function with persistent storage
const getCachedData = async <T>(key: string, fetchFn: () => Promise<T>): Promise<T> => {
  const now = Date.now();
  
  // Check memory cache first (fastest)
  const memoryCached = memoryCache.get(key);
  if (memoryCached && (now - memoryCached.timestamp) < CACHE_DURATION) {
    return memoryCached.data;
  }
  
  // Check persistent cache (survives page reload)
  const persistentCached = getPersistentCache(key);
  if (persistentCached && (now - persistentCached.timestamp) < CACHE_DURATION) {
    // Update memory cache for faster access
    memoryCache.set(key, persistentCached);
    return persistentCached.data;
  }
  
  try {

    const data = await fetchFn();
    
    // Store in both caches
    memoryCache.set(key, { data, timestamp: now });
    setPersistentCache(key, data, now);
    
    return data;
  } catch (error) {
    console.error(`Error fetching ${key}:`, error);
    
    // Return any cached data if available, even if expired
    if (memoryCached) {

      return memoryCached.data;
    }
    if (persistentCached) {

      return persistentCached.data;
    }
    
    throw error;
  }
};

// ===== ABOUT DATA ADAPTERS =====

export const getTeamMembersData = (): Promise<TeamMember[]> => getCachedData('teamMembers', api.getTeamMembers);
export const getCompanyValuesData = (): Promise<Value[]> => getCachedData('companyValues', api.getCompanyValues);
export const getAboutStatsData = (): Promise<Stat[]> => getCachedData('aboutStats', api.getAboutStats);
export const getCompanyMilestonesData = (): Promise<Milestone[]> => getCachedData('companyMilestones', api.getCompanyMilestones);
export const getContactDataData = (): Promise<ContactData> => getCachedData('contactData', api.getContactData);
export const getCompanyInfoData = (): Promise<CompanyInfo> => getCachedData('companyInfo', api.getCompanyInfo);
export const getUpcomingSkillsData = (): Promise<UpcomingSkill[]> => getCachedData('upcomingSkills', api.getUpcomingSkills);
export const getHighlightedCountriesData = (): Promise<string[]> => getCachedData('highlightedCountries', api.getHighlightedCountries);

// Helper functions for specific company data
export const getWhatsAppQuickMessages = async (): Promise<string[]> => {
  const companyInfo = await getCompanyInfoData();
  return companyInfo.whatsappQuickMessages || [];
};

export const getPricingFAQ = async (): Promise<PricingFAQ[]> => {
  const companyInfo = await getCompanyInfoData();
  return companyInfo.pricingFaq || [];
};

export const getCourseBenefitsComparison = async (): Promise<CourseBenefit[]> => {
  const companyInfo = await getCompanyInfoData();
  return companyInfo.courseBenefitsComparison || [];
};

// ===== COURSE DATA ADAPTERS =====

export const getCoursesData = (): Promise<Course[]> => getCachedData('courses', api.getAllCourses);
export const getFeaturedCoursesData = (): Promise<Course[]> => getCachedData('featuredCourses', api.getFeaturedCourses);
export const getCourseDetailsData = (courseId: string): Promise<CourseDetails> => 
  getCachedData(`courseDetails-${courseId}`, () => api.getCourseDetails(courseId));
export const getCoursePricingData = (): Promise<CoursePricing[]> => getCachedData('coursePricing', api.getCoursePricing);

// ===== BLOG DATA ADAPTERS =====

export const getBlogPostsData = (): Promise<BlogPost[]> => getCachedData('blogPosts', api.getAllBlogPosts);
export const getFeaturedBlogPostsData = (): Promise<BlogPost[]> => getCachedData('featuredBlogPosts', api.getFeaturedBlogPosts);
export const getBlogCategoriesData = (): Promise<string[]> => getCachedData('blogCategories', api.getBlogCategories);

// ===== OTHER DATA ADAPTERS =====

export const getFAQsData = (): Promise<FAQ[]> => getCachedData('faqs', api.getFAQs);
export const getMentorsData = (): Promise<Mentor[]> => getCachedData('mentors', api.getMentors);
export const getMentorFeaturesData = (): Promise<MentorFeature[]> => getCachedData('mentorFeatures', api.getMentorFeatures);
export const getPartnerCompaniesData = (): Promise<CompanyLogo[]> => getCachedData('partnerCompanies', api.getPartnerCompanies);
export const getAdvantageStatsData = (): Promise<AdvantageStat[]> => getCachedData('advantageStats', api.getAdvantageStats);
export const getTestimonialsData = (): Promise<Testimonial[]> => getCachedData('testimonials', api.getTestimonials);
export const getTrustpilotReviewsData = (): Promise<any[]> => getCachedData('trustpilotReviews', api.getTrustpilotReviews);
export const getSuccessStatsData = (): Promise<SuccessStat[]> => getCachedData('success-stats', api.getSuccessStats);
export const getCourseIconsData = (): Promise<CourseIcons> => getCachedData('courseIcons', api.getCourseIcons);

// ===== LEGACY COMPATIBILITY FUNCTIONS =====

// These functions maintain the exact same interface as the original static imports
export const getAllCourses = getCoursesData;
export const getFeaturedCourses = getFeaturedCoursesData;

// Helper functions that mirror the original data file exports
export const getPostBySlug = (slug: string): Promise<BlogPost> => api.getBlogPostBySlug(slug);
export const getPostsByCategory = (category: string): Promise<BlogPost[]> => api.getPostsByCategory(category);
export const getRelatedPosts = (slug: string, limit = 3): Promise<BlogPost[]> => api.getRelatedPosts(slug, limit);

// Icon helper functions
export const getIcon = async (iconName?: string): Promise<string> => {
  try {
    const icons = await getCourseIconsData();
    if (!iconName) return icons.default || 'M13 10V3L4 14h7v7l9-11h-7z';
    return icons[iconName] || icons.default || 'M13 10V3L4 14h7v7l9-11h-7z';
  } catch (error) {
    console.error('Error fetching icon:', error);
    return 'M13 10V3L4 14h7v7l9-11h-7z';
  }
};

export const getCourseIcon = async (course: { iconName?: string }): Promise<string> => {
  return getIcon(course.iconName);
};

// ===== COMBINED DATA FUNCTIONS =====

// Optimized functions that fetch related data in one call
export const getAboutPageData = async (): Promise<AboutDataResponse> => {
  try {
    const data = await api.getAboutData() as AboutDataResponse;
    return {
      teamMembers: data.teamMembers || [],
      companyValues: data.companyValues || [],
      aboutStats: data.aboutStats || [],
      companyMilestones: data.companyMilestones || [],
      contactData: data.contactData || {} as ContactData,
      companyInfo: data.companyInfo || {} as CompanyInfo,
      upcomingSkills: data.upcomingSkills || [],
      highlightedCountries: data.highlightedCountries || []
    };
  } catch (error) {
    console.error('Error fetching about page data:', error);
    // Return empty structure as fallback
    return {
      teamMembers: [],
      companyValues: [],
      aboutStats: [],
      companyMilestones: [],
      contactData: {} as ContactData,
      companyInfo: {} as CompanyInfo,
      upcomingSkills: [],
      highlightedCountries: []
    };
  }
};

export const getMentorPageData = async (): Promise<MentorDataResponse> => {
  try {
    const data = await api.getMentorData() as MentorDataResponse;
    return {
      mentors: data.mentors || [],
      mentorFeatures: data.mentorFeatures || [],
      partnerCompanies: data.partnerCompanies || []
    };
  } catch (error) {
    console.error('Error fetching mentor page data:', error);
    return {
      mentors: [],
      mentorFeatures: [],
      partnerCompanies: []
    };
  }
};

export const getIconsPageData = async (): Promise<IconsDataResponse> => {
  try {
    const data = await api.getIconsData() as IconsDataResponse;
    return {
      courseIcons: data.courseIcons || {}
    };
  } catch (error) {
    console.error('Error fetching icons data:', error);
    return {
      courseIcons: {}
    };
  }
};

// ===== CACHE MANAGEMENT =====

export const clearCache = () => {
  // Clear memory cache
  memoryCache.clear();
  
  // Clear persistent cache
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));

  } catch (error) {
    console.warn('Error clearing persistent cache:', error);
  }
};

export const clearCacheItem = (key: string) => {
  memoryCache.delete(key);
  try {
    localStorage.removeItem(CACHE_PREFIX + key);
  } catch (error) {
    console.warn('Error removing persistent cache item:', error);
  }
};

export const getCacheStats = () => {
  let persistentCacheSize = 0;
  const persistentKeys: string[] = [];
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        persistentKeys.push(key.replace(CACHE_PREFIX, ''));
        const item = localStorage.getItem(key);
        if (item) persistentCacheSize += item.length;
      }
    }
  } catch (error) {
    console.warn('Error reading cache stats:', error);
  }

  return {
    memory: {
      size: memoryCache.size,
      keys: Array.from(memoryCache.keys()),
      totalMemory: JSON.stringify(Array.from(memoryCache.values())).length
    },
    persistent: {
      size: persistentKeys.length,
      keys: persistentKeys,
      totalMemory: persistentCacheSize
    },
    cacheDurationHours: CACHE_DURATION / (60 * 60 * 1000)
  };
};
