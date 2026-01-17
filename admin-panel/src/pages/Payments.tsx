import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { paymentsApi } from '../lib/api';
import { 
  CreditCard, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Eye,
  Download
} from 'lucide-react';

interface PaymentStats {
  totalRevenue: number;
  periodRevenue: number;
  totalTransactions: number;
  periodTransactions: number;
  courseStats: Array<{
    _id: string;
    courseName: string;
    totalRevenue: number;
    totalEnrollments: number;
  }>;
  dailyRevenue: Array<{
    _id: string;
    revenue: number;
    transactions: number;
  }>;
  period: number;
}

interface PaymentTransaction {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  courseInfo: {
    courseId: string;
    courseName: string;
    category: string;
  };
  paymentDate: string;
  createdAt: string;
}

const Payments: React.FC = () => {
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'stats' | 'transactions'>('stats');
  const [selectedPeriod, setSelectedPeriod] = useState(30);

  useEffect(() => {
    fetchPaymentStats();
    fetchTransactions();
  }, [selectedPeriod]);

  const fetchPaymentStats = async () => {
    try {
      setLoading(true);
      const response = await paymentsApi.getStats(selectedPeriod);
      if (response.success) {
        setStats((response as any).stats);
      } else {
        throw new Error((response as any).error || 'Failed to fetch payment statistics');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch payment statistics');
      console.error('Error fetching payment stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await paymentsApi.getTransactions({ limit: 50 });
      if (response.success) {
        setTransactions((response as any).transactions || []);
      } else {
        throw new Error((response as any).error || 'Failed to fetch transactions');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch transactions');
      console.error('Error fetching transactions:', error);
    }
  };

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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCSV = () => {
    if (!transactions.length) {
      toast.error('No data to export');
      return;
    }

    // Create CSV headers
    const headers = [
      'Transaction ID',
      'Order ID',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Course Name',
      'Course Category',
      'Amount',
      'Currency',
      'Payment Method',
      'Status',
      'Payment Date',
      'Created At'
    ];

    // Create CSV rows
    const csvRows = [
      headers.join(','),
      ...transactions.map(transaction => [
        transaction.id,
        transaction.orderId,
        `"${transaction.customerInfo.name}"`,
        transaction.customerInfo.email,
        transaction.customerInfo.phone,
        `"${transaction.courseInfo.courseName}"`,
        transaction.courseInfo.category,
        transaction.amount,
        transaction.currency,
        transaction.method,
        transaction.status,
        transaction.paymentDate,
        transaction.createdAt
      ].join(','))
    ];

    // Create and download CSV file
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `payment-transactions-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Analytics</h1>
          <p className="mt-2 text-sm text-gray-700">
            Monitor revenue, transactions, and payment performance
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
          <button 
            onClick={exportToCSV}
            className="btn btn-secondary"
            disabled={!transactions.length}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'stats'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('stats')}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Analytics
          </button>
          <button
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'transactions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('transactions')}
          >
            <CreditCard className="w-4 h-4 inline mr-2" />
            Transactions
          </button>
        </div>
      </div>

      {/* Stats Tab */}
      {activeTab === 'stats' && stats && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card">
              <div className="card-body">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatCurrency(stats.totalRevenue)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Revenue (Last {stats.period} days)
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatCurrency(stats.periodRevenue)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CreditCard className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Transactions</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats.totalTransactions.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Transactions (Last {stats.period} days)
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats.periodTransactions.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Course Performance */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium">Top Performing Courses</h3>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  {stats.courseStats.slice(0, 5).map((course, index) => (
                    <div key={course._id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{course.courseName}</p>
                          <p className="text-sm text-gray-500">{course.totalEnrollments} enrollments</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(course.totalRevenue)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Daily Revenue Chart */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium">Daily Revenue (Last {stats.period} days)</h3>
              </div>
              <div className="card-body">
                <div className="space-y-2">
                  {stats.dailyRevenue.slice(-7).map((day) => (
                    <div key={day._id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                                                  {new Date(day._id).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                        </p>
                        <p className="text-xs text-gray-500">{day.transactions} transactions</p>
                      </div>
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(day.revenue)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium">Recent Transactions</h3>
          </div>
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{transaction.id}</p>
                          <p className="text-sm text-gray-500">{transaction.method}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{transaction.customerInfo.name}</p>
                          <p className="text-sm text-gray-500">{transaction.customerInfo.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{transaction.courseInfo.courseName}</p>
                          <p className="text-sm text-gray-500">{transaction.courseInfo.category}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-sm text-gray-500">{transaction.currency}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          transaction.status === 'success' 
                            ? 'bg-green-100 text-green-800'
                            : transaction.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(transaction.paymentDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
