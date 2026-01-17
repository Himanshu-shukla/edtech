# Migration Guide: Static Data → MongoDB API

This guide shows how to migrate from static data imports to the new MongoDB-powered API while maintaining 100% compatibility.

## 🎯 Migration Strategy

The migration is designed to be **zero-breaking-change**. All existing components will continue to work without modifications by using our data adapter layer.

## 📋 Migration Steps

### Step 1: Start the Backend
```bash
cd backend
npm install
npm run seed    # Populate MongoDB with data
npm run dev     # Start API server on localhost:8000
```

### Step 2: Update Component Imports (Gradual Migration)

#### Before (Static Import):
```typescript
import { courses, getFeaturedCourses } from '../data/courses';
import { teamMembers, companyValues } from '../data/about';
import { blogPosts, getPostBySlug } from '../data/blog';
```

#### After (API Import):
```typescript
import { getCoursesData, getFeaturedCoursesData } from '../utils/dataAdapter';
import { getTeamMembersData, getCompanyValuesData } from '../utils/dataAdapter';
import { getBlogPostsData, getPostBySlug } from '../utils/dataAdapter';
```

### Step 3: Update Component Logic

#### Before (Synchronous):
```typescript
export default function CoursesList() {
  const featuredCourses = getFeaturedCourses();
  
  return (
    <div>
      {featuredCourses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
```

#### After (Asynchronous with hooks):
```typescript
import { useEffect, useState } from 'react';
import { getFeaturedCoursesData } from '../utils/dataAdapter';

export default function CoursesList() {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedCoursesData()
      .then(setFeaturedCourses)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {featuredCourses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
```

## 🔄 API Mapping Reference

### Company & About Data
| Static Import | API Function | Description |
|---------------|--------------|-------------|
| `teamMembers` | `getTeamMembersData()` | Company team members |
| `companyValues` | `getCompanyValuesData()` | Company core values |
| `aboutStats` | `getAboutStatsData()` | Company statistics |
| `companyMilestones` | `getCompanyMilestonesData()` | Company timeline |
| `contactData` | `getContactDataData()` | Contact information |
| `companyInfo` | `getCompanyInfoData()` | Company details |
| `upcomingSkills` | `getUpcomingSkillsData()` | Trending skills |

### Course Data
| Static Import | API Function | Description |
|---------------|--------------|-------------|
| `courses` | `getCoursesData()` | All courses |
| `getFeaturedCourses()` | `getFeaturedCoursesData()` | Featured courses |
| `courseDetails[id]` | `getCourseDetailsData(id)` | Course details |
| `coursePricing` | `getCoursePricingData()` | Pricing information |

### Blog Data
| Static Import | API Function | Description |
|---------------|--------------|-------------|
| `blogPosts` | `getBlogPostsData()` | All blog posts |
| `featuredPosts` | `getFeaturedBlogPostsData()` | Featured posts |
| `categories` | `getBlogCategoriesData()` | Blog categories |
| `getPostBySlug(slug)` | `getPostBySlug(slug)` | Single post |

### Other Data
| Static Import | API Function | Description |
|---------------|--------------|-------------|
| `generalFAQs` | `getFAQsData()` | FAQ data |
| `mentors` | `getMentorsData()` | Mentor profiles |
| `testimonials` | `getTestimonialsData()` | Student testimonials |
| `advantageStats` | `getAdvantageStatsData()` | Stats data |
| `COURSE_ICONS` | `getCourseIconsData()` | Icon library |

## 🚀 Advanced Migration Patterns

### Pattern 1: Combined Data Fetching
```typescript
// Instead of multiple API calls
const [teamMembers, setTeamMembers] = useState([]);
const [companyValues, setCompanyValues] = useState([]);
const [aboutStats, setAboutStats] = useState([]);

// Use combined endpoint
const [aboutData, setAboutData] = useState(null);

useEffect(() => {
  getAboutPageData().then(setAboutData);
}, []);
```

