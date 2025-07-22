'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  StarIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  HeartIcon,
  AcademicCapIcon,
  HomeIcon,
  BanknotesIcon,
  UserGroupIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import {
  DocumentTextIcon as DocumentTextSolidIcon,
  StarIcon as StarSolidIcon,
  ExclamationTriangleIcon as ExclamationTriangleSolidIcon
} from '@heroicons/react/24/solid';

const statusConfig = {
  draft: { color: 'gray', icon: ClockIcon, label: 'Draft' },
  pending: { color: 'yellow', icon: ClockIcon, label: 'Pending Review' },
  approved: { color: 'blue', icon: CheckCircleIcon, label: 'Approved' },
  live: { color: 'green', icon: HeartIcon, label: 'Live' },
  paused: { color: 'orange', icon: ClockIcon, label: 'Paused' },
  completed: { color: 'purple', icon: CheckCircleIcon, label: 'Completed' },
  cancelled: { color: 'red', icon: XCircleIcon, label: 'Cancelled' },
  rejected: { color: 'red', icon: XCircleIcon, label: 'Rejected' }
};

const categoryIcons = {
  medical: HeartIcon,
  education: AcademicCapIcon,
  housing: HomeIcon,
  emergency: ExclamationTriangleIcon,
  business: BanknotesIcon,
  family: UserGroupIcon,
  community: UserGroupIcon
};

const urgencyConfig = {
  low: { color: 'green', label: 'Low' },
  medium: { color: 'yellow', label: 'Medium' },
  high: { color: 'orange', label: 'High' },
  critical: { color: 'red', label: 'Critical' }
};

