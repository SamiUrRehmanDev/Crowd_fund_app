'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarIcon,
  CurrencyDollarIcon,
  UserIcon,
  MapPinIcon,
  TagIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function CampaignDetailPage({ params }) {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCampaign();
  }, []);

  const fetchCampaign = async () => {
    try {
      const response = await fetch(`/api/campaigns/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setCampaign(data.campaign);
      } else {
        setError('Campaign not found');
      }
    } catch (error) {
      console.error('Error fetching campaign:', error);
      setError('Failed to load campaign');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'yellow';
      case 'approved': return 'green';
      case 'live': return 'blue';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      case 'rejected': return 'red';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return ClockIcon;
      case 'approved': 
      case 'live':
      case 'completed': return CheckCircleIcon;
      case 'cancelled':
      case 'rejected': return ExclamationTriangleIcon;
      default: return ClockIcon;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Campaign Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Campaign not found</p>
        </div>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(campaign.status);
  const statusColor = getStatusColor(campaign.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          {/* Success Banner for new campaigns */}
          {campaign.status === 'pending' && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <ClockIcon className="h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Campaign Created Successfully!</strong> Your campaign is now pending admin approval.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Campaign Header */}
          <div className="px-6 py-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <StatusIcon className={`h-6 w-6 text-${statusColor}-500 mr-2`} />
                <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${statusColor}-100 text-${statusColor}-800`}>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Campaign ID: {campaign._id}
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {campaign.title}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-600">Goal Amount</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">
                  ${campaign.goal?.toLocaleString() || campaign.goalAmount?.toLocaleString() || '0'}
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-600">Raised Amount</span>
                </div>
                <p className="text-2xl font-bold text-green-900">
                  ${campaign.raisedAmount?.toLocaleString() || '0'}
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <TagIcon className="h-5 w-5 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-purple-600">Category</span>
                </div>
                <p className="text-lg font-semibold text-purple-900 capitalize">
                  {campaign.category}
                </p>
              </div>
            </div>
          </div>

          {/* Campaign Details */}
          <div className="px-6 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed">
                  {campaign.description}
                </p>

                {campaign.urgency && (
                  <div className="mt-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      campaign.urgency === 'critical' ? 'bg-red-100 text-red-800' :
                      campaign.urgency === 'high' ? 'bg-orange-100 text-orange-800' :
                      campaign.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      Urgency: {campaign.urgency.charAt(0).toUpperCase() + campaign.urgency.slice(1)}
                    </span>
                  </div>
                )}
              </div>

              {/* Campaign Info */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Campaign Information</h2>
                
                <div className="space-y-4">
                  {campaign.endDate && (
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <span className="text-sm text-gray-500">End Date</span>
                        <p className="font-medium">
                          {new Date(campaign.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {campaign.organizerName && (
                    <div className="flex items-center">
                      <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <span className="text-sm text-gray-500">Organizer</span>
                        <p className="font-medium">{campaign.organizerName}</p>
                        {campaign.organizerEmail && (
                          <p className="text-sm text-gray-600">{campaign.organizerEmail}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {campaign.beneficiaryLocation && (
                    <div className="flex items-center">
                      <MapPinIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <span className="text-sm text-gray-500">Location</span>
                        <p className="font-medium">{campaign.beneficiaryLocation}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <span className="text-sm text-gray-500">Created</span>
                      <p className="font-medium">
                        {new Date(campaign.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {campaign.tags && campaign.tags.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {campaign.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => window.history.back()}
                className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Go Back
              </button>
              
              <div className="flex gap-3">
                <button
                  onClick={() => window.location.href = '/admin/campaigns'}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  View All Campaigns
                </button>
                
                {campaign.status === 'live' && (
                  <button
                    onClick={() => window.location.href = `/campaigns/${campaign._id}/donate`}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Donate Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
