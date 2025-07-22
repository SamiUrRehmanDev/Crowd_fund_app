'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiUsers, 
  FiDollarSign,
  FiTarget,
  FiDownload,
  FiCalendar,
  FiBarChart,
  FiPieChart,
  FiActivity
} from 'react-icons/fi';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useAdminAuth } from '../../../components/admin/AdminAuthProvider';

const AnalyticsReports = () => {
  const { user, hasPermission } = useAdminAuth();
  const [dateRange, setDateRange] = useState('30days');
  const [reportType, setReportType] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({});

  // Mock data - replace with API calls
  useEffect(() => {
    setAnalytics({
      overview: {
        totalUsers: 15420,
        activeUsers: 8932,
        totalCampaigns: 342,
        activeCampaigns: 89,
        totalDonations: 52340,
        totalRevenue: 1250000,
        averageDonation: 85.50,
        conversionRate: 12.5,
        userGrowth: 15.3,
        revenueGrowth: 22.8,
        campaignSuccessRate: 78.5,
        monthlyActiveUsers: 6789
      },
      userMetrics: {
        newUsers: [
          { month: 'Jan', count: 120 },
          { month: 'Feb', count: 180 },
          { month: 'Mar', count: 220 },
          { month: 'Apr', count: 190 },
          { month: 'May', count: 280 },
          { month: 'Jun', count: 320 },
          { month: 'Jul', count: 180 }
        ],
        userRoles: [
          { role: 'Donors', count: 8940, percentage: 58 },
          { role: 'Donees', count: 3420, percentage: 22 },
          { role: 'Volunteers', count: 2890, percentage: 19 },
          { role: 'Admins', count: 170, percentage: 1 }
        ],
        topLocations: [
          { location: 'New York', users: 1890 },
          { location: 'California', users: 1650 },
          { location: 'Texas', users: 1230 },
          { location: 'Florida', users: 980 },
          { location: 'Illinois', users: 840 }
        ]
      },
      campaignMetrics: {
        campaignsByCategory: [
          { category: 'Medical', count: 89, amount: 450000 },
          { category: 'Education', count: 76, amount: 320000 },
          { category: 'Emergency', count: 54, amount: 280000 },
          { category: 'Community', count: 67, amount: 200000 },
          { category: 'Environment', count: 23, amount: 120000 }
        ],
        monthlyFunding: [
          { month: 'Jan', amount: 89000 },
          { month: 'Feb', amount: 125000 },
          { month: 'Mar', amount: 167000 },
          { month: 'Apr', amount: 143000 },
          { month: 'May', amount: 189000 },
          { month: 'Jun', amount: 234000 },
          { month: 'Jul', amount: 178000 }
        ],
        topCampaigns: [
          { title: 'Medical Treatment for Cancer Patient', raised: 45000, goal: 50000 },
          { title: 'Educational Support for Orphans', raised: 32000, goal: 35000 },
          { title: 'Disaster Relief Fund', raised: 89000, goal: 100000 },
          { title: 'Community Garden Project', raised: 18000, goal: 20000 },
          { title: 'Clean Water Initiative', raised: 67000, goal: 75000 }
        ]
      },
      donationMetrics: {
        donationTrends: [
          { month: 'Jan', donations: 4200, amount: 89000 },
          { month: 'Feb', donations: 5100, amount: 125000 },
          { month: 'Mar', donations: 6800, amount: 167000 },
          { month: 'Apr', donations: 5900, amount: 143000 },
          { month: 'May', donations: 7200, amount: 189000 },
          { month: 'Jun', donations: 8100, amount: 234000 },
          { month: 'Jul', donations: 6200, amount: 178000 }
        ],
        donationSizes: [
          { range: '$1-$25', count: 18900, percentage: 45 },
          { range: '$26-$100', count: 12600, percentage: 30 },
          { range: '$101-$500', count: 7560, percentage: 18 },
          { range: '$501-$1000', count: 2100, percentage: 5 },
          { range: '$1000+', count: 840, percentage: 2 }
        ],
        topDonors: [
          { name: 'Anonymous Donor', amount: 25000, donations: 15 },
          { name: 'John Smith Foundation', amount: 18000, donations: 8 },
          { name: 'Sarah Johnson', amount: 12000, donations: 24 },
          { name: 'Michael Brown', amount: 9500, donations: 18 },
          { name: 'Emily Davis', amount: 8200, donations: 12 }
        ]
      }
    });
    setLoading(false);
  }, []);

  const generateReport = () => {
    // Here you would generate and download the report
    const reportData = {
      type: reportType,
      dateRange: dateRange,
      generatedAt: new Date().toISOString(),
      data: analytics[reportType] || analytics.overview
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_report_${dateRange}.json`;
    a.click();
  };

  const getGrowthColor = (growth) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getGrowthIcon = (growth) => {
    return growth >= 0 ? <FiTrendingUp /> : <FiTrendingDown />;
  };

  if (!hasPermission('analytics_view')) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access analytics and reports.</p>
        </div>
      </AdminLayout>
    );
  }

  const overview = analytics.overview || {};
  const userMetrics = analytics.userMetrics || {};
  const campaignMetrics = analytics.campaignMetrics || {};
  const donationMetrics = analytics.donationMetrics || {};

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
            <p className="text-gray-600 mt-2">Comprehensive insights and data analysis</p>
          </div>
          <div className="flex gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="1year">Last year</option>
            </select>
            <button
              onClick={generateReport}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <FiDownload /> Download Report
            </button>
          </div>
        </div>

        {/* Report Type Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: FiBarChart },
                { id: 'userMetrics', label: 'Users', icon: FiUsers },
                { id: 'campaignMetrics', label: 'Campaigns', icon: FiTarget },
                { id: 'donationMetrics', label: 'Donations', icon: FiDollarSign }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setReportType(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      reportType === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {reportType === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-lg shadow-sm border"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{overview.totalUsers?.toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FiUsers className="text-blue-600" size={24} />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  {getGrowthIcon(overview.userGrowth)}
                  <span className={`ml-1 text-sm font-medium ${getGrowthColor(overview.userGrowth)}`}>
                    {overview.userGrowth > 0 ? '+' : ''}{overview.userGrowth}%
                  </span>
                  <span className="text-gray-600 text-sm ml-1">vs last period</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm border"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${overview.totalRevenue?.toLocaleString()}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <FiDollarSign className="text-green-600" size={24} />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  {getGrowthIcon(overview.revenueGrowth)}
                  <span className={`ml-1 text-sm font-medium ${getGrowthColor(overview.revenueGrowth)}`}>
                    {overview.revenueGrowth > 0 ? '+' : ''}{overview.revenueGrowth}%
                  </span>
                  <span className="text-gray-600 text-sm ml-1">vs last period</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-lg shadow-sm border"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                    <p className="text-2xl font-bold text-gray-900">{overview.activeCampaigns}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <FiTarget className="text-purple-600" size={24} />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-blue-600 text-sm font-medium">{overview.campaignSuccessRate}%</span>
                  <span className="text-gray-600 text-sm ml-1">success rate</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-6 rounded-lg shadow-sm border"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg. Donation</p>
                    <p className="text-2xl font-bold text-gray-900">${overview.averageDonation}</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-full">
                    <FiActivity className="text-orange-600" size={24} />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-blue-600 text-sm font-medium">{overview.conversionRate}%</span>
                  <span className="text-gray-600 text-sm ml-1">conversion rate</span>
                </div>
              </motion.div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h3>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {campaignMetrics.monthlyFunding?.map((item, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div
                        className="w-full bg-blue-500 rounded-t"
                        style={{
                          height: `${(item.amount / Math.max(...campaignMetrics.monthlyFunding.map(i => i.amount))) * 200}px`
                        }}
                      ></div>
                      <span className="text-xs text-gray-600 mt-2">{item.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
                <div className="space-y-4">
                  {userMetrics.userRoles?.map((role, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{role.role}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${role.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{role.count.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Metrics Tab */}
        {reportType === 'userMetrics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">New User Registration</h3>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {userMetrics.newUsers?.map((item, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div
                        className="w-full bg-green-500 rounded-t"
                        style={{
                          height: `${(item.count / Math.max(...userMetrics.newUsers.map(i => i.count))) * 200}px`
                        }}
                      ></div>
                      <span className="text-xs text-gray-600 mt-2">{item.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Locations</h3>
                <div className="space-y-4">
                  {userMetrics.topLocations?.map((location, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{location.location}</span>
                      <span className="text-sm text-gray-600">{location.users.toLocaleString()} users</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Campaign Metrics Tab */}
        {reportType === 'campaignMetrics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaigns by Category</h3>
                <div className="space-y-4">
                  {campaignMetrics.campaignsByCategory?.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{category.category}</span>
                        <span className="text-sm text-gray-600">{category.count} campaigns</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{
                            width: `${(category.amount / Math.max(...campaignMetrics.campaignsByCategory.map(c => c.amount))) * 100}%`
                          }}
                        ></div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-600">${category.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Campaigns</h3>
                <div className="space-y-4">
                  {campaignMetrics.topCampaigns?.map((campaign, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 truncate">{campaign.title}</span>
                        <span className="text-sm text-gray-600">{Math.round((campaign.raised / campaign.goal) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${Math.min((campaign.raised / campaign.goal) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>${campaign.raised.toLocaleString()}</span>
                        <span>${campaign.goal.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Donation Metrics Tab */}
        {reportType === 'donationMetrics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Sizes Distribution</h3>
                <div className="space-y-4">
                  {donationMetrics.donationSizes?.map((size, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{size.range}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${size.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{size.count.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Donors</h3>
                <div className="space-y-4">
                  {donationMetrics.topDonors?.map((donor, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-700">{donor.name}</div>
                        <div className="text-xs text-gray-500">{donor.donations} donations</div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">${donor.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Trends</h3>
              <div className="h-64 flex items-end justify-between space-x-2">
                {donationMetrics.donationTrends?.map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div
                      className="w-full bg-orange-500 rounded-t"
                      style={{
                        height: `${(item.amount / Math.max(...donationMetrics.donationTrends.map(i => i.amount))) * 200}px`
                      }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AnalyticsReports;