### Pattern 2: Custom Hook for Data Fetching
```typescript
// Create reusable data hooks
export const useCoursesData = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCoursesData()
      .then(setCourses)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { courses, loading, error };
};

// Use in components
export default function CoursesPage() {
  const { courses, loading, error } = useCoursesData();
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <CoursesList courses={courses} />;
}
```

### Pattern 3: React Query Integration (Recommended)
```typescript
// Install react-query: npm install @tanstack/react-query

import { useQuery } from '@tanstack/react-query';
import { getFeaturedCoursesData } from '../utils/dataAdapter';

export const useFeaturedCourses = () => {
  return useQuery({
    queryKey: ['featuredCourses'],
    queryFn: getFeaturedCoursesData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000  // 10 minutes
  });
};
```

## ⚡ Performance Optimizations

### 1. Caching
The data adapter includes automatic caching:
```typescript
// Data is cached for 5 minutes automatically
const courses = await getCoursesData(); // API call
const coursesAgain = await getCoursesData(); // From cache
```

### 2. Preloading
Preload data on route entry:
```typescript
// In route component
useEffect(() => {
  // Preload data for next pages
  getCoursesData();
  getBlogPostsData();
}, []);
```

### 3. Parallel Loading
Load multiple data sources simultaneously:
```typescript
useEffect(() => {
  Promise.all([
    getCoursesData(),
    getTestimonialsData(),
    getMentorsData()
  ]).then(([courses, testimonials, mentors]) => {
    // Handle all data together
  });
}, []);
```

## 🛠️ Development Workflow

### Local Development
1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Backend API: `http://localhost:8000/api`
4. Frontend: `http://localhost:5173`

### Testing API Endpoints
```bash
# Test health
curl http://localhost:8000/api/health

# Test courses
curl http://localhost:8000/api/courses

# Test company info
curl http://localhost:8000/api/company/info
```

## 🔧 Environment Configuration

### Frontend Environment Variables
```bash
# .env.local
VITE_API_BASE_URL=http://localhost:8000/api
```

### Backend Environment Variables
```bash
# .env
MONGODB_URI=mongodb://localhost:27017/edtech
PORT=8000
CORS_ORIGIN=http://localhost:5173
```

## 🚨 Troubleshooting

### Common Issues

#### 1. "Cannot fetch data" Error
- ✅ Ensure backend is running
- ✅ Check MongoDB is connected
- ✅ Verify CORS settings
- ✅ Check network tab in browser

#### 2. Empty Data Returned
- ✅ Run `npm run seed` in backend
- ✅ Check MongoDB has data
- ✅ Verify API endpoints in browser

#### 3. TypeScript Errors
- ✅ All types remain the same
- ✅ Import types from `../types` if needed
- ✅ Check function signatures match

### Debug Commands
```bash
# Check backend health
curl http://localhost:8000/api/health

# Check database content
cd backend && npm run migrate

# Clear frontend cache
localStorage.clear() // In browser console
```

## 📈 Migration Timeline

### Phase 1 (Week 1): Core Components
- [ ] Home page components
- [ ] Course listing components
- [ ] Navigation components

### Phase 2 (Week 2): Content Pages
- [ ] About page
- [ ] Blog components
- [ ] Pricing page

### Phase 3 (Week 3): Advanced Features
- [ ] Search functionality
- [ ] Filtering components
- [ ] Dynamic content

### Phase 4 (Week 4): Optimization
- [ ] Performance tuning
- [ ] Caching optimization
- [ ] Error handling improvement

## ✅ Verification Checklist

After migration, verify:
- [ ] All pages load correctly
- [ ] Data displays properly
- [ ] No console errors
- [ ] Performance is acceptable
- [ ] Loading states work
- [ ] Error handling works
- [ ] Caching functions properly

## 🎉 Benefits After Migration

✅ **Scalability**: Easy to add/modify data
✅ **Performance**: Optimized queries and caching
✅ **Consistency**: Single source of truth
✅ **Flexibility**: API can serve multiple clients
✅ **Real-time**: Potential for live updates
✅ **Analytics**: Track data usage patterns
✅ **Security**: Controlled data access
