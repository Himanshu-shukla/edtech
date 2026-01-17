import React, { useState, useEffect } from 'react';
import { adminApi } from '../lib/api';
import type { DashboardStats } from '../types';
import {
  BookOpen,
  GraduationCap,
  DollarSign,
  FileText,
  Users,
  TrendingUp,
  Activity,
  BarChart3
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getDashboardStats();
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch dashboard statistics');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatGrowth = (growth: number) => {
    if (growth === 0) return 'No change';
    const sign = growth > 0 ? '+' : '';
    return `${sign}${growth.toFixed(1)}%`;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const primaryStatCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.totalRevenue || 0),
      icon: DollarSign,
      color: 'from-emerald-500 to-emerald-600',
      growth: stats?.revenueGrowth || 0,
      subtitle: `${formatCurrency(stats?.monthlyRevenue || 0)} this month`
    },
    {
      title: 'Total Customers',
      value: (stats?.totalCustomers || 0).toLocaleString(),
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      growth: stats?.customerGrowth || 0,
      subtitle: `${stats?.newCustomers || 0} new this month`
    },
    {
      title: 'Avg Order Value',
      value: formatCurrency(stats?.averageOrderValue || 0),
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      growth: 0, // Could add AOV growth calculation later
      subtitle: `From ${stats?.totalCustomers || 0} orders`
    },
    {
      title: 'Conversion Rate',
      value: `${(stats?.conversionRate || 0).toFixed(1)}%`,
      icon: BarChart3,
      color: 'from-orange-500 to-orange-600',
      growth: stats?.inquiryGrowth || 0,
      subtitle: `${stats?.convertedInquiries || 0} of ${stats?.totalInquiries || 0} inquiries`
    }
  ];

  const secondaryStatCards = [
    {
      title: 'Paid Customers',
      value: (stats?.paidCustomers || 0).toLocaleString(),
      icon: DollarSign,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Pending Customers',
      value: (stats?.pendingCustomers || 0).toLocaleString(),
      icon: Activity,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      title: 'Total Courses',
      value: (stats?.courses || 0).toLocaleString(),
      icon: BookOpen,
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      title: 'Blog Posts',
      value: (stats?.blogs || 0).toLocaleString(),
      icon: FileText,
      color: 'from-pink-500 to-pink-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="flex items-start">
            <Activity className="h-5 w-5 text-red-500 mt-1" />
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-900">Error Loading Dashboard</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                onClick={fetchStats}
                className="mt-3 btn btn-primary btn-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-gray-600 mt-2">
                Manage your EdTech platform content, users, and analytics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-gray-500">Last updated</p>
                <p className="text-sm font-medium">
                  {stats ? new Date(stats.lastUpdated).toLocaleString() : 'Just now'}
                </p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Business Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {primaryStatCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
                  {card.growth !== undefined && (
                    <div className={`text-sm font-medium ${getGrowthColor(card.growth)} flex items-center gap-1`}>
                      <TrendingUp className="w-3 h-3" />
                      <span>{formatGrowth(card.growth)} vs last month</span>
                    </div>
                  )}
                  {card.subtitle && (
                    <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
                  )}
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {secondaryStatCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className="text-xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`w-10 h-10 bg-gradient-to-br ${card.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Top Courses Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Courses</h3>
            <p className="text-sm text-gray-500">Highest revenue generating courses</p>
          </div>
          <GraduationCap className="w-6 h-6 text-gray-400" />
        </div>
        
        {stats?.topCourses && stats.topCourses.length > 0 ? (
          <div className="space-y-4">
            {stats.topCourses.map((course, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">#{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{course.courseName}</h4>
                    <p className="text-sm text-gray-500">{course.enrollments} enrollments</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(course.revenue)}</p>
                  <p className="text-sm text-gray-500">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No course performance data available</p>
          </div>
        )}
      </div>

      {/* Quick Actions & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <p className="text-sm text-gray-500">Frequently used management tasks</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a href="/user-management" className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Users className="w-4 h-4" />
              <span>Manage Users</span>
            </a>
            <a href="/payments" className="flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              <DollarSign className="w-4 h-4" />
              <span>View Payments</span>
            </a>
            <a href="/courses" className="flex items-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              <BookOpen className="w-4 h-4" />
              <span>Add Course</span>
            </a>
            <a href="/blogs" className="flex items-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              <FileText className="w-4 h-4" />
              <span>New Blog</span>
            </a>
          </div>
        </div>

        {/* Business Insights */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Business Insights</h3>
            <p className="text-sm text-gray-500">Key performance indicators</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Revenue Growth</span>
              </div>
              <span className={`text-sm font-semibold ${getGrowthColor(stats?.revenueGrowth || 0)}`}>
                {formatGrowth(stats?.revenueGrowth || 0)}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Customer Growth</span>
              </div>
              <span className={`text-sm font-semibold ${getGrowthColor(stats?.customerGrowth || 0)}`}>
                {formatGrowth(stats?.customerGrowth || 0)}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Inquiry Growth</span>
              </div>
              <span className={`text-sm font-semibold ${getGrowthColor(stats?.inquiryGrowth || 0)}`}>
                {formatGrowth(stats?.inquiryGrowth || 0)}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Platform Status</span>
              </div>
              <span className="text-sm font-semibold text-green-600">Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
