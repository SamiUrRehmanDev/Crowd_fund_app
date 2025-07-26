'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  InboxIcon,
  PaperAirplaneIcon,
  BellIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  HeartIcon,
  AcademicCapIcon,
  HomeIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import {
  BellIcon as BellSolidIcon,
  ChatBubbleLeftRightIcon as ChatSolidIcon
} from '@heroicons/react/24/solid';

const messageTypes = [
  { id: 'all', name: 'All Messages', icon: InboxIcon },
  { id: 'organizations', name: 'Organizations', icon: UserGroupIcon },
  { id: 'volunteers', name: 'Volunteers', icon: ChatBubbleLeftRightIcon },
  { id: 'system', name: 'System', icon: BellIcon },
];

const notificationTypes = [
  { id: 'task', name: 'New Task Available', icon: CheckCircleIcon, color: 'blue' },
  { id: 'verification', name: 'Verification Request', icon: ShieldCheckIcon, color: 'purple' },
  { id: 'message', name: 'New Message', icon: ChatBubbleLeftRightIcon, color: 'green' },
  { id: 'update', name: 'Status Update', icon: InformationCircleIcon, color: 'yellow' },
  { id: 'urgent', name: 'Urgent Alert', icon: ExclamationTriangleIcon, color: 'red' },
];

const taskIcons = {
  medical: HeartIcon,
  education: AcademicCapIcon,
  housing: HomeIcon,
  verification: ShieldCheckIcon,
  community: UserGroupIcon,
};

