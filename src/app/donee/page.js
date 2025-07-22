'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  PlusIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  BanknotesIcon,
  HeartIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ArrowTrendingUpIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleSolidIcon,
  ExclamationTriangleIcon as ExclamationTriangleSolidIcon,
  ClockIcon as ClockSolidIcon
} from '@heroicons/react/24/solid';

const statusConfig = {
  pending: { color: 'yellow', icon: ClockSolidIcon, label: 'Under Review' },
  approved: { color: 'blue', icon: CheckCircleSolidIcon, label: 'Approved & Live' },
  rejected: { color: 'red', icon: ExclamationTriangleSolidIcon, label: 'Needs Revision' },
  live: { color: 'green', icon: HeartIcon, label: 'Receiving Donations' },
  completed: { color: 'purple', icon: CheckCircleSolidIcon, label: 'Goal Reached' }
};

const urgencyLevels = {
  low: { color: 'green', label: 'Standard' },
  medium: { color: 'yellow', label: 'Moderate' },
  high: { color: 'orange', label: 'High Priority' },
  urgent: { color: 'red', label: 'Emergency' }
};

const categoryIcons = {
  medical: HeartIcon,
  education: DocumentTextIcon,
  housing: UserGroupIcon,
  emergency: ExclamationTriangleIcon,
  business: BanknotesIcon,
  family: UserGroupIcon
};

export default function DoneeDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    activeRequests: [],
    recentActivity: [],
    notifications: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/donee/dashboard');
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const config = statusConfig[status];
    return config ? config.icon : ClockIcon;
  };

  const getStatusColor = (status) => {
    const config = statusConfig[status];
    return config ? config.color : 'gray';
  };

  const getUrgencyColor = (urgency) => {
    const config = urgencyLevels[urgency];
    return config ? config.color : 'gray';
  };

  const getCategoryIcon = (category) => {
    return categoryIcons[category] || DocumentTextIcon;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateProgress = (raised, goal) => {
    return Math.min((raised / goal) * 100, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Aid Request Dashboard</h1>
              <p className="text-gray-600 mt-2">Track your aid requests and receive support with dignity</p>
            </div>
            <Link
              href="/donee/requests/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Submit New Request
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Requests</p>
                <p className="text-2xl font-semibold text-gray-900">{dashboardData.stats.totalRequests || 0}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <BanknotesIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Raised</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(dashboardData.stats.totalRaised || 0)}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ArrowTrendingUpIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Campaigns</p>
                <p className="text-2xl font-semibold text-gray-900">{dashboardData.stats.activeCampaigns || 0}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <HeartIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Supporters</p>
                <p className="text-2xl font-semibold text-gray-900">{dashboardData.stats.totalSupporters || 0}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Requests */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Your Aid Requests</h2>
                  <Link
                    href="/donee/requests"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All
                  </Link>
                </div>
              </div>
              
              <div className="p-6">
                {dashboardData.activeRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No active requests</h3>
                    <p className="text-gray-500 mb-4">Submit your first aid request to get started</p>
                    <Link
                      href="/donee/requests/new"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Submit Request
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.activeRequests.map((request, index) => {
                      const StatusIcon = getStatusIcon(request.status);
                      const CategoryIcon = getCategoryIcon(request.category);
                      const progress = calculateProgress(request.raisedAmount, request.goalAmount);
                      
                      return (
                        <motion.div
                          key={request.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-lg bg-gray-100`}>
                                <CategoryIcon className="w-5 h-5 text-gray-600" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">{request.title}</h3>
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{request.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getStatusColor(request.status)}-100 text-${getStatusColor(request.status)}-800`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusConfig[request.status]?.label}
                              </span>
                              {request.urgency && (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getUrgencyColor(request.urgency)}-100 text-${getUrgencyColor(request.urgency)}-800`}>
                                  {urgencyLevels[request.urgency]?.label}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Progress Bar */}
                          {request.status === 'live' || request.status === 'completed' ? (
                            <div className="mb-3">
                              <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Progress</span>
                                <span>{formatCurrency(request.raisedAmount)} of {formatCurrency(request.goalAmount)}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                                  }`}
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{Math.round(progress)}% funded</p>
                            </div>
                          ) : (
                            <div className="mb-3">
                              <div className="flex justify-between text-sm text-gray-600">
                                <span>Goal Amount</span>
                                <span className="font-medium">{formatCurrency(request.goalAmount)}</span>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-500">
                              <CalendarDaysIcon className="w-4 h-4 mr-1" />
                              Submitted {new Date(request.submittedDate).toLocaleDateString()}
                            </div>
                            <div className="flex space-x-2">
                              <Link
                                href={`/donee/requests/${request.id}`}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                              >
                                <EyeIcon className="w-4 h-4 mr-1" />
                                View
                              </Link>
                              {request.status === 'pending' && (
                                <Link
                                  href={`/donee/requests/${request.id}/edit`}
                                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                  <PencilIcon className="w-4 h-4 mr-1" />
                                  Edit
                                </Link>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-6">
                {dashboardData.recentActivity.length === 0 ? (
                  <p className="text-gray-500 text-sm">No recent activity</p>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.recentActivity.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3"
                      >
                        <div className={`p-1 rounded-full bg-${activity.type === 'donation' ? 'green' : activity.type === 'status' ? 'blue' : 'gray'}-100`}>
                          {activity.type === 'donation' ? (
                            <BanknotesIcon className="w-4 h-4 text-green-600" />
                          ) : activity.type === 'status' ? (
                            <CheckCircleIcon className="w-4 h-4 text-blue-600" />
                          ) : (
                            <ClockIcon className="w-4 h-4 text-gray-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{activity.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.details}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-3">
                <Link
                  href="/donee/requests/new"
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  New Aid Request
                </Link>
                <Link
                  href="/donee/requests"
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <DocumentTextIcon className="w-4 h-4 mr-2" />
                  View All Requests
                </Link>
                <Link
                  href="/donee/profile"
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                  Download Records
                </Link>
                <Link
                  href="/donee/support"
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <HeartIcon className="w-4 h-4 mr-2" />
                  Contact Support
                </Link>
              </div>
            </div>

            {/* Notifications */}
            {dashboardData.notifications.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Notifications</h2>
                </div>
                <div className="p-6 space-y-3">
                  {dashboardData.notifications.slice(0, 3).map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <p className="text-sm font-medium text-blue-900">{notification.title}</p>
                      <p className="text-xs text-blue-700 mt-1">{notification.message}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