export default function CampaignManagementPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
    featured: '',
    flagged: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 20
  });
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, [filters]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`/api/admin/campaigns?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.campaigns);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }));
  };

  const handleSort = (field) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
      page: 1
    }));
  };

  const handleFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleSelectCampaign = (campaignId) => {
    setSelectedCampaigns(prev => 
      prev.includes(campaignId) 
        ? prev.filter(id => id !== campaignId)
        : [...prev, campaignId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCampaigns.length === campaigns.length) {
      setSelectedCampaigns([]);
    } else {
      setSelectedCampaigns(campaigns.map(campaign => campaign._id));
    }
  };

  const handleCampaignAction = async (action, campaignId, data = {}) => {
    try {
      setActionLoading(true);
      
      let response;
      switch (action) {
        case 'approve':
          response = await fetch(`/api/admin/campaigns/${campaignId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              status: 'approved',
              moderationStatus: 'approved',
              moderationNote: {
                note: 'Campaign approved for publication',
                action: 'approved'
              }
            })
          });
          break;
        
        case 'reject':
          response = await fetch(`/api/admin/campaigns/${campaignId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              status: 'rejected',
              moderationStatus: 'rejected',
              moderationNote: {
                note: data.reason || 'Campaign rejected',
                action: 'rejected'
              }
            })
          });
          break;
        
        case 'feature':
          response = await fetch(`/api/admin/campaigns/${campaignId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              featured: true,
              featuredUntil: data.featuredUntil,
              moderationNote: {
                note: 'Campaign featured on homepage',
                action: 'featured'
              }
            })
          });
          break;
        
        case 'unfeature':
          response = await fetch(`/api/admin/campaigns/${campaignId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              featured: false,
              featuredUntil: null
            })
          });
          break;
        
        case 'mark_urgent':
          response = await fetch(`/api/admin/campaigns/${campaignId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              urgent: true,
              urgency: 'critical'
            })
          });
          break;
        
        case 'archive':
          response = await fetch(`/api/admin/campaigns/${campaignId}`, {
            method: 'DELETE'
          });
          break;
        
        case 'flag':
          response = await fetch(`/api/admin/campaigns/${campaignId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              moderationStatus: 'flagged',
              moderationNote: {
                note: data.reason || 'Campaign flagged for review',
                action: 'flagged'
              }
            })
          });
          break;
      }

      if (response.ok) {
        fetchCampaigns();
      }
    } catch (error) {
      console.error('Error performing campaign action:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedCampaigns.length === 0) return;
    
    try {
      setActionLoading(true);
      
      const promises = selectedCampaigns.map(campaignId => {
        switch (action) {
          case 'approve':
            return handleCampaignAction('approve', campaignId);
          case 'reject':
            return handleCampaignAction('reject', campaignId);
          case 'feature':
            return handleCampaignAction('feature', campaignId);
          case 'archive':
            return handleCampaignAction('archive', campaignId);
          default:
            return Promise.resolve();
        }
      });
      
      await Promise.all(promises);
      setSelectedCampaigns([]);
      fetchCampaigns();
    } catch (error) {
      console.error('Error performing bulk action:', error);
    } finally {
      setActionLoading(false);
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSortIcon = (field) => {
    if (filters.sortBy !== field) return null;
    return filters.sortOrder === 'asc' ? ArrowUpIcon : ArrowDownIcon;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Campaign Management</h1>
              <p className="text-gray-600 mt-2">
                Manage, moderate, and approve all platform campaigns
              </p>
            </div>
            <button
              onClick={() => window.open('/campaign/create', '_blank')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Create Campaign
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => handleFilter('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="live">Live</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => handleFilter('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="medical">Medical</option>
              <option value="education">Education</option>
              <option value="housing">Housing</option>
              <option value="emergency">Emergency</option>
              <option value="business">Business</option>
              <option value="family">Family</option>
              <option value="community">Community</option>
            </select>

            {/* Featured Filter */}
            <select
              value={filters.featured}
              onChange={(e) => handleFilter('featured', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Campaigns</option>
              <option value="true">Featured Only</option>
              <option value="false">Not Featured</option>
            </select>

            {/* Flagged Filter */}
            <select
              value={filters.flagged}
              onChange={(e) => handleFilter('flagged', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Campaigns</option>
              <option value="true">Flagged Only</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedCampaigns.length > 0 && (
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-900">
                {selectedCampaigns.length} campaign(s) selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkAction('approve')}
                  disabled={actionLoading}
                  className="inline-flex items-center px-3 py-1 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 disabled:opacity-50"
                >
                  <CheckCircleIcon className="w-4 h-4 mr-1" />
                  Approve
                </button>
                <button
                  onClick={() => handleBulkAction('reject')}
                  disabled={actionLoading}
                  className="inline-flex items-center px-3 py-1 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50"
                >
                  <XCircleIcon className="w-4 h-4 mr-1" />
                  Reject
                </button>
                <button
                  onClick={() => handleBulkAction('feature')}
                  disabled={actionLoading}
                  className="inline-flex items-center px-3 py-1 border border-yellow-300 text-sm font-medium rounded-md text-yellow-700 bg-yellow-50 hover:bg-yellow-100 disabled:opacity-50"
                >
                  <StarIcon className="w-4 h-4 mr-1" />
                  Feature
                </button>
                <button
                  onClick={() => handleBulkAction('archive')}
                  disabled={actionLoading}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
                >
                  <TrashIcon className="w-4 h-4 mr-1" />
                  Archive
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Campaigns Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedCampaigns.length === campaigns.length && campaigns.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th
                    onClick={() => handleSort('title')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Campaign</span>
                      {getSortIcon('title') && React.createElement(getSortIcon('title'), { className: "w-4 h-4" })}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('category')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Category</span>
                      {getSortIcon('category') && React.createElement(getSortIcon('category'), { className: "w-4 h-4" })}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('status')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      {getSortIcon('status') && React.createElement(getSortIcon('status'), { className: "w-4 h-4" })}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Creator
                  </th>
                  <th
                    onClick={() => handleSort('createdAt')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center space-x-1">
                      <span>Created</span>
                      {getSortIcon('createdAt') && React.createElement(getSortIcon('createdAt'), { className: "w-4 h-4" })}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center">
                      <div className="animate-pulse">Loading campaigns...</div>
                    </td>
                  </tr>
                ) : campaigns.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                      No campaigns found
                    </td>
                  </tr>
                ) : (
                  campaigns.map((campaign, index) => {
                    const StatusIcon = getStatusIcon(campaign.status);
                    const CategoryIcon = getCategoryIcon(campaign.category);
                    const statusColor = getStatusColor(campaign.status);
                    const progressPercentage = campaign.goalAmount > 0 ? 
                      Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100) : 0;
                    
                    return (
                      <motion.tr
                        key={campaign._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedCampaigns.includes(campaign._id)}
                            onChange={() => handleSelectCampaign(campaign._id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              {campaign.images?.[0]?.url ? (
                                <img
                                  className="h-10 w-10 rounded-lg object-cover"
                                  src={campaign.images[0].url}
                                  alt=""
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-lg bg-gray-300 flex items-center justify-center">
                                  <DocumentTextIcon className="w-5 h-5 text-gray-600" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                                {campaign.title}
                                {campaign.featured && (
                                  <StarSolidIcon className="w-4 h-4 text-yellow-500 ml-2 inline" />
                                )}
                                {campaign.urgent && (
                                  <ExclamationTriangleSolidIcon className="w-4 h-4 text-red-500 ml-1 inline" />
                                )}
                              </div>
                              <div className="text-sm text-gray-500 max-w-xs truncate">
                                {campaign.shortDescription || campaign.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <CategoryIcon className="w-3 h-3 mr-1" />
                            {campaign.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${statusColor}-100 text-${statusColor}-800`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig[campaign.status]?.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatCurrency(campaign.raisedAmount)} / {formatCurrency(campaign.goalAmount)}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {progressPercentage.toFixed(1)}% • {campaign.stats?.donationCount || 0} donors
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {campaign.createdBy?.firstName} {campaign.createdBy?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {campaign.createdBy?.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(campaign.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedCampaign(campaign);
                                setShowDetailModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </button>
                            {campaign.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleCampaignAction('approve', campaign._id)}
                                  className="text-green-600 hover:text-green-900"
                                  disabled={actionLoading}
                                >
                                  <CheckCircleIcon className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleCampaignAction('reject', campaign._id)}
                                  className="text-red-600 hover:text-red-900"
                                  disabled={actionLoading}
                                >
                                  <XCircleIcon className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleCampaignAction(campaign.featured ? 'unfeature' : 'feature', campaign._id)}
                              className={`${campaign.featured ? 'text-yellow-600 hover:text-yellow-900' : 'text-gray-600 hover:text-gray-900'}`}
                              disabled={actionLoading}
                            >
                              <StarIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCampaignAction('archive', campaign._id)}
                              className="text-red-600 hover:text-red-900"
                              disabled={actionLoading}
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">
                      {(pagination.currentPage - 1) * pagination.limit + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.currentPage * pagination.limit, pagination.totalCampaigns)}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium">{pagination.totalCampaigns}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === pagination.currentPage
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
