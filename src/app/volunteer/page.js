'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  MapPinIcon,
  TrophyIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';
import {
  ClockIcon as ClockSolidIcon,
  CheckCircleIcon as CheckCircleSolidIcon,
  StarIcon as StarSolidIcon,
  HeartIcon as HeartSolidIcon
} from '@heroicons/react/24/solid';

export default function VolunteerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creatingData, setCreatingData] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user.role !== 'volunteer') {
      router.push('/auth/signin');
      return;
    }

    fetchDashboardData();
  }, [session, status, router]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/volunteer/dashboard');
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        console.error('Failed to fetch dashboard data:', response.status);
        // Set default/empty data on error
        setDashboardData({
          stats: { tasksCompleted: 0, hoursVolunteered: 0, rating: 0, livesImpacted: 0 },
          availableTasks: [],
          pendingVerifications: [],
          recentTasks: [],
          notifications: []
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set default/empty data on error
      setDashboardData({
        stats: { tasksCompleted: 0, hoursVolunteered: 0, rating: 0, livesImpacted: 0 },
        availableTasks: [],
        pendingVerifications: [],
        recentTasks: [],
        notifications: []
      });
    } finally {
      setLoading(false);
    }
  };

  const createSampleData = async () => {
    setCreatingData(true);
    try {
      const response = await fetch('/api/volunteer/create-sample-data', {
        method: 'POST'
      });
      
      if (response.ok) {
        // Refresh dashboard data after creating sample data
        await fetchDashboardData();
        alert('Sample data created successfully! Please refresh the page.');
      } else {
        alert('Failed to create sample data');
      }
    } catch (error) {
      console.error('Error creating sample data:', error);
      alert('Error creating sample data');
    } finally {
      setCreatingData(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    tasksCompleted: 0,
    hoursVolunteered: 0,
    rating: 0,
    livesImpacted: 0
  };
  const recentTasks = dashboardData?.recentTasks || [];
  const availableTasks = dashboardData?.availableTasks || [];
  const pendingVerifications = dashboardData?.pendingVerifications || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {session?.user?.name}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Thank you for making a difference in the world
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-600">Active Volunteer</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={createSampleData}
                disabled={creatingData}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 disabled:opacity-50"
              >
                {creatingData ? 'Creating...' : 'Create Sample Data'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <CheckCircleSolidIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tasks Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.tasksCompleted}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <ClockSolidIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hours Volunteered</p>
              <p className="text-2xl font-bold text-gray-900">{stats.hoursVolunteered}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <StarSolidIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">{stats.rating}/5</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <HeartSolidIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Lives Impacted</p>
              <p className="text-2xl font-bold text-gray-900">{stats.livesImpacted}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Available Tasks */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Available Tasks</h2>
                <button
                  onClick={() => router.push('/volunteer/tasks')}
                  className="text-purple-600 hover:text-purple-500 text-sm font-medium"
                >
                  View all →
                </button>
              </div>
            </div>
            <div className="p-6">
              {availableTasks.length === 0 ? (
                <div className="text-center py-8">
                  <ClipboardDocumentCheckIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No available tasks at the moment</p>
                  <p className="text-sm text-gray-400 mt-1">Check back later for new opportunities</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableTasks.slice(0, 3).map((task, index) => (
                    <motion.div
                      key={task.id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{task.title || 'Food Distribution'}</h3>
                          <p className="text-sm text-gray-600 mt-1">{task.description || 'Help distribute meals to families in need'}</p>
                          <div className="flex items-center mt-2 text-sm text-gray-500">
                            <MapPinIcon className="w-4 h-4 mr-1" />
                            <span>{task.location || 'Downtown Community Center'}</span>
                            <CalendarDaysIcon className="w-4 h-4 ml-4 mr-1" />
                            <span>{task.date || 'Today, 2:00 PM'}</span>
                          </div>
                        </div>
                        <button className="ml-4 px-3 py-1 text-sm font-medium text-purple-600 bg-purple-100 rounded-md hover:bg-purple-200 transition-colors">
                          Apply
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              {recentTasks.length === 0 ? (
                <div className="text-center py-8">
                  <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No recent activity</p>
                  <p className="text-sm text-gray-400 mt-1">Your completed tasks will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentTasks.slice(0, 5).map((activity, index) => (
                    <motion.div
                      key={activity.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-center space-x-3"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.status === 'completed' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        {activity.status === 'completed' ? (
                          <CheckCircleIcon className="w-4 h-4 text-green-600" />
                        ) : (
                          <ClockIcon className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title || 'Food Distribution Task'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.date || '2 hours ago'} • {activity.location || 'Downtown Center'}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        activity.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {activity.status || 'Completed'}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              <button
                onClick={() => router.push('/volunteer/tasks')}
                className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <ClipboardDocumentCheckIcon className="w-5 h-5 text-purple-600 group-hover:text-purple-700" />
                <span className="ml-3 text-sm font-medium text-gray-900">Find New Tasks</span>
              </button>
              <button
                onClick={() => router.push('/volunteer/reports')}
                className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <DocumentTextIcon className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
                <span className="ml-3 text-sm font-medium text-gray-900">Submit Report</span>
              </button>
              <button
                onClick={() => router.push('/volunteer/availability')}
                className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <CalendarDaysIcon className="w-5 h-5 text-green-600 group-hover:text-green-700" />
                <span className="ml-3 text-sm font-medium text-gray-900">Update Availability</span>
              </button>
              <button
                onClick={() => router.push('/volunteer/certificates')}
                className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <TrophyIcon className="w-5 h-5 text-yellow-600 group-hover:text-yellow-700" />
                <span className="ml-3 text-sm font-medium text-gray-900">View Certificates</span>
              </button>
            </div>
          </div>

          {/* Pending Verifications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Verification Tasks</h2>
                {pendingVerifications.length > 0 && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                    {pendingVerifications.length}
                  </span>
                )}
              </div>
            </div>
            <div className="p-6">
              {pendingVerifications.length === 0 ? (
                <div className="text-center py-4">
                  <CheckCircleIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No verification tasks available</p>
                  <button
                    onClick={createSampleData}
                    disabled={creatingData}
                    className="mt-2 text-xs text-purple-600 hover:text-purple-500 underline"
                  >
                    {creatingData ? 'Creating...' : 'Create sample data'}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingVerifications.slice(0, 3).map((verification, index) => (
                    <div key={verification.id || index} className={`p-3 rounded-lg border ${
                      verification.isAssigned && verification.assignedTo === session?.user?.id
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-yellow-50 border-yellow-200'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900">
                              {verification.title}
                            </p>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              verification.urgency === 'urgent' ? 'bg-red-100 text-red-800' :
                              verification.urgency === 'high' ? 'bg-orange-100 text-orange-800' :
                              verification.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {verification.urgency}
                            </span>
                            {verification.isAssigned && verification.assignedTo === session?.user?.id && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Assigned
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {verification.organization} • {verification.location}
                          </p>
                          {verification.deadline && (
                            <p className="text-xs text-gray-500 mt-1">
                              Due: {new Date(verification.deadline).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <ClipboardDocumentCheckIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => router.push('/volunteer/verifications')}
                    className="block w-full text-center text-sm text-purple-600 hover:text-purple-500 font-medium pt-2"
                  >
                    View all verifications →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
