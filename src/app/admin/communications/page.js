'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiSend, 
  FiMail, 
  FiUsers,
  FiMessageSquare,
  FiBell,
  FiEdit,
  FiTrash2,
  FiEye,
  FiClock,
  FiSearch,
  FiFilter,
  FiPlus,
  FiX,
  FiPaperclip,
  FiUserCheck,
  FiVolume2,
  FiUser
} from 'react-icons/fi';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useAdminAuth } from '../../../components/admin/AdminAuthProvider';

const Communications = () => {
  const { user, hasPermission } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('messages');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Messages state
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // Compose form state
  const [composeForm, setComposeForm] = useState({
    to: '',
    recipientType: 'user', // user, all_users, volunteers, donees, donors
    subject: '',
    content: '',
    priority: 'normal',
    attachments: []
  });

  // Announcement form state
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    type: 'general', // general, maintenance, feature, urgent
    targetAudience: 'all',
    scheduleDate: '',
    expiryDate: ''
  });

  // Mock data - replace with API calls
  useEffect(() => {
    setMessages([
      {
        id: 1,
        from: 'admin',
        to: 'john.doe@email.com',
        toName: 'John Doe',
        subject: 'Campaign Verification Required',
        content: 'Your recent campaign submission requires additional verification documents...',
        status: 'sent',
        priority: 'high',
        sentAt: '2024-01-16T10:30:00Z',
        readAt: '2024-01-16T14:20:00Z',
        type: 'individual'
      },
      {
        id: 2,
        from: 'admin',
        to: 'volunteers@platform.com',
        toName: 'All Volunteers',
        subject: 'New Task Assignment Protocol',
        content: 'We are implementing a new task assignment system to improve efficiency...',
        status: 'sent',
        priority: 'normal',
        sentAt: '2024-01-15T16:45:00Z',
        readAt: null,
        type: 'bulk',
        recipientCount: 145
      },
      {
        id: 3,
        from: 'admin',
        to: 'support@email.com',
        toName: 'Support Team',
        subject: 'Weekly Performance Report',
        content: 'Please find attached the weekly performance metrics and action items...',
        status: 'draft',
        priority: 'normal',
        sentAt: null,
        readAt: null,
        type: 'group'
      }
    ]);

    setNotifications([
      {
        id: 1,
        title: 'System Maintenance Scheduled',
        content: 'Platform will be under maintenance on Sunday from 2 AM to 6 AM EST.',
        type: 'maintenance',
        status: 'active',
        createdAt: '2024-01-15T09:00:00Z',
        expiresAt: '2024-01-22T06:00:00Z',
        targetAudience: 'all',
        viewCount: 2341
      },
      {
        id: 2,
        title: 'New Feature: Campaign Analytics',
        content: 'We have introduced detailed analytics for campaign creators to track their progress.',
        type: 'feature',
        status: 'active',
        createdAt: '2024-01-14T15:30:00Z',
        expiresAt: '2024-01-28T23:59:59Z',
        targetAudience: 'campaign_creators',
        viewCount: 1876
      },
      {
        id: 3,
        title: 'Security Update Notice',
        content: 'Please update your passwords and enable two-factor authentication for enhanced security.',
        type: 'urgent',
        status: 'active',
        createdAt: '2024-01-13T12:00:00Z',
        expiresAt: '2024-01-27T23:59:59Z',
        targetAudience: 'all',
        viewCount: 3452
      }
    ]);

    setAnnouncements([
      {
        id: 1,
        title: 'Holiday Hours Update',
        content: 'Our support team will have limited availability during the holiday season.',
        status: 'scheduled',
        publishAt: '2024-01-20T09:00:00Z',
        expiresAt: '2024-01-25T17:00:00Z',
        createdBy: 'admin1',
        targetAudience: 'all'
      },
      {
        id: 2,
        title: 'Donation Matching Campaign',
        content: 'For the next 48 hours, all donations will be matched by our partner organization.',
        status: 'published',
        publishAt: '2024-01-16T00:00:00Z',
        expiresAt: '2024-01-18T23:59:59Z',
        createdBy: 'admin2',
        targetAudience: 'donors'
      }
    ]);
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // API call to send message
      const newMessage = {
        id: Date.now(),
        from: 'admin',
        to: composeForm.to,
        toName: composeForm.recipientType === 'user' ? composeForm.to : `All ${composeForm.recipientType}`,
        subject: composeForm.subject,
        content: composeForm.content,
        status: 'sent',
        priority: composeForm.priority,
        sentAt: new Date().toISOString(),
        readAt: null,
        type: composeForm.recipientType === 'user' ? 'individual' : 'bulk',
        recipientCount: composeForm.recipientType !== 'user' ? 200 : 1
      };
      
      setMessages(prev => [newMessage, ...prev]);
      setComposeForm({
        to: '',
        recipientType: 'user',
        subject: '',
        content: '',
        priority: 'normal',
        attachments: []
      });
      setShowComposeModal(false);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // API call to create announcement
      const newAnnouncement = {
        id: Date.now(),
        title: announcementForm.title,
        content: announcementForm.content,
        type: announcementForm.type,
        status: announcementForm.scheduleDate ? 'scheduled' : 'published',
        publishAt: announcementForm.scheduleDate || new Date().toISOString(),
        expiresAt: announcementForm.expiryDate,
        createdBy: user.username,
        targetAudience: announcementForm.targetAudience,
        viewCount: 0
      };
      
      setNotifications(prev => [newAnnouncement, ...prev]);
      setAnnouncementForm({
        title: '',
        content: '',
        type: 'general',
        targetAudience: 'all',
        scheduleDate: '',
        expiryDate: ''
      });
      setShowAnnouncementModal(false);
    } catch (error) {
      console.error('Failed to create announcement:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'normal': return 'text-blue-600 bg-blue-100';
      case 'low': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'published': return 'text-green-600 bg-green-100';
      case 'active': return 'text-green-600 bg-green-100';
      case 'expired': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'individual': return <FiUser />;
      case 'bulk': return <FiUsers />;
      case 'group': return <FiUserCheck />;
      case 'maintenance': return <FiClock />;
      case 'feature': return <FiBell />;
      case 'urgent': return <FiVolume2 />;
      default: return <FiMessageSquare />;
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.toName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || message.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (!hasPermission('communications_manage')) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access communications.</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Communications</h1>
            <p className="text-gray-600 mt-2">Manage messages, notifications, and announcements</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAnnouncementModal(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <FiVolume2 size={16} />
              New Announcement
            </button>
            <button
              onClick={() => setShowComposeModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <FiPlus size={16} />
              Compose Message
            </button>
          </div>
        </div>

        {/* Communication Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'messages', label: 'Messages', icon: FiMail, count: messages.length },
                { id: 'notifications', label: 'Notifications', icon: FiBell, count: notifications.filter(n => n.status === 'active').length },
                { id: 'announcements', label: 'Announcements', icon: FiVolume2, count: announcements.length }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded-full">
                      {tab.count}
                    </span>
                  </button>
                );
              })}
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
                  placeholder="Search communications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="sent">Sent</option>
              <option value="draft">Draft</option>
              <option value="failed">Failed</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
        </div>

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recipient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMessages.map((message) => (
                    <motion.tr
                      key={message.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 text-gray-400">
                            {getTypeIcon(message.type)}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{message.toName}</div>
                            <div className="text-sm text-gray-500">{message.to}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{message.subject}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {message.content.substring(0, 100)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                          {message.type}
                          {message.recipientCount && (
                            <span className="ml-1">({message.recipientCount})</span>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                          {message.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                          {message.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {message.sentAt ? (
                          <div className="flex items-center">
                            <FiClock className="mr-1" size={12} />
                            {new Date(message.sentAt).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-gray-400">Not sent</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedMessage(message);
                              setShowMessageModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FiEye size={16} />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <FiEdit size={16} />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-lg shadow-sm border"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(notification.status)}`}>
                        {notification.status}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {notification.type}
                      </span>
                      <span className="text-sm text-gray-500">
                        {notification.viewCount} views
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {notification.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{notification.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Created: {new Date(notification.createdAt).toLocaleDateString()}</span>
                      {notification.expiresAt && (
                        <span>Expires: {new Date(notification.expiresAt).toLocaleDateString()}</span>
                      )}
                      <span>Audience: {notification.targetAudience}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <FiEdit size={16} />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-lg shadow-sm border"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(announcement.status)}`}>
                        {announcement.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        by {announcement.createdBy}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {announcement.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{announcement.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Publish: {new Date(announcement.publishAt).toLocaleDateString()}</span>
                      {announcement.expiresAt && (
                        <span>Expires: {new Date(announcement.expiresAt).toLocaleDateString()}</span>
                      )}
                      <span>Audience: {announcement.targetAudience}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <FiEdit size={16} />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Compose Message Modal */}
        {showComposeModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-lg bg-white">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Compose Message</h3>
                <button
                  onClick={() => setShowComposeModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSendMessage} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recipient Type
                    </label>
                    <select
                      value={composeForm.recipientType}
                      onChange={(e) => setComposeForm(prev => ({ ...prev, recipientType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="user">Individual User</option>
                      <option value="all_users">All Users</option>
                      <option value="volunteers">All Volunteers</option>
                      <option value="donors">All Donors</option>
                      <option value="donees">All Donees</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={composeForm.priority}
                      onChange={(e) => setComposeForm(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                {composeForm.recipientType === 'user' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recipient Email
                    </label>
                    <input
                      type="email"
                      value={composeForm.to}
                      onChange={(e) => setComposeForm(prev => ({ ...prev, to: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="user@example.com"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={composeForm.subject}
                    onChange={(e) => setComposeForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message Content
                  </label>
                  <textarea
                    value={composeForm.content}
                    onChange={(e) => setComposeForm(prev => ({ ...prev, content: e.target.value }))}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowComposeModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    <FiSend size={16} />
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Announcement Modal */}
        {showAnnouncementModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-lg bg-white">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Create Announcement</h3>
                <button
                  onClick={() => setShowAnnouncementModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={announcementForm.title}
                    onChange={(e) => setAnnouncementForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={announcementForm.type}
                      onChange={(e) => setAnnouncementForm(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="general">General</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="feature">Feature Update</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Audience
                    </label>
                    <select
                      value={announcementForm.targetAudience}
                      onChange={(e) => setAnnouncementForm(prev => ({ ...prev, targetAudience: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Users</option>
                      <option value="donors">Donors</option>
                      <option value="donees">Donees</option>
                      <option value="volunteers">Volunteers</option>
                      <option value="campaign_creators">Campaign Creators</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={announcementForm.content}
                    onChange={(e) => setAnnouncementForm(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Schedule Date (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={announcementForm.scheduleDate}
                      onChange={(e) => setAnnouncementForm(prev => ({ ...prev, scheduleDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={announcementForm.expiryDate}
                      onChange={(e) => setAnnouncementForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAnnouncementModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    <FiVolume2 size={16} />
                    {loading ? 'Creating...' : 'Create Announcement'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Message Details Modal */}
        {showMessageModal && selectedMessage && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-lg bg-white">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Message Details</h3>
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">To:</span>
                  <p className="text-sm text-gray-900">{selectedMessage.toName} ({selectedMessage.to})</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Subject:</span>
                  <p className="text-sm text-gray-900">{selectedMessage.subject}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Content:</span>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedMessage.content}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Priority:</span>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedMessage.priority)}`}>
                      {selectedMessage.priority}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Status:</span>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedMessage.status)}`}>
                      {selectedMessage.status}
                    </span>
                  </div>
                </div>
                {selectedMessage.sentAt && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Sent:</span>
                    <p className="text-sm text-gray-900">{new Date(selectedMessage.sentAt).toLocaleString()}</p>
                  </div>
                )}
                {selectedMessage.readAt && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Read:</span>
                    <p className="text-sm text-gray-900">{new Date(selectedMessage.readAt).toLocaleString()}</p>
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

export default Communications;
