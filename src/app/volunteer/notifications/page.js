'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  HeartIcon,
  AcademicCapIcon,
  HomeIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  TrashIcon,
  EyeIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarDaysIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import {
  BellIcon as BellSolidIcon,
  CheckCircleIcon as CheckCircleSolidIcon
} from '@heroicons/react/24/solid';

const notificationTypes = [
  { id: 'all', name: 'All', icon: BellIcon },
  { id: 'task_match', name: 'Task Matches', icon: CheckCircleIcon, color: 'blue' },
  { id: 'task_update', name: 'Task Updates', icon: InformationCircleIcon, color: 'green' },
  { id: 'verification', name: 'Verifications', icon: ShieldCheckIcon, color: 'purple' },
  { id: 'system', name: 'System', icon: ExclamationTriangleIcon, color: 'red' },
];

const taskIcons = {
  medical: HeartIcon,
  education: AcademicCapIcon,
  housing: HomeIcon,
  verification: ShieldCheckIcon,
  community: UserGroupIcon,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    inApp: true,
    taskMatches: true,
    taskUpdates: true,
    verificationRequests: true,
    systemAlerts: true,
    immediateAlerts: true,
    dailyDigest: false,
  });

  useEffect(() => {
    fetchNotifications();
    fetchNotificationSettings();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/volunteer/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      } else {
        console.error('Failed to fetch notifications:', response.status);
        // Use fallback mock data if API fails
        setNotifications([
          {
            id: 'notif-1',
            type: 'task_match',
            title: 'Welcome to Volunteer Portal',
            message: 'Thank you for joining as a volunteer. Start by updating your availability.',
            taskType: 'system',
            isRead: false,
            createdAt: new Date().toISOString(),
            actionUrl: '/volunteer/availability',
            urgency: 'low'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Use fallback mock data if API fails
      setNotifications([
        {
          id: 'notif-1',
          type: 'task_match',
          title: 'Welcome to Volunteer Portal',
          message: 'Thank you for joining as a volunteer. Start by updating your availability.',
          taskType: 'system',
          isRead: false,
          createdAt: new Date().toISOString(),
          actionUrl: '/volunteer/availability',
          urgency: 'low'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotificationSettings = async () => {
    try {
      const response = await fetch('/api/volunteer/notification-settings');
      if (response.ok) {
        const data = await response.json();
        setNotificationSettings(data.settings || notificationSettings);
      }
    } catch (error) {
      console.error('Error fetching notification settings:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`/api/volunteer/notifications/${notificationId}/read`, {
        method: 'PATCH'
      });
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const dismissNotification = async (notificationId) => {
    try {
      await fetch(`/api/volunteer/notifications/${notificationId}/dismiss`, {
        method: 'DELETE'
      });
      
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  const updateNotificationSettings = async (newSettings) => {
    try {
      await fetch('/api/volunteer/notification-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: newSettings })
      });
      
      setNotificationSettings(newSettings);
    } catch (error) {
      console.error('Error updating notification settings:', error);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesFilter = activeFilter === 'all' || notif.type === activeFilter;
    const matchesSearch = searchQuery === '' || 
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getNotificationIcon = (notification) => {
    if (notification.taskType && taskIcons[notification.taskType]) {
      const IconComponent = taskIcons[notification.taskType];
      return <IconComponent className="w-5 h-5" />;
    }
    
    const typeConfig = notificationTypes.find(t => t.id === notification.type);
    if (typeConfig) {
      const IconComponent = typeConfig.icon;
      return <IconComponent className="w-5 h-5" />;
    }
    
    return <BellIcon className="w-5 h-5" />;
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'urgent': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      default: return 'gray';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <BellSolidIcon className="w-8 h-8 text-purple-600 mr-3" />
                Notifications
              </h1>
              <p className="text-gray-600 mt-1">
                Stay updated with task matches and important alerts
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Cog6ToothIcon className="w-4 h-4 mr-2" />
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Delivery Methods</h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationSettings.email}
                          onChange={(e) => updateNotificationSettings({
                            ...notificationSettings,
                            email: e.target.checked
                          })}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Email notifications</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationSettings.inApp}
                          onChange={(e) => updateNotificationSettings({
                            ...notificationSettings,
                            inApp: e.target.checked
                          })}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">In-app notifications</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Notification Types</h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationSettings.taskMatches}
                          onChange={(e) => updateNotificationSettings({
                            ...notificationSettings,
                            taskMatches: e.target.checked
                          })}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">New task matches</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationSettings.taskUpdates}
                          onChange={(e) => updateNotificationSettings({
                            ...notificationSettings,
                            taskUpdates: e.target.checked
                          })}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Task status updates</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationSettings.verificationRequests}
                          onChange={(e) => updateNotificationSettings({
                            ...notificationSettings,
                            verificationRequests: e.target.checked
                          })}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Verification requests</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex flex-wrap gap-2">
                {notificationTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setActiveFilter(type.id)}
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeFilter === type.id
                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <type.icon className="w-4 h-4 mr-2" />
                    {type.name}
                  </button>
                ))}
              </div>
              
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchQuery ? 'No notifications match your search.' : 'You\'re all caught up!'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`relative p-4 rounded-lg border transition-all cursor-pointer ${
                      notification.isRead 
                        ? 'border-gray-200 bg-white' 
                        : 'border-purple-200 bg-purple-50'
                    }`}
                    onClick={() => {
                      if (!notification.isRead) markAsRead(notification.id);
                      if (notification.actionUrl) window.location.href = notification.actionUrl;
                    }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 p-2 rounded-lg ${
                        notification.isRead ? 'bg-gray-100' : 'bg-purple-100'
                      }`}>
                        {getNotificationIcon(notification)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className={`text-sm font-medium ${
                                notification.isRead ? 'text-gray-900' : 'text-purple-900'
                              }`}>
                                {notification.title}
                              </h3>
                              {notification.urgency && (
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-${getUrgencyColor(notification.urgency)}-100 text-${getUrgencyColor(notification.urgency)}-800`}>
                                  {notification.urgency}
                                </span>
                              )}
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-gray-600">
                              {notification.message}
                            </p>
                            <div className="mt-2 flex items-center text-xs text-gray-500">
                              <ClockIcon className="w-4 h-4 mr-1" />
                              {formatTime(notification.createdAt)}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            {!notification.isRead && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                                className="p-1 text-gray-400 hover:text-purple-600"
                                title="Mark as read"
                              >
                                <CheckCircleIcon className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                dismissNotification(notification.id);
                              }}
                              className="p-1 text-gray-400 hover:text-red-600"
                              title="Dismiss"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <BellSolidIcon className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-500">Total Notifications</p>
                <p className="text-lg font-bold text-gray-900">{notifications.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <CheckCircleSolidIcon className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-500">Read</p>
                <p className="text-lg font-bold text-gray-900">
                  {notifications.filter(n => n.isRead).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 text-orange-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-500">Unread</p>
                <p className="text-lg font-bold text-gray-900">
                  {notifications.filter(n => !n.isRead).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
