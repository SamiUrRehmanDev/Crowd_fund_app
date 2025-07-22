'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiFlag, 
  FiEye, 
  FiCheck, 
  FiX,
  FiAlertTriangle,
  FiUser,
  FiMessageSquare,
  FiImage,
  FiFilter,
  FiSearch,
  FiClock,
  FiShield,
  FiTrash2
} from 'react-icons/fi';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useAdminAuth } from '../../../components/admin/AdminAuthProvider';

const ContentModeration = () => {
  const { user, hasPermission } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [loading, setLoading] = useState(true);
  const [moderationQueue, setModerationQueue] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Mock data - replace with API calls
  useEffect(() => {
    setModerationQueue([
      {
        id: 1,
        type: 'campaign',
        title: 'Help Save My Family from Homelessness',
        content: 'We are facing eviction and need urgent help to save our home...',
        author: 'John Doe',
        authorEmail: 'john.doe@email.com',
        reportedBy: 'user123',
        reportReason: 'Suspicious content',
        severity: 'high',
        status: 'pending',
        createdAt: '2024-01-15T10:30:00Z',
        reportedAt: '2024-01-16T14:20:00Z',
        flags: ['potential-fraud', 'misleading-information'],
        images: ['https://via.placeholder.com/400x300'],
        amount: 5000,
        raised: 1250,
        donorsCount: 23
      },
      {
        id: 2,
        type: 'comment',
        title: 'Comment on "Medical Emergency Fund"',
        content: 'This looks like a scam to me. I\'ve seen similar stories before...',
        author: 'Anonymous User',
        authorEmail: 'anon@email.com',
        reportedBy: 'campaignOwner',
        reportReason: 'Harassment',
        severity: 'medium',
        status: 'pending',
        createdAt: '2024-01-14T16:45:00Z',
        reportedAt: '2024-01-15T09:15:00Z',
        flags: ['harassment', 'defamation'],
        parentCampaign: 'Medical Emergency Fund'
      },
      {
        id: 3,
        type: 'user',
        title: 'User Profile: SuspiciousUser2024',
        content: 'Profile contains inappropriate content and multiple fake campaigns',
        author: 'SuspiciousUser2024',
        authorEmail: 'suspicious@email.com',
        reportedBy: 'multiple_users',
        reportReason: 'Fake profile',
        severity: 'high',
        status: 'pending',
        createdAt: '2024-01-10T08:20:00Z',
        reportedAt: '2024-01-14T11:30:00Z',
        flags: ['fake-profile', 'multiple-violations'],
        campaignsCount: 5,
        suspiciousActivity: true
      },
      {
        id: 4,
        type: 'campaign',
        title: 'Emergency Surgery for My Dog',
        content: 'My beloved dog needs emergency surgery and I can\'t afford it...',
        author: 'Pet Lover',
        authorEmail: 'petlover@email.com',
        reportedBy: 'concerned_user',
        reportReason: 'Duplicate campaign',
        severity: 'low',
        status: 'approved',
        createdAt: '2024-01-12T14:15:00Z',
        reportedAt: '2024-01-13T10:45:00Z',
        moderatedAt: '2024-01-13T15:20:00Z',
        moderatedBy: 'admin1',
        flags: ['duplicate-check'],
        amount: 3000,
        raised: 2800,
        donorsCount: 45
      },
      {
        id: 5,
        type: 'campaign',
        title: 'Fake Medical Emergency',
        content: 'Claims to need money for medical treatment but provides no proof...',
        author: 'Scammer123',
        authorEmail: 'scammer@email.com',
        reportedBy: 'vigilant_user',
        reportReason: 'Fraud',
        severity: 'critical',
        status: 'rejected',
        createdAt: '2024-01-08T12:00:00Z',
        reportedAt: '2024-01-09T08:30:00Z',
        moderatedAt: '2024-01-09T16:45:00Z',
        moderatedBy: 'admin2',
        flags: ['fraud', 'no-verification'],
        amount: 10000,
        raised: 500,
        donorsCount: 8,
        rejectionReason: 'Fraudulent campaign with no medical verification'
      }
    ]);
    setLoading(false);
  }, []);

  const handleModeration = async (itemId, action, reason = '') => {
    try {
      // API call would go here
      setModerationQueue(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { 
                ...item, 
                status: action,
                moderatedAt: new Date().toISOString(),
                moderatedBy: user.username,
                rejectionReason: action === 'rejected' ? reason : undefined
              }
            : item
        )
      );
      setShowDetailsModal(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Moderation action failed:', error);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'campaign': return <FiFlag />;
      case 'comment': return <FiMessageSquare />;
      case 'user': return <FiUser />;
      case 'image': return <FiImage />;
      default: return <FiAlertTriangle />;
    }
  };

  const filteredItems = moderationQueue.filter(item => {
    const matchesTab = activeTab === 'all' || item.status === activeTab;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSeverity = filterSeverity === 'all' || item.severity === filterSeverity;
    
    return matchesTab && matchesSearch && matchesType && matchesSeverity;
  });

  if (!hasPermission('moderation_manage')) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access content moderation.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Moderation</h1>
            <p className="text-gray-600 mt-2">Review and moderate reported content</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 px-3 py-1 rounded-full">
              <span className="text-yellow-800 text-sm font-medium">
                {moderationQueue.filter(item => item.status === 'pending').length} pending
              </span>
            </div>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'pending', label: 'Pending Review', count: moderationQueue.filter(i => i.status === 'pending').length },
                { id: 'approved', label: 'Approved', count: moderationQueue.filter(i => i.status === 'approved').length },
                { id: 'rejected', label: 'Rejected', count: moderationQueue.filter(i => i.status === 'rejected').length },
                { id: 'all', label: 'All Items', count: moderationQueue.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded-full">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title, content, or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="campaign">Campaigns</option>
              <option value="comment">Comments</option>
              <option value="user">Users</option>
              <option value="image">Images</option>
            </select>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Moderation Queue */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reported
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 text-gray-400">
                          {getTypeIcon(item.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.title}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            by {item.author}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {item.content.substring(0, 100)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(item.severity)}`}>
                        {item.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiClock className="mr-1" size={12} />
                        {new Date(item.reportedAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {item.reportReason}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setShowDetailsModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FiEye size={16} />
                        </button>
                        {item.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleModeration(item.id, 'approved')}
                              className="text-green-600 hover:text-green-900"
                            >
                              <FiCheck size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedItem(item);
                                setShowDetailsModal(true);
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FiX size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <FiShield className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
              <p className="mt-1 text-sm text-gray-500">
                No moderation items match your current filters.
              </p>
            </div>
          )}
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedItem && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-lg bg-white">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Content Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Content Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Content Information</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Title:</span>
                        <p className="text-sm text-gray-900">{selectedItem.title}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Content:</span>
                        <p className="text-sm text-gray-900">{selectedItem.content}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Author:</span>
                        <p className="text-sm text-gray-900">{selectedItem.author} ({selectedItem.authorEmail})</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Created:</span>
                        <p className="text-sm text-gray-900">{new Date(selectedItem.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Report Information</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Reported by:</span>
                        <p className="text-sm text-gray-900">{selectedItem.reportedBy}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Reason:</span>
                        <p className="text-sm text-gray-900">{selectedItem.reportReason}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Severity:</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(selectedItem.severity)}`}>
                          {selectedItem.severity}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Flags:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedItem.flags?.map((flag, index) => (
                            <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                              {flag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Campaign-specific info */}
                {selectedItem.type === 'campaign' && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Campaign Details</h4>
                    <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-3 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Target Amount:</span>
                        <p className="text-sm text-gray-900">${selectedItem.amount?.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Raised:</span>
                        <p className="text-sm text-gray-900">${selectedItem.raised?.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Donors:</span>
                        <p className="text-sm text-gray-900">{selectedItem.donorsCount}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {selectedItem.status === 'pending' && (
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => handleModeration(selectedItem.id, 'approved')}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                      <FiCheck size={16} />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Please provide a reason for rejection:');
                        if (reason) {
                          handleModeration(selectedItem.id, 'rejected', reason);
                        }
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
                    >
                      <FiX size={16} />
                      Reject
                    </button>
                  </div>
                )}

                {/* Moderation History */}
                {selectedItem.status !== 'pending' && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Moderation History</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Status:</span> {selectedItem.status} by {selectedItem.moderatedBy}
                      </p>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Date:</span> {new Date(selectedItem.moderatedAt).toLocaleString()}
                      </p>
                      {selectedItem.rejectionReason && (
                        <p className="text-sm text-gray-900 mt-2">
                          <span className="font-medium">Reason:</span> {selectedItem.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ContentModeration;
