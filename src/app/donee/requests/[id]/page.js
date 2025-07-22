'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  MapPinIcon,
  UserIcon,
  HeartIcon,
  ChartBarIcon,
  DocumentTextIcon,
  PencilIcon,
  ShareIcon,
  DocumentArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  AcademicCapIcon,
  HomeIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleSolidIcon,
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

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState(null);
  const [donations, setDonations] = useState([]);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    if (params.id) {
      fetchRequestDetail();
    }
  }, [params.id]);

  const fetchRequestDetail = async () => {
    try {
      const [requestRes, donationsRes, timelineRes] = await Promise.all([
        fetch(`/api/donee/requests/${params.id}`),
        fetch(`/api/donee/requests/${params.id}/donations`),
        fetch(`/api/donee/requests/${params.id}/timeline`)
      ]);

      if (requestRes.ok) {
        const requestData = await requestRes.json();
        setRequest(requestData.request);
      }

      if (donationsRes.ok) {
        const donationsData = await donationsRes.json();
        setDonations(donationsData.donations || []);
      }

      if (timelineRes.ok) {
        const timelineData = await timelineRes.json();
        setTimeline(timelineData.timeline || []);
      }
    } catch (error) {
      console.error('Error fetching request details:', error);
    } finally {
      setLoading(false);
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

  const shareRequest = () => {
    if (navigator.share) {
      navigator.share({
        title: request.title,
        text: request.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  const downloadReceipt = () => {
    // Implementation for downloading receipt/confirmation
    console.log('Downloading receipt for request:', request.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Request not found</h3>
            <p className="text-gray-500 mb-4">The requested aid request could not be found.</p>
            <Link
              href="/donee/requests"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Requests
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(request.status);
  const CategoryIcon = getCategoryIcon(request.category);
  const progress = calculateProgress(request.raisedAmount || 0, request.goalAmount);
  const statusColor = getStatusColor(request.status);
  const statusInfo = statusConfig[request.status];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/donee/requests"
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-1" />
                Back to Requests
              </Link>
            </div>
            <div className="flex space-x-2">
              {request.status === 'pending' && (
                <Link
                  href={`/donee/requests/${request.id}/edit`}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <PencilIcon className="w-4 h-4 mr-2" />
                  Edit
                </Link>
              )}
              <button
                onClick={shareRequest}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <ShareIcon className="w-4 h-4 mr-2" />
                Share
              </button>
              <button
                onClick={downloadReceipt}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Request Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <CategoryIcon className="w-8 h-8 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{request.title}</h1>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${statusColor}-100 text-${statusColor}-800`}>
                      <StatusIcon className="w-4 h-4 mr-1" />
                      {statusInfo?.label}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{statusInfo?.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <BanknotesIcon className="w-4 h-4 mr-2" />
                      Goal: {formatCurrency(request.goalAmount)}
                    </div>
                    <div className="flex items-center">
                      <CalendarDaysIcon className="w-4 h-4 mr-2" />
                      {new Date(request.submittedDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <MapPinIcon className="w-4 h-4 mr-2" />
                      {request.location}
                    </div>
                    {request.deadline && (
                      <div className="flex items-center">
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
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Donation Progress</h2>
                
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatCurrency(request.raisedAmount || 0)}
                      </div>
                      <div className="text-sm text-gray-500">
                        of {formatCurrency(request.goalAmount)} goal
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full transition-all duration-500 ${
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

                {/* Funding Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{donations.length}</div>
                    <div className="text-sm text-gray-500">Total Donations</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {donations.length > 0 ? formatCurrency(donations.reduce((sum, d) => sum + d.amount, 0) / donations.length) : '$0'}
                    </div>
                    <div className="text-sm text-gray-500">Avg. Donation</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(request.goalAmount - (request.raisedAmount || 0))}
                    </div>
                    <div className="text-sm text-gray-500">Remaining</div>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Request Details</h2>
              <div className="prose text-gray-700">
                <p>{request.description}</p>
              </div>
            </div>

            {/* Recent Donations */}
            {donations.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Donations</h2>
                <div className="space-y-4">
                  {donations.slice(0, 5).map((donation, index) => (
                    <motion.div
                      key={donation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-full">
                          <HeartIcon className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {donation.anonymous ? 'Anonymous Donor' : donation.donorName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(donation.timestamp).toLocaleDateString()}
                          </p>
                          {donation.message && (
                            <p className="text-sm text-gray-600 mt-1 italic">"{donation.message}"</p>
                          )}
                        </div>
                      </div>
                      <div className="text-lg font-semibold text-green-600">
                        {formatCurrency(donation.amount)}
                      </div>
                    </motion.div>
                  ))}
                </div>
                {donations.length > 5 && (
                  <div className="text-center mt-4">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View all {donations.length} donations
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Request Timeline</h2>
              <div className="space-y-4">
                {timeline.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className={`p-1 rounded-full mt-1 bg-${event.type === 'status' ? 'blue' : event.type === 'donation' ? 'green' : 'gray'}-100`}>
                      {event.type === 'status' ? (
                        <CheckCircleIcon className="w-4 h-4 text-blue-600" />
                      ) : event.type === 'donation' ? (
                        <BanknotesIcon className="w-4 h-4 text-green-600" />
                      ) : (
                        <ClockIcon className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-500">{event.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {request.status === 'pending' && (
                  <Link
                    href={`/donee/requests/${request.id}/edit`}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <PencilIcon className="w-4 h-4 mr-2" />
                    Edit Request
                  </Link>
                )}
                <button
                  onClick={shareRequest}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <ShareIcon className="w-4 h-4 mr-2" />
                  Share Request
                </button>
                <button
                  onClick={downloadReceipt}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                  Download Receipt
                </button>
                <Link
                  href="/donee/support"
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <HeartIcon className="w-4 h-4 mr-2" />
                  Contact Support
                </Link>
              </div>
            </div>

            {/* Estimated Timeline */}
            {request.estimatedTimeline && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Estimated Timeline</h3>
                <p className="text-sm text-blue-800">{request.estimatedTimeline}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
