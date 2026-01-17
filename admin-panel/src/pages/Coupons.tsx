import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Search, Edit, Trash2, TrendingUp, Users, DollarSign, Percent } from 'lucide-react';
import { couponsApi, coursesApi } from '../lib/api';

interface Coupon {
  _id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  courseIds: string[];
  isActive: boolean;
  expiryDate?: string;
  usageLimit?: number;
  usedCount: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isExpired: boolean;
  isUsageLimitReached: boolean;
  remainingUses?: number;
}

interface CouponFormData {
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  courseIds: string[];
  isActive: boolean;
  expiryDate: string;
  usageLimit: string;
  minPurchaseAmount: string;
  maxDiscountAmount: string;
  description: string;
}

interface FormErrors {
  code?: string;
  discountValue?: string;
  courseId?: string;
}

interface Course {
  _id: string;
  id: string;
  title: string;
  category: string;
}

export default function Coupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [courseSearchTerm, setCourseSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const [formData, setFormData] = useState<CouponFormData>({
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    courseIds: [],
    isActive: true,
    expiryDate: '',
    usageLimit: '',
    minPurchaseAmount: '',
    maxDiscountAmount: '',
    description: ''
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    loadCoupons();
    loadAnalytics();
    loadCourses();
  }, [pagination.page, searchTerm, filterStatus, filterType]);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(searchTerm && { search: searchTerm }),
        ...(filterStatus !== 'all' && { isActive: filterStatus === 'active' }),
        ...(filterType !== 'all' && { discountType: filterType })
      };

      const response = await couponsApi.getAll(params);

      if (response.success) {
        setCoupons((response as any).coupons || []);
        setPagination(prev => ({
          ...prev,
          total: (response as any).pagination?.total || 0,
          totalPages: (response as any).pagination?.totalPages || 0
        }));
      }
    } catch (error) {
      console.error('Error loading coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await couponsApi.getAnalytics();
      if (response.success) {
        setAnalytics((response as any).analytics);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const loadCourses = async () => {
    try {
      const response = await coursesApi.getAll();
      if (response.success) {
        setCourses((response as any).data || []);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.code.trim()) errors.code = 'Coupon code is required';
    if (!formData.discountValue || formData.discountValue <= 0) errors.discountValue = 'Discount value must be greater than 0';
    if (formData.discountType === 'percentage' && formData.discountValue > 100) {
      errors.discountValue = 'Percentage cannot exceed 100%';
    }
    if (!formData.courseIds.length) errors.courseId = 'At least one course must be selected';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const payload = {
        ...formData,
        discountValue: Number(formData.discountValue),
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
        minPurchaseAmount: formData.minPurchaseAmount ? Number(formData.minPurchaseAmount) : undefined,
        maxDiscountAmount: formData.maxDiscountAmount ? Number(formData.maxDiscountAmount) : undefined,
        expiryDate: formData.expiryDate || undefined
      };

      let response;
      if (editingCoupon) {
        response = await couponsApi.update(editingCoupon._id, payload);
      } else {
        response = await couponsApi.create(payload);
      }

      if (response.success) {
        loadCoupons();
        resetForm();
        toast.success(`Coupon ${editingCoupon ? 'updated' : 'created'} successfully!`);
      } else {
        toast.error((response as any).error || 'Failed to save coupon');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save coupon');
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      courseIds: coupon.courseIds || [],
      isActive: coupon.isActive,
      expiryDate: coupon.expiryDate ? coupon.expiryDate.split('T')[0] : '',
      usageLimit: coupon.usageLimit?.toString() || '',
      minPurchaseAmount: coupon.minPurchaseAmount?.toString() || '',
      maxDiscountAmount: coupon.maxDiscountAmount?.toString() || '',
      description: coupon.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (coupon: Coupon) => {
    if (coupon.usedCount > 0){
      toast.error('This coupon has been used and cannot be deleted. Consider deactivating it instead.');
      return;
    }
    try {
      const response = await couponsApi.delete(coupon._id);
      if (response.success) {
        loadCoupons();
        toast.success('Coupon deleted successfully!');
      } else {
        toast.error((response as any).error || 'Failed to delete coupon');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete coupon');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: 0,
      courseIds: [],
      isActive: true,
      expiryDate: '',
      usageLimit: '',
      minPurchaseAmount: '',
      maxDiscountAmount: '',
      description: ''
    });
    setFormErrors({});
    setEditingCoupon(null);
    setShowForm(false);
    setCourseSearchTerm('');
  };

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, code: result }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Coupon Management</h1>
          <p className="text-gray-600">Manage discount coupons and promotional codes</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Coupon
        </button>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Coupons</h3>
                <p className="text-2xl font-bold text-blue-600">{analytics.totalCoupons}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Active Coupons</h3>
                <p className="text-2xl font-bold text-green-600">{analytics.activeCoupons}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Redemptions</h3>
                <p className="text-2xl font-bold text-orange-600">{analytics.totalRedemptions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Percent className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Usage Rate</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {analytics.totalCoupons > 0 ? Math.round((analytics.totalRedemptions / analytics.totalCoupons) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search coupons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="percentage">Percentage</option>
            <option value="flat">Flat Amount</option>
          </select>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Courses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiry
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Loading coupons...
                  </td>
                </tr>
              ) : filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No coupons found
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{coupon.code}</div>
                        {coupon.description && (
                          <div className="text-sm text-gray-500">{coupon.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}%`
                          : formatCurrency(coupon.discountValue)
                        }
                      </div>
                      <div className="text-sm text-gray-500 capitalize">{coupon.discountType}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs">
                        {coupon.courseIds.length === 0 ? (
                          <span className="text-gray-400">No courses</span>
                        ) : coupon.courseIds.length <= 2 ? (
                          <div className="space-y-1">
                            {coupon.courseIds.map(courseId => {
                              const course = courses.find(c => c.id === courseId);
                              return (
                                <div key={courseId} className="text-gray-900">
                                  {course?.title || courseId}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="text-gray-900">
                              {courses.find(c => c.id === coupon.courseIds[0])?.title || coupon.courseIds[0]}
                            </div>
                            <div className="text-gray-900">
                              {courses.find(c => c.id === coupon.courseIds[1])?.title || coupon.courseIds[1]}
                            </div>
                            <div className="text-blue-600 text-xs">
                              +{coupon.courseIds.length - 2} more courses
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {coupon.usedCount} / {coupon.usageLimit || '∞'}
                      </div>
                      {coupon.remainingUses !== null && (
                        <div className="text-sm text-gray-500">
                          {coupon.remainingUses} remaining
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${!coupon.isActive
                          ? 'bg-gray-100 text-gray-800'
                          : coupon.isExpired
                            ? 'bg-red-100 text-red-800'
                            : coupon.isUsageLimitReached
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-green-100 text-green-800'
                        }`}>
                        {!coupon.isActive
                          ? 'Inactive'
                          : coupon.isExpired
                            ? 'Expired'
                            : coupon.isUsageLimitReached
                              ? 'Limit Reached'
                              : 'Active'
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {coupon.expiryDate ? formatDate(coupon.expiryDate) : 'No expiry'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Coupon Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coupon Code *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter coupon code"
                      required
                    />
                    <button
                      type="button"
                      onClick={generateCouponCode}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      Generate
                    </button>
                  </div>
                  {formErrors.code && <p className="text-red-500 text-sm mt-1">{formErrors.code}</p>}
                </div>

                {/* Discount Type and Value */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Type *
                    </label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData(prev => ({ ...prev, discountType: e.target.value as 'percentage' | 'flat' }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="flat">Flat Amount (£)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Value *
                    </label>
                    <input
                      type="number"
                      value={formData.discountValue}
                      onChange={(e) => setFormData(prev => ({ ...prev, discountValue: Number(e.target.value) }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={formData.discountType === 'percentage' ? 'e.g., 20' : 'e.g., 50'}
                      min="0"
                      max={formData.discountType === 'percentage' ? 100 : undefined}
                      required
                    />
                    {formErrors.discountValue && <p className="text-red-500 text-sm mt-1">{formErrors.discountValue}</p>}
                  </div>
                </div>

                {/* Course Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Courses *
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Select courses (multiple selection allowed):
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, courseIds: courses.map(c => c.id) }))}
                          className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                          Select All
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, courseIds: [] }))}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>

                    {/* Selected Courses Summary */}
                    {formData.courseIds.length > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="text-sm font-medium text-blue-800 mb-2">
                          Selected ({formData.courseIds.length}):
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {formData.courseIds.map(courseId => {
                            const course = courses.find(c => c.id === courseId);
                            return course ? (
                              <span
                                key={courseId}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                              >
                                {course.title}
                                <button
                                  type="button"
                                  onClick={() => setFormData(prev => ({
                                    ...prev,
                                    courseIds: prev.courseIds.filter(id => id !== courseId)
                                  }))}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  ×
                                </button>
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {/* Course Dropdown */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search and select courses..."
                        value={courseSearchTerm}
                        onChange={(e) => setCourseSearchTerm(e.target.value)}
                        onFocus={() => setCourseSearchTerm('')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      
                      {/* Dropdown Menu */}
                      {courseSearchTerm !== '' && (
                        <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          <div className="p-2 space-y-1">
                            {(() => {
                              const filteredCourses = courses.filter(course =>
                                course.title.toLowerCase().includes(courseSearchTerm.toLowerCase()) ||
                                course.category.toLowerCase().includes(courseSearchTerm.toLowerCase())
                              );

                              if (filteredCourses.length === 0) {
                                return (
                                  <div className="text-sm text-gray-500 text-center py-4">
                                    No courses found matching your search
                                  </div>
                                );
                              }

                              return filteredCourses.map((course) => (
                                <button
                                  key={course._id}
                                  type="button"
                                  onClick={() => {
                                    if (!formData.courseIds.includes(course.id)) {
                                      setFormData(prev => ({
                                        ...prev,
                                        courseIds: [...prev.courseIds, course.id]
                                      }));
                                    }
                                    setCourseSearchTerm('');
                                  }}
                                  disabled={formData.courseIds.includes(course.id)}
                                  className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed ${
                                    formData.courseIds.includes(course.id) ? 'bg-gray-100' : ''
                                  }`}
                                >
                                  <div className="font-medium text-gray-900">{course.title}</div>
                                  <div className="text-xs text-gray-500">{course.category}</div>
                                </button>
                              ));
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {formErrors.courseId && <p className="text-red-500 text-sm mt-1">{formErrors.courseId}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Optional description for the coupon"
                    rows={3}
                  />
                </div>

                {/* Advanced Options */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Usage Limit
                    </label>
                    <input
                      type="number"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Unlimited"
                      min="1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Purchase Amount (£)
                    </label>
                    <input
                      type="number"
                      value={formData.minPurchaseAmount}
                      onChange={(e) => setFormData(prev => ({ ...prev, minPurchaseAmount: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="No minimum"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Discount Amount (£)
                    </label>
                    <input
                      type="number"
                      value={formData.maxDiscountAmount}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxDiscountAmount: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="No maximum"
                      min="0"
                    />
                  </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Active (coupon can be used)
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
