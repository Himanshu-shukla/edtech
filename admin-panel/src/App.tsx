import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Courses from './pages/Courses';
import Payments from './pages/Payments';
import Coupons from './pages/Coupons';
import BlogsList from './pages/Blogs';
import TeamMembersList from './pages/TeamMembers';
import UsersList from './pages/Users';
import FAQs from './pages/FAQs';
import Mentors from './pages/Mentors';
import MentorFeatures from './pages/MentorFeatures';
import CompanyLogos from './pages/CompanyLogos';
import AdvantageStats from './pages/AdvantageStats';
import Testimonials from './pages/Testimonials';
import TrustpilotReviews from './pages/TrustpilotReviews';
import CompanyInfo from './pages/CompanyInfo';
import Statistics from './pages/Statistics';
import Values from './pages/Values';
import Milestones from './pages/Milestones';
import UpcomingSkills from './pages/UpcomingSkills';
import SuccessStats from './pages/SuccessStats';
import UserManagement from './pages/UserManagement';
import './index.css';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route Component (redirect if authenticated)
interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

// App Routes Component
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />

      {/* Protected routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="courses" element={<Courses />} />
                    <Route path="payments" element={<Payments />} />
            <Route path="coupons" element={<Coupons />} />
        <Route path="user-management" element={<UserManagement />} />
        <Route path="blogs" element={<BlogsList />} />
        <Route path="team-members" element={<TeamMembersList />} />
        <Route path="users" element={<UsersList />} />
        <Route path="faqs" element={<FAQs />} />
        <Route path="mentors" element={<Mentors />} />
        <Route path="mentor-features" element={<MentorFeatures />} />
        <Route path="company-logos" element={<CompanyLogos />} />
        <Route path="advantage-stats" element={<AdvantageStats />} />
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="trustpilot-reviews" element={<TrustpilotReviews />} />
        <Route path="success-stats" element={<SuccessStats />} />
        
        {/* Additional management pages */}
        <Route path="company-info" element={<CompanyInfo />} />
        <Route path="upcoming-skills" element={<UpcomingSkills />} />
        <Route path="values" element={<Values />} />
        <Route path="stats" element={<Statistics />} />
        <Route path="milestones" element={<Milestones />} />

      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
};

export default App;