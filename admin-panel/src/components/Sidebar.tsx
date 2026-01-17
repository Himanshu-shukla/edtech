import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Building2,
  TrendingUp,
  Sparkles,
  BarChart3,
  Calendar,
  HelpCircle,
  Star,
  MessageSquare,
  CreditCard,
  Ticket,
  UserCheck
} from 'lucide-react';
import Logo from './Logo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'User Management', href: '/user-management', icon: UserCheck },
    { name: 'Courses', href: '/courses', icon: BookOpen },
    { name: 'Payments', href: '/payments', icon: CreditCard },
    { name: 'Coupons', href: '/coupons', icon: Ticket },
    { name: 'Blog Posts', href: '/blogs', icon: BookOpen },
    { name: 'Team Members', href: '/team-members', icon: Users },
    { name: 'Mentors', href: '/mentors', icon: Users },
    { name: 'Mentor Features', href: '/mentor-features', icon: Star },
    { name: 'Company Logos', href: '/company-logos', icon: Building2 },
    { name: 'Advantage Stats', href: '/advantage-stats', icon: TrendingUp },
    { name: 'Testimonials', href: '/testimonials', icon: MessageSquare },
    { name: 'Trustpilot Reviews', href: '/trustpilot-reviews', icon: Star },
    { name: 'Success Stats', href: '/success-stats', icon: TrendingUp },
    { name: 'FAQs', href: '/faqs', icon: HelpCircle },
    { name: 'Company Info', href: '/company-info', icon: Building2 },
    { name: 'Upcoming Skills', href: '/upcoming-skills', icon: TrendingUp },
    { name: 'Values', href: '/values', icon: Sparkles },
    { name: 'Statistics', href: '/stats', icon: BarChart3 },
    { name: 'Milestones', href: '/milestones', icon: Calendar },
    { name: 'Users', href: '/users', icon: Users },
  ];

  return (
    <div
      className={`sidebar ${isOpen ? 'open' : ''}`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="sidebar-header">
          <div className="flex items-center gap-3">
            <Logo size={40} />
            <div>
              <h1 className="text-lg font-bold text-gray-900">EdTech Admin</h1>
              <p className="text-xs text-gray-500">Management Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav flex-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
                onClick={() => {
                  // Close mobile sidebar when navigating
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            <p className="font-medium">EdTech Admin Panel</p>
            <p className="mt-1">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
