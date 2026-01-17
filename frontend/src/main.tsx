import React, { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Layout from './Layout.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// Lazy load components for better performance
const App = lazy(() => import('./App.tsx'))
const ContactPage = lazy(() => import('./pages/Contact.tsx'))
const CoursesPage = lazy(() => import('./pages/Courses.tsx'))
const CoursePage = lazy(() => import('./pages/Course.tsx'))
const AboutPage = lazy(() => import('./pages/About.tsx'))
const PricingPage = lazy(() => import('./pages/Pricing.tsx'))
const BlogPage = lazy(() => import('./pages/Blog.tsx'))
const PostPage = lazy(() => import('./pages/Post.tsx'))
const NotFoundPage = lazy(() => import('./pages/NotFound.tsx'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy.tsx'))
const RefundPolicy = lazy(() => import('./pages/RefundPolicy.tsx'))
const TermsOfService = lazy(() => import('./pages/TermsOfService.tsx'))

// Loading component for lazy routes
const Loading = lazy(() => import('./components/Loading.tsx'))

const LazyWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Layout>
    <Suspense fallback={<Loading />}>
      {children}
    </Suspense>
  </Layout>
)

const router = createBrowserRouter([
  { path: '/', element: <LazyWrapper><App /></LazyWrapper> },
  { path: '/contact', element: <LazyWrapper><ContactPage /></LazyWrapper> },
  { path: '/programs', element: <LazyWrapper><CoursesPage /></LazyWrapper> },
  { path: '/program/:courseId', element: <LazyWrapper><CoursePage /></LazyWrapper> },
  { path: '/about', element: <LazyWrapper><AboutPage /></LazyWrapper> },
  { path: '/pricing', element: <LazyWrapper><PricingPage /></LazyWrapper> },
  { path: '/blog', element: <LazyWrapper><BlogPage /></LazyWrapper> },
  { path: '/blog/:slug', element: <LazyWrapper><PostPage /></LazyWrapper> },
  { path: '/privacy-policy', element: <LazyWrapper><PrivacyPolicy /></LazyWrapper> },
  { path: '/refund-policy', element: <LazyWrapper><RefundPolicy /></LazyWrapper> },
  { path: '/terms-of-service', element: <LazyWrapper><TermsOfService /></LazyWrapper> },
  { path: '*', element: <LazyWrapper><NotFoundPage /></LazyWrapper> }, // Catch-all route for 404
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
)
