'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  MapPinIcon,
  UserGroupIcon,
  TrophyIcon,
  BellIcon,
  DocumentTextIcon,
  StarIcon,
  HeartIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';
import {
  ClockIcon as ClockSolidIcon,
  CheckCircleIcon as CheckCircleSolidIcon,
  StarIcon as StarSolidIcon
} from '@heroicons/react/24/solid';

export default function VolunteerDashboard() {
  const { data: session } = useSession();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/volunteer/dashboard');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading volunteer dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const recentTasks = dashboardData?.recentTasks || [];
  const availableTasks = dashboardData?.availableTasks || [];
  const pendingVerifications = dashboardData?.pendingVerifications || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Volunteer Dashboard</h1>
              <p className="text-gray-600">Welcome back, {session?.user?.name}! Ready to make a difference?</p>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                onClick={() => window.location.href = '/profile'}
              >
                <UserGroupIcon className="w-5 h-5 mr-2" />
                Profile
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
                onClick={() => window.location.href = '/volunteer/tasks'}
              >
                <ClipboardDocumentCheckIcon className="w-5 h-5 mr-2" />
                Find Tasks
              </motion.button>
              <div className="relative">
                <BellIcon className="w-6 h-6 text-gray-600 cursor-pointer hover:text-purple-600 transition-colors" />
                {stats.unreadNotifications > 0 && (
                  <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {stats.unreadNotifications}
                  </span>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 transition-colors"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                Logout
              </motion.button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleSolidIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tasks Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.tasksCompleted || 0}</p>
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
              <div className="flex-shrink-0">
                <ClockSolidIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Hours Volunteered</p>
                <p className="text-2xl font-bold text-gray-900">{stats.hoursVolunteered || 0}</p>
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
              <div className="flex-shrink-0">
                <StarSolidIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rating || '5.0'}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <HeartIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Lives Impacted</p>
                <p className="text-2xl font-bold text-gray-900">{stats.livesImpacted || 0}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Tasks */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Available Tasks</h2>
                  <button
                    onClick={() => window.location.href = '/volunteer/tasks'}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    View all
                  </button>
                </div>
              </div>
              <div className="p-6">
                {availableTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <ClipboardDocumentCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No available tasks</h3>
                    <p className="mt-1 text-sm text-gray-500">Check back later for new opportunities.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {availableTasks.slice(0, 3).map((task) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => window.location.href = `/volunteer/tasks/${task.id}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                            <div className="flex items-center mt-2 space-x-4">
                              <div className="flex items-center text-xs text-gray-500">
                                <MapPinIcon className="w-4 h-4 mr-1" />
                                {task.location}
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <CalendarDaysIcon className="w-4 h-4 mr-1" />
                                {task.deadline}
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <ClockIcon className="w-4 h-4 mr-1" />
                                {task.estimatedHours}h
                              </div>
                            </div>
                          </div>
                          <div className="ml-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              task.urgency === 'High' ? 'bg-red-100 text-red-800' :
                              task.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {task.urgency}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Pending Verifications */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Pending Verifications</h2>
              </div>
              <div className="p-6">
                {pendingVerifications.length === 0 ? (
                  <div className="text-center py-4">
                    <ExclamationTriangleIcon className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No pending verifications</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingVerifications.slice(0, 3).map((verification) => (
                      <div key={verification.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{verification.title}</p>
                          <p className="text-xs text-gray-600">{verification.type}</p>
                        </div>
                        <button className="text-xs text-orange-600 hover:text-orange-700 font-medium">
                          Review
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-6">
                {recentTasks.length === 0 ? (
                  <div className="text-center py-4">
                    <DocumentTextIcon className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No recent activity</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentTasks.slice(0, 4).map((task) => (
                      <div key={task.id} className="flex items-center space-x-3">
                        <div className={`flex-shrink-0 w-2 h-2 rounded-full ${
                          task.status === 'completed' ? 'bg-green-500' :
                          task.status === 'in_progress' ? 'bg-blue-500' :
                          'bg-yellow-500'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 truncate">{task.title}</p>
                          <p className="text-xs text-gray-500">{task.lastUpdate}</p>
                        </div>
                      </div>
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
                <button
                  onClick={() => window.location.href = '/volunteer/availability'}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <CalendarDaysIcon className="w-5 h-5 text-purple-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Update Availability</span>
                  </div>
                </button>
                
                <button
                  onClick={() => window.location.href = '/volunteer/certificates'}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <TrophyIcon className="w-5 h-5 text-yellow-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">View Certificates</span>
                  </div>
                </button>
                
                <button
                  onClick={() => window.location.href = '/volunteer/reports'}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <DocumentTextIcon className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Submit Report</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Banner */}
        {stats.hoursVolunteered >= 50 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white"
          >
            <div className="flex items-center">
              <TrophyIcon className="w-8 h-8 mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Congratulations!</h3>
                <p className="text-purple-100">You've completed {stats.hoursVolunteered} hours of volunteer service. Your dedication is making a real difference!</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
