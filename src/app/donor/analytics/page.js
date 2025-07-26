'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ChartBarIcon,
  TrophyIcon,
  CurrencyDollarIcon,
  HeartIcon,
  CalendarIcon,
  UserGroupIcon,
  GlobeAltIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export default function DonorAnalytics() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('6months');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user.role !== 'donor') {
      router.push('/auth/signin');
      return;
    }

    fetchAnalyticsData();
  }, [session, status, router, timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      // Mock analytics data
      const mockData = {
        totalDonated: 850,
        campaignsSupported: 12,
        impactScore: 287,
        peopleHelped: 45,
        monthlyDonations: [50, 75, 100, 125, 150, 200],
        categoryBreakdown: {
          'Healthcare': 350,
          'Education': 200,
          'Environment': 150,
          'Community': 100,
          'Emergency': 50
        },
        impactMetrics: {
          meals_provided: 150,
          children_educated: 25,
          trees_planted: 50,
          families_housed: 8
        },
        donationHistory: [
          { month: 'Jan', amount: 50 },
          { month: 'Feb', amount: 75 },
          { month: 'Mar', amount: 100 },
          { month: 'Apr', amount: 125 },
          { month: 'May', amount: 150 },
          { month: 'Jun', amount: 200 }
        ]
      };
      
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Simple progress bar component for donation trend
  const DonationTrendChart = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const amounts = [50, 75, 100, 125, 150, 200];
    const maxAmount = Math.max(...amounts);
    
    return (
      <div className="space-y-3">
        {months.map((month, index) => (
          <div key={month} className="flex items-center space-x-3">
            <span className="w-8 text-xs text-gray-600">{month}</span>
            <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
              <div 
                className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(amounts[index] / maxAmount) * 100}%` }}
              ></div>
              <span className="absolute right-2 top-0 text-xs text-white font-medium leading-4">
                ${amounts[index]}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Simple category breakdown component
  const CategoryBreakdown = () => {
    const categories = [
      { name: 'Healthcare', amount: 350, color: 'bg-blue-500' },
      { name: 'Education', amount: 200, color: 'bg-green-500' },
      { name: 'Environment', amount: 150, color: 'bg-yellow-500' },
      { name: 'Community', amount: 100, color: 'bg-red-500' },
      { name: 'Emergency', amount: 50, color: 'bg-purple-500' }
    ];
    const total = categories.reduce((sum, cat) => sum + cat.amount, 0);
    
    return (
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.name} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{category.name}</span>
              <span className="text-sm text-gray-600">${category.amount}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`${category.color} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${(category.amount / total) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <ChartBarIcon className="h-8 w-8 text-emerald-600" />
                <span>Impact Analytics</span>
              </h1>
              <p className="text-gray-600 mt-2">
                Track your donation impact and see the difference you're making
              </p>
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Donated</p>
                <p className="text-2xl font-bold text-emerald-600">${analyticsData?.totalDonated}</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Campaigns Supported</p>
                <p className="text-2xl font-bold text-blue-600">{analyticsData?.campaignsSupported}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <HeartIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Impact Score</p>
                <p className="text-2xl font-bold text-purple-600">{analyticsData?.impactScore}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrophyIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">People Helped</p>
                <p className="text-2xl font-bold text-orange-600">{analyticsData?.peopleHelped}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Donation Trend */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              <span>Monthly Donation Trend</span>
            </h3>
            <DonationTrendChart />
          </motion.div>

          {/* Category Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <GlobeAltIcon className="h-5 w-5 text-emerald-600" />
              <span>Donation by Category</span>
            </h3>
            <CategoryBreakdown />
          </motion.div>
        </div>

        {/* Impact Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
            <SparklesIcon className="h-5 w-5 text-yellow-600" />
            <span>Real Impact Created</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600 mb-2">
                {analyticsData?.impactMetrics.meals_provided}
              </p>
              <p className="text-sm text-green-700">Meals Provided</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600 mb-2">
                {analyticsData?.impactMetrics.children_educated}
              </p>
              <p className="text-sm text-blue-700">Children Educated</p>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <p className="text-3xl font-bold text-emerald-600 mb-2">
                {analyticsData?.impactMetrics.trees_planted}
              </p>
              <p className="text-sm text-emerald-700">Trees Planted</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600 mb-2">
                {analyticsData?.impactMetrics.families_housed}
              </p>
              <p className="text-sm text-purple-700">Families Housed</p>
            </div>
          </div>
        </motion.div>

        {/* Achievement Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
            <TrophyIcon className="h-5 w-5 text-yellow-600" />
            <span>Achievement Badges</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <TrophyIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="font-semibold text-yellow-900">First Donation</p>
                <p className="text-sm text-yellow-700">Started your giving journey</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <HeartIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-blue-900">Generous Heart</p>
                <p className="text-sm text-blue-700">Supported 10+ campaigns</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <SparklesIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-green-900">Impact Maker</p>
                <p className="text-sm text-green-700">Created real change</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <Link
            href="/donor"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
