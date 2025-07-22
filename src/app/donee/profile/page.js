'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserIcon,
  DocumentTextIcon,
  DocumentArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  ChartBarIcon,
  PencilIcon,
  EyeIcon,
  MapPinIcon,
  HeartIcon,
  AcademicCapIcon,
  HomeIcon,
  ExclamationTriangleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleSolidIcon,
  ClockIcon as ClockSolidIcon,
  XCircleIcon as XCircleSolidIcon
} from '@heroicons/react/24/solid';

const statusConfig = {
  pending: { color: 'yellow', icon: ClockSolidIcon, label: 'Under Review' },
  approved: { color: 'blue', icon: CheckCircleSolidIcon, label: 'Approved & Live' },
  rejected: { color: 'red', icon: XCircleSolidIcon, label: 'Needs Revision' },
  live: { color: 'green', icon: HeartIcon, label: 'Receiving Donations' },
  completed: { color: 'purple', icon: CheckCircleSolidIcon, label: 'Goal Reached' },
  paused: { color: 'gray', icon: ClockSolidIcon, label: 'Paused' }
};

const categoryIcons = {
  medical: HeartIcon,
  education: AcademicCapIcon,
  housing: HomeIcon,
  emergency: ExclamationTriangleIcon,
  business: BanknotesIcon,
  family: UserGroupIcon
};

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [profileData, setProfileData] = useState({
    profile: {},
    statistics: {},
    requests: [],
    receipts: [],
    timeline: []
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({});

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/donee/profile');
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
        setProfileForm(data.profile);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      const response = await fetch('/api/donee/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });

      if (response.ok) {
        setProfileData(prev => ({ ...prev, profile: profileForm }));
        setEditingProfile(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const downloadReceipt = async (requestId) => {
    try {
      const response = await fetch(`/api/donee/requests/${requestId}/receipt`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `receipt-${requestId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading receipt:', error);
    }
  };

  const downloadAllRecords = async () => {
    try {
      const response = await fetch('/api/donee/export');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'aid-requests-history.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading records:', error);
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

  const tabs = [
    { id: 'overview', name: 'Profile Overview', icon: UserIcon },
    { id: 'history', name: 'Request History', icon: DocumentTextIcon },
    { id: 'receipts', name: 'Receipts & Records', icon: DocumentArrowDownIcon },
    { id: 'timeline', name: 'Activity Timeline', icon: ClockIcon }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile & History</h1>
          <p className="text-gray-600 mt-2">
            Manage your profile and access your complete aid request history
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="w-5 h-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profile Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Profile Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                <button
                  onClick={() => setEditingProfile(!editingProfile)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <PencilIcon className="w-4 h-4 mr-2" />
                  {editingProfile ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {editingProfile ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        value={profileForm.firstName || ''}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        value={profileForm.lastName || ''}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={profileForm.email || ''}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={profileForm.phone || ''}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={profileForm.location || ''}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="City, State/Province, Country"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setEditingProfile(false)}
                      className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={updateProfile}
                      className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Name:</span>
                    <p className="text-gray-900">{profileData.profile.firstName} {profileData.profile.lastName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <p className="text-gray-900">{profileData.profile.email}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span>
                    <p className="text-gray-900">{profileData.profile.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Location:</span>
                    <p className="text-gray-900">{profileData.profile.location || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Member Since:</span>
                    <p className="text-gray-900">{new Date(profileData.profile.joinDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Account Status:</span>
                    <p className="text-green-600 font-medium">Active</p>
                  </div>
                </div>
              )}
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Requests</p>
                    <p className="text-2xl font-semibold text-gray-900">{profileData.statistics.totalRequests || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BanknotesIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Raised</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatCurrency(profileData.statistics.totalRaised || 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <CheckCircleIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Completed</p>
                    <p className="text-2xl font-semibold text-gray-900">{profileData.statistics.completedRequests || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <HeartIcon className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Supporters</p>
                    <p className="text-2xl font-semibold text-gray-900">{profileData.statistics.totalSupporters || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Request History Tab */}
        {activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Request History</h2>
            </div>
            <div className="p-6">
              {profileData.requests.length === 0 ? (
                <div className="text-center py-8">
                  <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                  <p className="text-gray-500">You haven't submitted any aid requests yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {profileData.requests.map((request, index) => {
                    const StatusIcon = getStatusIcon(request.status);
                    const CategoryIcon = getCategoryIcon(request.category);
                    const statusColor = getStatusColor(request.status);
                    
                    return (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <CategoryIcon className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-medium text-gray-900">{request.title}</h3>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${statusColor}-100 text-${statusColor}-800`}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {statusConfig[request.status]?.label}
                                </span>
                              </div>
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{request.description}</p>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <BanknotesIcon className="w-4 h-4 mr-1" />
                                  Goal: {formatCurrency(request.goalAmount)}
                                </div>
                                <div className="flex items-center">
                                  <CalendarDaysIcon className="w-4 h-4 mr-1" />
                                  {new Date(request.submittedDate).toLocaleDateString()}
                                </div>
                                <div className="flex items-center">
                                  <ChartBarIcon className="w-4 h-4 mr-1" />
                                  Raised: {formatCurrency(request.raisedAmount || 0)}
                                </div>
                                <div className="flex items-center">
                                  <HeartIcon className="w-4 h-4 mr-1" />
                                  {request.donorCount || 0} supporters
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => window.open(`/donee/requests/${request.id}`, '_blank')}
                              className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                              <EyeIcon className="w-4 h-4 mr-1" />
                              View
                            </button>
                            <button
                              onClick={() => downloadReceipt(request.id)}
                              className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                              <DocumentArrowDownIcon className="w-4 h-4 mr-1" />
                              Receipt
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Receipts & Records Tab */}
        {activeTab === 'receipts' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Receipts & Records</h2>
                <button
                  onClick={downloadAllRecords}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                  Download All Records
                </button>
              </div>
            </div>
            <div className="p-6">
              {profileData.receipts.length === 0 ? (
                <div className="text-center py-8">
                  <DocumentArrowDownIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No receipts available</h3>
                  <p className="text-gray-500">Receipts will be available once you receive donations.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {profileData.receipts.map((receipt, index) => (
                    <motion.div
                      key={receipt.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900">{receipt.title}</h3>
                        <p className="text-sm text-gray-500">
                          Generated on {new Date(receipt.generatedDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Total donations: {formatCurrency(receipt.totalAmount)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => downloadReceipt(receipt.requestId)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                          Download
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Activity Timeline Tab */}
        {activeTab === 'timeline' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Activity Timeline</h2>
            </div>
            <div className="p-6">
              {profileData.timeline.length === 0 ? (
                <div className="text-center py-8">
                  <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No activity yet</h3>
                  <p className="text-gray-500">Your activity timeline will appear here.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {profileData.timeline.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-4"
                    >
                      <div className={`p-2 rounded-full bg-${event.type === 'donation' ? 'green' : event.type === 'status' ? 'blue' : 'gray'}-100`}>
                        {event.type === 'donation' ? (
                          <BanknotesIcon className="w-5 h-5 text-green-600" />
                        ) : event.type === 'status' ? (
                          <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                        ) : (
                          <ClockIcon className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900">{event.title}</h3>
                          <span className="text-xs text-gray-500">
                            {new Date(event.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        {event.amount && (
                          <p className="text-sm font-medium text-green-600 mt-1">
                            {formatCurrency(event.amount)}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