export default function CommunicationPage() {
  const [activeTab, setActiveTab] = useState('messages');
  const [selectedMessageType, setSelectedMessageType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState({
    recipient: '',
    subject: '',
    content: '',
    type: 'general'
  });
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    sms: false,
    taskUpdates: true,
    newMessages: true,
    verificationRequests: true,
    systemAlerts: true,
    weeklyDigest: true
  });
  const [creatingData, setCreatingData] = useState(false);

  useEffect(() => {
    fetchCommunicationData();
  }, []);

  const createSampleData = async () => {
    setCreatingData(true);
    try {
      const response = await fetch('/api/volunteer/create-sample-data', {
        method: 'POST'
      });
      
      if (response.ok) {
        // Refresh data after creating samples
        await fetchCommunicationData();
      } else {
        console.error('Failed to create sample data');
      }
    } catch (error) {
      console.error('Error creating sample data:', error);
    } finally {
      setCreatingData(false);
    }
  };

  const fetchCommunicationData = async () => {
    try {
      const [messagesRes, notificationsRes, settingsRes] = await Promise.all([
        fetch('/api/volunteer/messages'),
        fetch('/api/volunteer/notifications'),
        fetch('/api/volunteer/notification-settings')
      ]);

      if (messagesRes.ok) {
        const messagesData = await messagesRes.json();
        setMessages(messagesData.messages || []);
      }

      if (notificationsRes.ok) {
        const notificationsData = await notificationsRes.json();
        setNotifications(notificationsData.notifications || []);
      }

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setNotificationSettings(settingsData.settings || notificationSettings);
      }
    } catch (error) {
      console.error('Error fetching communication data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    try {
      const response = await fetch('/api/volunteer/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage),
      });

      if (response.ok) {
        setShowCompose(false);
        setNewMessage({ recipient: '', subject: '', content: '', type: 'general' });
        fetchCommunicationData();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await fetch(`/api/volunteer/messages/${messageId}/read`, {
        method: 'POST',
      });
      fetchCommunicationData();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const dismissNotification = async (notificationId) => {
    try {
      await fetch(`/api/volunteer/notifications/${notificationId}/dismiss`, {
        method: 'POST',
      });
      fetchCommunicationData();
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  const saveNotificationSettings = async () => {
    try {
      await fetch('/api/volunteer/notification-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationSettings),
      });
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesType = selectedMessageType === 'all' || message.type === selectedMessageType;
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.sender.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getNotificationIcon = (type) => {
    const notType = notificationTypes.find(t => t.id === type);
    return notType ? notType.icon : BellIcon;
  };

  const getNotificationColor = (type) => {
    const notType = notificationTypes.find(t => t.id === type);
    return notType ? notType.color : 'gray';
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Communication & Notifications</h1>
          <p className="text-gray-600 mt-2">Stay connected with organizations, fellow volunteers, and receive important updates</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('messages')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'messages'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5 inline-block mr-2" />
              Messages
              {messages.filter(m => !m.read).length > 0 && (
                <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">
                  {messages.filter(m => !m.read).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'notifications'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BellIcon className="w-5 h-5 inline-block mr-2" />
              Notifications
              {notifications.filter(n => !n.dismissed).length > 0 && (
                <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">
                  {notifications.filter(n => !n.dismissed).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BellIcon className="w-5 h-5 inline-block mr-2" />
              Settings
            </button>
          </nav>
        </div>

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Compose Button */}
              <button
                onClick={() => setShowCompose(true)}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <PaperAirplaneIcon className="w-4 h-4 mr-2" />
                Compose
              </button>

              {/* Message Types */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-medium text-gray-900 mb-3">Message Types</h3>
                <nav className="space-y-1">
                  {messageTypes.map((type) => {
                    const IconComponent = type.icon;
                    const count = type.id === 'all' 
                      ? messages.length 
                      : messages.filter(m => m.type === type.id).length;
                    
                    return (
                      <button
                        key={type.id}
                        onClick={() => setSelectedMessageType(type.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md ${
                          selectedMessageType === type.id
                            ? 'bg-purple-100 text-purple-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center">
                          <IconComponent className="w-4 h-4 mr-3" />
                          {type.name}
                        </div>
                        {count > 0 && (
                          <span className={`py-0.5 px-2 rounded-full text-xs ${
                            selectedMessageType === type.id
                              ? 'bg-purple-200 text-purple-800'
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Messages List */}
            <div className="lg:col-span-3 space-y-6">
              {/* Search */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search messages..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Messages */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {filteredMessages.length === 0 ? (
                  <div className="text-center py-12">
                    <InboxIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm ? 'Try adjusting your search terms' : 'You don\'t have any messages yet'}
                    </p>
                    {!searchTerm && messages.length === 0 && (
                      <button
                        onClick={createSampleData}
                        disabled={creatingData}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                      >
                        {creatingData ? 'Creating...' : 'Create Sample Messages'}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredMessages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => {
                          setSelectedConversation(message);
                          if (!message.read) markAsRead(message.id);
                        }}
                        className={`p-4 hover:bg-gray-50 cursor-pointer ${
                          !message.read ? 'bg-purple-50 border-l-4 border-l-purple-500' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className={`text-sm ${!message.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                                {message.sender}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {new Date(message.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <p className={`text-sm mt-1 ${!message.read ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                              {message.subject}
                            </p>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {message.preview}
                            </p>
                          </div>
                          {!message.read && (
                            <div className="w-2 h-2 bg-purple-600 rounded-full ml-2"></div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <BellIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                <p className="text-gray-500">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification, index) => {
                  const IconComponent = getNotificationIcon(notification.type);
                  const color = getNotificationColor(notification.type);
                  
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg bg-${color}-100`}>
                            <IconComponent className={`w-5 h-5 text-${color}-600`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(notification.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => dismissNotification(notification.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-4">Delivery Methods</h3>
                  <div className="space-y-4">
                    {['email', 'push', 'sms'].map((method) => (
                      <div key={method} className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 capitalize">
                            {method === 'sms' ? 'SMS' : method} Notifications
                          </h4>
                          <p className="text-sm text-gray-500">
                            Receive notifications via {method === 'sms' ? 'text message' : method}
                          </p>
                        </div>
                        <button
                          onClick={() => setNotificationSettings(prev => ({
                            ...prev,
                            [method]: !prev[method]
                          }))}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                            notificationSettings[method] ? 'bg-purple-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              notificationSettings[method] ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-base font-medium text-gray-900 mb-4">Notification Types</h3>
                  <div className="space-y-4">
                    {['taskUpdates', 'newMessages', 'verificationRequests', 'systemAlerts', 'weeklyDigest'].map((type) => (
                      <div key={type} className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">
                            {type === 'taskUpdates' && 'Task Updates'}
                            {type === 'newMessages' && 'New Messages'}
                            {type === 'verificationRequests' && 'Verification Requests'}
                            {type === 'systemAlerts' && 'System Alerts'}
                            {type === 'weeklyDigest' && 'Weekly Digest'}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {type === 'taskUpdates' && 'Updates about your volunteer tasks'}
                            {type === 'newMessages' && 'When someone sends you a message'}
                            {type === 'verificationRequests' && 'New verification assignments'}
                            {type === 'systemAlerts' && 'Important system announcements'}
                            {type === 'weeklyDigest' && 'Weekly summary of activities'}
                          </p>
                        </div>
                        <button
                          onClick={() => setNotificationSettings(prev => ({
                            ...prev,
                            [type]: !prev[type]
                          }))}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                            notificationSettings[type] ? 'bg-purple-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              notificationSettings[type] ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <button
                    onClick={saveNotificationSettings}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Compose Modal */}
        {showCompose && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Compose Message</h3>
                <button
                  onClick={() => setShowCompose(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <input
                    type="text"
                    value={newMessage.recipient}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, recipient: e.target.value }))}
                    placeholder="Enter recipient name or email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Enter subject"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    value={newMessage.content}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                    rows={6}
                    placeholder="Type your message..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowCompose(false)}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendMessage}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                  >
                    <PaperAirplaneIcon className="w-4 h-4 mr-2" />
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Conversation Modal */}
        {selectedConversation && !showCompose && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-3xl shadow-lg rounded-md bg-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedConversation.subject}</h3>
                  <p className="text-sm text-gray-500">From: {selectedConversation.sender}</p>
                </div>
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{selectedConversation.content}</p>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setNewMessage({
                        recipient: selectedConversation.sender,
                        subject: `Re: ${selectedConversation.subject}`,
                        content: '',
                        type: 'general'
                      });
                      setSelectedConversation(null);
                      setShowCompose(true);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                  >
                    <PaperAirplaneIcon className="w-4 h-4 mr-2" />
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
