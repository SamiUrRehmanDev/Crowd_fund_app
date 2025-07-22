'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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
  GiftIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon
} from '@heroicons/react/24/solid';

export default function DonorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user.role !== 'DONOR') {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {session?.user?.name}! 👋
              </h1>
              <p className="text-gray-600 mt-2">
                Thank you for making a difference in the world
              </p>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/donor/campaigns"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <HeartIcon className="h-5 w-5" />
                <span>Browse Campaigns</span>
              </Link>
              <Link
                href="/donor/proposals/new"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <PlusCircleIcon className="h-5 w-5" />
                <span>Propose Case</span>
              </Link>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recommended Campaigns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
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
              
              <div className="space-y-4">
                {recommendedCampaigns.length > 0 ? (
                  recommendedCampaigns.slice(0, 3).map((campaign) => (
                    <CampaignCard key={campaign.id} campaign={campaign} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <HeartIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No recommendations available yet</p>
                    <p className="text-sm text-gray-500">Make your first donation to get personalized recommendations!</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recent Donations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                  <CalendarIcon className="h-6 w-6 text-green-600" />
                  <span>Recent Donations</span>
                </h2>
                <Link 
                  href="/donor/history"
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  View history →
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentDonations.length > 0 ? (
                  recentDonations.slice(0, 5).map((donation) => (
                    <DonationCard key={donation.id} donation={donation} />
                  ))
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

          {/* Right Column */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-4">
                <Link
                  href="/donor/campaigns"
                  className="w-full bg-blue-50 hover:bg-blue-100 p-4 rounded-lg transition-colors flex items-center space-x-3"
                >
                  <HeartIcon className="h-6 w-6 text-blue-600" />
                  <span className="font-medium text-blue-900">Browse Campaigns</span>
                </Link>
                
                <Link
                  href="/donor/favorites"
                  className="w-full bg-yellow-50 hover:bg-yellow-100 p-4 rounded-lg transition-colors flex items-center space-x-3"
                >
                  <StarSolidIcon className="h-6 w-6 text-yellow-600" />
                  <span className="font-medium text-yellow-900">My Favorites</span>
                </Link>
                
                <Link
                  href="/donor/proposals"
                  className="w-full bg-green-50 hover:bg-green-100 p-4 rounded-lg transition-colors flex items-center space-x-3"
                >
                  <DocumentTextIcon className="h-6 w-6 text-green-600" />
                  <span className="font-medium text-green-900">My Proposals</span>
                </Link>
                
                <Link
                  href="/donor/receipts"
                  className="w-full bg-purple-50 hover:bg-purple-100 p-4 rounded-lg transition-colors flex items-center space-x-3"
                >
                  <DocumentTextIcon className="h-6 w-6 text-purple-600" />
                  <span className="font-medium text-purple-900">Download Receipts</span>
                </Link>
              </div>
            </motion.div>

            {/* Favorite Campaigns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                  <StarSolidIcon className="h-6 w-6 text-yellow-600" />
                  <span>Favorites</span>
                </h2>
                <span className="text-sm text-gray-500">{stats.favoriteCampaigns} saved</span>
              </div>
              
              <div className="space-y-3">
                {favoriteCampaigns.length > 0 ? (
                  favoriteCampaigns.slice(0, 3).map((campaign) => (
                    <FavoriteCampaignCard key={campaign.id} campaign={campaign} />
                  ))
                ) : (
                  <div className="text-center py-6">
                    <StarIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 text-sm">No favorites yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
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
