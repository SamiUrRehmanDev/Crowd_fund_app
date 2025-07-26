'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  HeartIcon,
  CurrencyDollarIcon,
  TrophyIcon,
  DocumentTextIcon,
  StarIcon,
  PlusCircleIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  UserGroupIcon,
  GiftIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ClockIcon,
  ChartBarIcon,
  BellIcon,
  Cog6ToothIcon,
  ChatBubbleLeftRightIcon,
  HandRaisedIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon
} from '@heroicons/react/24/solid';

export default function DonorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

  // Sidebar menu items
  const menuItems = [
    {
      label: 'Dashboard',
      href: '/donor',
      icon: HomeIcon,
      description: 'Overview and stats'
    },
    {
      label: 'Browse Campaigns',
      href: '/donor/campaigns',
      icon: HeartIcon,
      description: 'Find campaigns to support'
    },
    {
      label: 'My Proposals',
      href: '/donor/proposals',
      icon: DocumentTextIcon,
      description: 'Manage your proposals'
    },
    {
      label: 'My Favorites',
      href: '/donor/favorites',
      icon: StarIcon,
      description: 'Saved campaigns'
    },
    {
      label: 'Donation History',
      href: '/donor/history',
      icon: ClockIcon,
      description: 'View past donations'
    },
    {
      label: 'Download Receipts',
      href: '/donor/receipts',
      icon: DocumentTextIcon,
      description: 'Tax receipts & documents'
    },
    {
      label: 'Analytics',
      href: '/donor/analytics',
      icon: ChartBarIcon,
      description: 'Impact tracking'
    },
    {
      label: 'Notifications',
      href: '/donor/notifications',
      icon: BellIcon,
      description: 'Campaign updates'
    }
  ];

  // Quick action items for the dashboard
  const quickActions = [
    {
      title: 'Browse Campaigns',
      description: 'Find new campaigns to support',
      href: '/donor/campaigns',
      icon: HeartIcon,
      color: 'blue'
    },
    {
      title: 'Submit Proposal',
      description: 'Propose a new campaign idea',
      href: '/donor/proposals/create',
      icon: PlusCircleIcon,
      color: 'green'
    },
    {
      title: 'View Favorites',
      description: 'Check your saved campaigns',
      href: '/donor/favorites',
      icon: StarIcon,
      color: 'yellow'
    },
    {
      title: 'Download Receipts',
      description: 'Get tax-deductible receipts',
      href: '/donor/receipts',
      icon: DocumentTextIcon,
      color: 'purple'
    },
    {
      title: 'Donation History',
      description: 'View your donation timeline',
      href: '/donor/history',
      icon: ClockIcon,
      color: 'indigo'
    },
    {
      title: 'Impact Analytics',
      description: 'See your donation impact',
      href: '/donor/analytics',
      icon: ChartBarIcon,
      color: 'emerald'
    }
  ];

  // Fetch notifications from API
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/donor/notifications');
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notifications.slice(0, 3)); // Show only 3 in dropdown
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (session?.user?.role === 'donor') {
      fetchNotifications();
    }
  }, [session]);

  // Mock notifications for fallback
  const fallbackNotifications = [
    { id: 1, title: 'Campaign update: Emergency Surgery for Maria', timeAgo: '2 hours ago', type: 'info' },
    { id: 2, title: 'Thank you message from School Books project', timeAgo: '1 day ago', type: 'success' },
    { id: 3, title: 'New campaign match: Clean Water Initiative', timeAgo: '2 days ago', type: 'info' }
  ];

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user.role !== 'donor') {
      router.push('/auth/signin');
      return;
    }

    fetchDashboardData();
  }, [session, status, router]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/donor/dashboard');
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    totalDonations: 0,
    campaignsSupported: 0,
    totalAmount: 0,
    impactScore: 0,
    proposalsSubmitted: 0,
    favoriteCampaigns: 0
  };

  const recentDonations = dashboardData?.recentDonations || [];
  const recommendedCampaigns = dashboardData?.recommendedCampaigns || [];
  const favoriteCampaigns = dashboardData?.favoriteCampaigns || [];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:static lg:inset-0"
          >
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">CF</span>
                  </div>
                  <span className="ml-2 text-xl font-semibold text-gray-900">
                    Donor Portal
                  </span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      <div>
                        <div>{item.label}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </Link>
                  );
                })}
              </nav>

              {/* User info */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <UserCircleIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">{session?.user?.name}</p>
                      <p className="text-xs text-gray-500 capitalize">Donor</p>
                    </div>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md"
                    title="Logout"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Bars3Icon className="w-5 h-5" />
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">
                {menuItems.find(item => pathname === item.href)?.label || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                  className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md relative"
                >
                  <BellIcon className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
                <AnimatePresence>
                  {notificationDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-50"
                    >
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {(notifications.length > 0 ? notifications : fallbackNotifications).map((notification) => (
                          <div key={notification.id} className="p-3 hover:bg-gray-50 border-b border-gray-100">
                            <p className="text-sm text-gray-900">{notification.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.timeAgo || notification.time}</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 text-center border-t border-gray-200">
                        <Link
                          href="/donor/notifications"
                          className="text-sm text-blue-600 hover:text-blue-700"
                          onClick={() => setNotificationDropdownOpen(false)}
                        >
                          View all notifications
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile */}
              <Link
                href="/profile"
                className="flex items-center space-x-2 p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md"
              >
                <UserCircleIcon className="w-5 h-5" />
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {session?.user?.name}
                </span>
              </Link>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Welcome back, {session?.user?.name}! 👋
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Thank you for making a difference in the world
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-gray-600">Active Donor</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Donated</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${stats.totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Campaigns Supported</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.campaignsSupported}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <HeartSolidIcon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Impact Score</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.impactScore}</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <TrophyIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Donations</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalDonations}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <GiftIcon className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-sm"
              >
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                </div>
                <div className="p-6 space-y-4">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={action.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <Link
                        href={action.href}
                        className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
                      >
                        <div className={`p-2 rounded-lg bg-${action.color}-100 group-hover:bg-${action.color}-200`}>
                          <action.icon className={`w-5 h-5 text-${action.color}-600`} />
                        </div>
                        <div className="ml-4 flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{action.title}</h4>
                          <p className="text-sm text-gray-500">{action.description}</p>
                        </div>
                        <ArrowTrendingUpIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Recent Activities */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow-sm"
              >
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Donations</h3>
                </div>
                <div className="p-6">
                  {recentDonations.length > 0 ? (
                    <div className="space-y-4">
                      {recentDonations.slice(0, 5).map((donation, index) => (
                        <motion.div
                          key={donation.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="bg-green-100 p-2 rounded-lg">
                              <CurrencyDollarIcon className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{donation.campaignTitle}</p>
                              <p className="text-xs text-gray-500">{donation.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">${donation.amount}</p>
                            <p className="text-xs text-gray-500">{donation.status}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CurrencyDollarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No donations yet</p>
                      <Link 
                        href="/donor/campaigns"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Browse campaigns to get started →
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Recommended Campaigns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                  <ArrowTrendingUpIcon className="h-6 w-6 text-blue-600" />
                  <span>Recommended for You</span>
                </h2>
                <Link 
                  href="/donor/campaigns"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View all →
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedCampaigns.length > 0 ? (
                  recommendedCampaigns.slice(0, 3).map((campaign) => (
                    <CampaignCard key={campaign.id} campaign={campaign} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <HeartIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No recommendations available yet</p>
                    <p className="text-sm text-gray-500">Make your first donation to get personalized recommendations!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Campaign Card Component
function CampaignCard({ campaign }) {
  const progressPercentage = (campaign.raised / campaign.goal) * 100;
  
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 text-sm">{campaign.title}</h3>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          {campaign.category}
        </span>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>${campaign.raised.toLocaleString()} raised</span>
          <span>${campaign.goal.toLocaleString()} goal</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full" 
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">{campaign.daysLeft} days left</span>
        <Link
          href={`/campaigns/${campaign.id}`}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}

// Donation Card Component
function DonationCard({ donation }) {
  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="bg-green-100 p-2 rounded-lg">
          <CurrencyDollarIcon className="h-4 w-4 text-green-600" />
        </div>
        <div>
          <p className="font-medium text-gray-900 text-sm">{donation.campaignTitle}</p>
          <p className="text-xs text-gray-500">{donation.date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-green-600">${donation.amount}</p>
        <p className="text-xs text-gray-500">{donation.status}</p>
      </div>
    </div>
  );
}

// Favorite Campaign Card Component
function FavoriteCampaignCard({ campaign }) {
  return (
    <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <StarSolidIcon className="h-4 w-4 text-yellow-500" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm truncate">{campaign.title}</p>
        <p className="text-xs text-gray-500">{campaign.category}</p>
      </div>
      <Link
        href={`/campaigns/${campaign.id}`}
        className="text-blue-600 hover:text-blue-700 text-xs"
      >
        View →
      </Link>
    </div>
  );
}
