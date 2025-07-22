'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  UserIcon,
  MapPinIcon,
  ChartBarIcon,
  HeartIcon,
  AcademicCapIcon,
  HomeIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleSolidIcon,
  ExclamationTriangleIcon as ExclamationTriangleSolidIcon,
  ClockIcon as ClockSolidIcon,
  XCircleIcon as XCircleSolidIcon
} from '@heroicons/react/24/solid';

const statusConfig = {
  pending: { 
    color: 'yellow', 
    icon: ClockSolidIcon, 
    label: 'Under Review',
    description: 'Your request is being reviewed by our verification team'
  },
  approved: { 
    color: 'blue', 
    icon: CheckCircleSolidIcon, 
    label: 'Approved & Live',
    description: 'Your request has been approved and is now accepting donations'
  },
  rejected: { 
    color: 'red', 
    icon: XCircleSolidIcon, 
    label: 'Needs Revision',
    description: 'Please review feedback and resubmit your request'
  },
  live: { 
    color: 'green', 
    icon: HeartIcon, 
    label: 'Receiving Donations',
    description: 'Your campaign is active and receiving support'
  },
  completed: { 
    color: 'purple', 
    icon: CheckCircleSolidIcon, 
    label: 'Goal Reached',
    description: 'Congratulations! Your funding goal has been reached'
  },
  paused: { 
    color: 'gray', 
    icon: ClockSolidIcon, 
    label: 'Paused',
    description: 'Your campaign is temporarily paused'
  }
};

const categoryIcons = {
  medical: HeartIcon,
  education: AcademicCapIcon,
  housing: HomeIcon,
  emergency: ExclamationTriangleIcon,
  business: BanknotesIcon,
  family: UserGroupIcon
};

export default function RequestsPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchRequests();
    fetchNotifications();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/donee/requests');
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/donee/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
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

  const getStatusIcon = (status) => {
    const config = statusConfig[status];
    return config ? config.icon : ClockIcon;
  };

  const getStatusColor = (status) => {
    const config = statusConfig[status];
    return config ? config.color : 'gray';
  };

  const getCategoryIcon = (category) => {
    return categoryIcons[category] || DocumentTextIcon;
  };

  const filterRequests = (status) => {
    if (status === 'all') return requests;
    return requests.filter(request => request.status === status);
  };

  const filteredRequests = filterRequests(activeTab);

  const tabs = [
    { id: 'all', name: 'All Requests', count: requests.length },
    { id: 'pending', name: 'Under Review', count: requests.filter(r => r.status === 'pending').length },
    { id: 'live', name: 'Active', count: requests.filter(r => r.status === 'live' || r.status === 'approved').length },
    { id: 'completed', name: 'Completed', count: requests.filter(r => r.status === 'completed').length },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="bg-white rounded-lg p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
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
              <h1 className="text-3xl font-bold text-gray-900">My Aid Requests</h1>
              <p className="text-gray-600 mt-2">Track the status and progress of your aid requests</p>
            </div>
            <Link
              href="/donee/requests/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <DocumentTextIcon className="w-5 h-5 mr-2" />
              New Request
            </Link>
          </div>
        </div>

        {/* Recent Notifications */}
        {notifications.length > 0 && (
          <div className="mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <BellIcon className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-medium text-blue-900">Recent Updates</h3>
              </div>
              <div className="space-y-2">
                {notifications.slice(0, 3).map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-sm text-blue-800"
                  >
                    <span className="font-medium">{notification.title}</span>
                    <span className="mx-2">•</span>
                    <span>{notification.message}</span>
                    <span className="mx-2">•</span>
                    <span className="text-blue-600">{new Date(notification.timestamp).toLocaleDateString()}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
                {tab.count > 0 && (
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Requests List */}
        <div className="space-y-6">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {activeTab !== 'all' ? tabs.find(t => t.id === activeTab)?.name.toLowerCase() : ''} requests found
              </h3>
              <p className="text-gray-500 mb-4">
                {activeTab === 'all' 
                  ? 'You haven\'t submitted any aid requests yet'
                  : `You don't have any ${tabs.find(t => t.id === activeTab)?.name.toLowerCase()} requests`
                }
              </p>
              {activeTab === 'all' && (
                <Link
                  href="/donee/requests/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <DocumentTextIcon className="w-4 h-4 mr-2" />
                  Submit Your First Request
                </Link>
              )}
            </div>
          ) : (
            filteredRequests.map((request, index) => {
              const StatusIcon = getStatusIcon(request.status);
              const CategoryIcon = getCategoryIcon(request.category);
              const progress = calculateProgress(request.raisedAmount || 0, request.goalAmount);
              const statusColor = getStatusColor(request.status);
              const statusConfig = statusConfig[request.status];
              
              return (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-gray-100 rounded-lg">
                          <CategoryIcon className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${statusColor}-100 text-${statusColor}-800`}>
                              <StatusIcon className="w-4 h-4 mr-1" />
                              {statusConfig?.label}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3 line-clamp-2">{request.description}</p>
                          <p className="text-sm text-gray-500 mb-3">{statusConfig?.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center text-gray-500">
                              <BanknotesIcon className="w-4 h-4 mr-2" />
                              Goal: {formatCurrency(request.goalAmount)}
                            </div>
                            <div className="flex items-center text-gray-500">
                              <CalendarDaysIcon className="w-4 h-4 mr-2" />
                              {new Date(request.submittedDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-gray-500">
                              <MapPinIcon className="w-4 h-4 mr-2" />
                              {request.location}
                            </div>
                            {request.deadline && (
                              <div className="flex items-center text-gray-500">
                                <ClockIcon className="w-4 h-4 mr-2" />
                                Due: {new Date(request.deadline).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Section */}
                    {(request.status === 'live' || request.status === 'approved' || request.status === 'completed') && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Donation Progress</span>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900">
                              {formatCurrency(request.raisedAmount || 0)}
                            </div>
                            <div className="text-sm text-gray-500">
                              of {formatCurrency(request.goalAmount)} goal
                            </div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-500 ${
                              progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                          <span>{Math.round(progress)}% funded</span>
                          <span>{request.donorCount || 0} supporters</span>
                        </div>
                      </div>
                    )}

                    {/* Timeline/Updates */}
                    {request.timeline && request.timeline.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Updates</h4>
                        <div className="space-y-2">
                          {request.timeline.slice(0, 3).map((update, idx) => (
                            <div key={idx} className="flex items-start space-x-3 text-sm">
                              <div className={`w-2 h-2 rounded-full mt-2 bg-${update.type === 'donation' ? 'green' : 'blue'}-500`}></div>
                              <div className="flex-1">
                                <p className="text-gray-900">{update.title}</p>
                                <p className="text-gray-500 text-xs">{new Date(update.timestamp).toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex space-x-3">
                        <Link
                          href={`/donee/requests/${request.id}`}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                          <EyeIcon className="w-4 h-4 mr-2" />
                          View Details
                        </Link>
                        {request.status === 'pending' && (
                          <Link
                            href={`/donee/requests/${request.id}/edit`}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                          >
                            <PencilIcon className="w-4 h-4 mr-2" />
                            Edit Request
                          </Link>
                        )}
                      </div>

                      {/* Estimated Timeline */}
                      {request.estimatedTimeline && (
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Estimated Timeline</p>
                          <p className="text-sm font-medium text-gray-900">{request.estimatedTimeline}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Load More / Pagination could go here */}
        {filteredRequests.length > 0 && (
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Showing {filteredRequests.length} of {requests.length} requests
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
