'use client';

import { useState, useEffect } from 'react';

interface AnalyticsData {
  salesMetrics: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    revenueGrowth: number;
  };
  topProducts: Array<{
    id: number;
    name: string;
    category: string;
    sold: number;
    revenue: number;
  }>;
  categoryPerformance: Array<{
    category: string;
    orders: number;
    revenue: number;
    percentage: number;
  }>;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  userMetrics: {
    totalUsers: number;
    newUsersThisMonth: number;
    activeUsers: number;
    userGrowth: number;
  };
}

export default function AdminAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // days

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setAnalyticsData({
          salesMetrics: {
            totalRevenue: 45750.00,
            totalOrders: 156,
            averageOrderValue: 293.27,
            revenueGrowth: 12.5,
          },
          topProducts: [
            {
              id: 1,
              name: 'Premium Wireless Headphones',
              category: 'Electronics',
              sold: 45,
              revenue: 13495.55,
            },
            {
              id: 2,
              name: 'Smart Fitness Watch',
              category: 'Electronics',
              sold: 32,
              revenue: 6397.68,
            },
            {
              id: 3,
              name: 'Professional Coffee Maker',
              category: 'Kitchen',
              sold: 28,
              revenue: 11199.72,
            },
            {
              id: 4,
              name: 'Bluetooth Speaker',
              category: 'Electronics',
              sold: 25,
              revenue: 4999.75,
            },
            {
              id: 5,
              name: 'Yoga Mat Set',
              category: 'Sports',
              sold: 22,
              revenue: 2197.78,
            },
          ],
          categoryPerformance: [
            { category: 'Electronics', orders: 68, revenue: 25892.98, percentage: 56.6 },
            { category: 'Kitchen', orders: 35, revenue: 13999.65, percentage: 30.6 },
            { category: 'Sports', orders: 28, revenue: 3499.72, percentage: 7.6 },
            { category: 'Books', orders: 15, revenue: 1499.85, percentage: 3.3 },
            { category: 'Beauty', orders: 10, revenue: 857.80, percentage: 1.9 },
          ],
          monthlyRevenue: [
            { month: 'Aug', revenue: 35200, orders: 120 },
            { month: 'Sep', revenue: 42800, orders: 145 },
            { month: 'Oct', revenue: 38900, orders: 132 },
            { month: 'Nov', revenue: 45750, orders: 156 },
            { month: 'Dec', revenue: 52100, orders: 178 },
          ],
          userMetrics: {
            totalUsers: 1247,
            newUsersThisMonth: 89,
            activeUsers: 456,
            userGrowth: 8.3,
          },
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return <div>Error loading analytics data</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your store's performance and insights</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Sales Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">${analyticsData.salesMetrics.totalRevenue.toFixed(2)}</p>
              <p className="text-sm text-green-600">+{analyticsData.salesMetrics.revenueGrowth}% from last period</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.salesMetrics.totalOrders}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Order Value</p>
              <p className="text-3xl font-bold text-gray-900">${analyticsData.salesMetrics.averageOrderValue.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.userMetrics.totalUsers}</p>
              <p className="text-sm text-green-600">+{analyticsData.userMetrics.userGrowth}% growth</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <div className="space-y-4">
            {analyticsData.monthlyRevenue.map((data, index) => (
              <div key={data.month} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-sm font-medium text-gray-900">{data.month}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">{data.orders} orders</div>
                  <div className="text-sm font-medium text-gray-900">${data.revenue.toLocaleString()}</div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(data.revenue / 60000) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
          <div className="space-y-4">
            {analyticsData.categoryPerformance.map((category, index) => (
              <div key={category.category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-sm font-medium text-gray-900">{category.category}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">{category.orders} orders</div>
                  <div className="text-sm font-medium text-gray-900">${category.revenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">{category.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Products</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Units Sold</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Performance</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.topProducts.map((product, index) => (
                <tr key={product.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-medium text-gray-600">
                        #{index + 1}
                      </div>
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">{product.sold}</td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">${product.revenue.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(product.revenue / 15000) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">New Users</span>
              <span className="text-sm font-medium text-gray-900">{analyticsData.userMetrics.newUsersThisMonth}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Active Users</span>
              <span className="text-sm font-medium text-gray-900">{analyticsData.userMetrics.activeUsers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Growth Rate</span>
              <span className="text-sm font-medium text-green-600">+{analyticsData.userMetrics.userGrowth}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Conversion Rate</span>
              <span className="text-sm font-medium text-gray-900">3.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Return Rate</span>
              <span className="text-sm font-medium text-gray-900">2.1%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg. Session</span>
              <span className="text-sm font-medium text-gray-900">4m 32s</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Alerts</h3>
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-red-600">3 products low in stock</div>
            <div className="text-sm text-yellow-600">8 orders pending review</div>
            <div className="text-sm text-green-600">All systems operational</div>
          </div>
        </div>
      </div>
    </div>
  );
}