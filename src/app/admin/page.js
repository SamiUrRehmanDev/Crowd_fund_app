'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUsers, 
  FiTarget, 
  FiDollarSign, 
  FiTrendingUp,
  FiActivity,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiEdit,
  FiMoreHorizontal
} from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdminAuth } from '../../components/admin/AdminAuthProvider';

const AdminDashboard = () => {
  const { user, hasPermission } = useAdminAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCampaigns: 0,
    totalDonations: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    activeVolunteers: 0,
    completedTasks: 0,
    flaggedContent: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard statistics
      const statsResponse = await fetch('/api/admin/dashboard/stats', {
        credentials: 'include'
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch recent activities
      const activitiesResponse = await fetch('/api/admin/dashboard/activities', {
        credentials: 'include'
      });
      
      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json();
        setRecentActivities(activitiesData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: FiUsers,
      color: 'blue',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Active Campaigns',
      value: stats.totalCampaigns.toLocaleString(),
      icon: FiTarget,
      color: 'green',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: FiDollarSign,
      color: 'yellow',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Pending Reviews',
      value: stats.pendingApprovals.toLocaleString(),
      icon: FiClock,
      color: 'red',
      change: '-5%',
      changeType: 'negative'
    }
  ];

  const quickActions = [
    {
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      href: '/admin/users',
      icon: FiUsers,
      permission: 'user_management'
    },
    {
      title: 'Campaign Approval',
      description: 'Review and approve new campaigns',
      href: '/admin/campaigns',
      icon: FiTarget,
      permission: 'campaign_management'
    },
    {
      title: 'Content Moderation',
      description: 'Review flagged content and reports',
      href: '/admin/moderation',
      icon: FiAlertCircle,
      permission: 'content_moderation'
    },
    {
      title: 'Analytics',
      description: 'View detailed platform analytics',
      href: '/admin/analytics',
      icon: FiTrendingUp,
      permission: 'analytics_view'
    }
  ];

  const filteredQuickActions = quickActions.filter(action => 
    !action.permission || hasPermission(action.permission)
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening on your platform today.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-600">System Status: Healthy</span>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow"
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6 space-y-4">
              {filteredQuickActions.map((action, index) => (
                <motion.a
                  key={action.title}
                  href={action.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
                >
                  <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-blue-100">
                    <action.icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{action.title}</h4>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                  <FiMoreHorizontal className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow"
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
            </div>
            <div className="p-6">
              {recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.slice(0, 5).map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <div className={`p-1 rounded-full ${
                        activity.type === 'success' ? 'bg-green-100' :
                        activity.type === 'warning' ? 'bg-yellow-100' :
                        activity.type === 'error' ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        {activity.type === 'success' ? (
                          <FiCheckCircle className="w-4 h-4 text-green-600" />
                        ) : activity.type === 'warning' ? (
                          <FiAlertCircle className="w-4 h-4 text-yellow-600" />
                        ) : activity.type === 'error' ? (
                          <FiAlertCircle className="w-4 h-4 text-red-600" />
                        ) : (
                          <FiActivity className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiActivity className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activities</h3>
                  <p className="mt-1 text-sm text-gray-500">Activities will appear here as they occur.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow"
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <FiCheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-sm font-medium text-gray-900 mt-2">Database</h4>
                <p className="text-sm text-green-600">Healthy</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <FiCheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-sm font-medium text-gray-900 mt-2">API Services</h4>
                <p className="text-sm text-green-600">Operational</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <FiCheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-sm font-medium text-gray-900 mt-2">Payment Gateway</h4>
                <p className="text-sm text-green-600">Connected</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
