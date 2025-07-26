'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  StarIcon,
  HeartIcon,
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarSolidIcon,
  HeartIcon as HeartSolidIcon
} from '@heroicons/react/24/solid';

export default function DonorFavorites() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user.role !== 'donor') {
      router.push('/auth/signin');
      return;
    }

    fetchFavorites();
  }, [session, status, router]);

  const fetchFavorites = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockFavorites = [
        {
          id: 'camp-1',
          title: 'Emergency Surgery for Maria',
          description: 'Help save a young mother who needs urgent medical care. Maria is a 28-year-old mother of two who was diagnosed with a rare heart condition...',
          category: 'Medical',
          goal: 25000,
          raised: 18750,
          daysLeft: 12,
          image: '/images/campaigns/medical1.jpg',
          location: 'San Francisco, CA',
          supporters: 167,
          addedDate: '2024-07-20',
          urgency: 'High'
        },
        {
          id: 'camp-2',
          title: 'School Books for Rural Children',
          description: 'Providing educational resources to children in underserved rural communities. Every child deserves access to quality education...',
          category: 'Education',
          goal: 8000,
          raised: 5200,
          daysLeft: 25,
          image: '/images/campaigns/education1.jpg',
          location: 'Rural Arkansas',
          supporters: 89,
          addedDate: '2024-07-18',
          urgency: 'Medium'
        },
        {
          id: 'camp-3',
          title: 'Community Garden Project',
          description: 'Building a sustainable community garden to provide fresh produce for local families in need...',
          category: 'Community',
          goal: 12000,
          raised: 9600,
          daysLeft: 8,
          image: '/images/campaigns/community1.jpg',
          location: 'Detroit, MI',
          supporters: 142,
          addedDate: '2024-07-15',
          urgency: 'Low'
        }
      ];
      
      setFavorites(mockFavorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFavorite = async (campaignId) => {
    setRemovingId(campaignId);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove from local state
      setFavorites(prevFavorites => 
        prevFavorites.filter(fav => fav.id !== campaignId)
      );
    } catch (error) {
      console.error('Error removing favorite:', error);
    } finally {
      setRemovingId(null);
    }
  };

  const getProgressPercentage = (raised, goal) => {
    return (raised / goal) * 100;
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <StarSolidIcon className="h-8 w-8 text-yellow-500" />
                <span>My Favorites</span>
              </h1>
              <p className="text-gray-600 mt-2">
                Campaigns you've saved to support later
              </p>
            </div>
            <Link
              href="/donor/campaigns"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <HeartIcon className="h-5 w-5" />
              <span>Browse More Campaigns</span>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{favorites.length}</p>
              <p className="text-sm text-gray-600">Saved Campaigns</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                ${favorites.reduce((sum, fav) => sum + fav.raised, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total Raised</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {favorites.reduce((sum, fav) => sum + fav.supporters, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Supporters</p>
            </div>
          </motion.div>
        </div>

        {/* Favorites List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Saved Campaigns</h2>
            
            {favorites.length > 0 ? (
              <div className="space-y-6">
                {favorites.map((campaign) => (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Campaign Image */}
                      <div className="w-full lg:w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                        <HeartSolidIcon className="h-16 w-16 text-gray-400" />
                      </div>
                      
                      {/* Campaign Details */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {campaign.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {campaign.category}
                              </span>
                              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(campaign.urgency)}`}>
                                {campaign.urgency} Priority
                              </span>
                              <span className="inline-flex items-center text-sm text-gray-500">
                                <MapPinIcon className="h-4 w-4 mr-1" />
                                {campaign.location}
                              </span>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/campaigns/${campaign.id}`}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                            >
                              <EyeIcon className="h-4 w-4" />
                              <span className="hidden sm:inline">View</span>
                            </Link>
                            <button
                              onClick={() => removeFavorite(campaign.id)}
                              disabled={removingId === campaign.id}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                            >
                              {removingId === campaign.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                              ) : (
                                <TrashIcon className="h-4 w-4" />
                              )}
                              <span className="hidden sm:inline">Remove</span>
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {campaign.description}
                        </p>
                        
                        {/* Progress */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>${campaign.raised.toLocaleString()} raised</span>
                            <span>Goal: ${campaign.goal.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300" 
                              style={{ width: `${Math.min(getProgressPercentage(campaign.raised, campaign.goal), 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        {/* Footer Stats */}
                        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <UserGroupIcon className="h-4 w-4" />
                              {campaign.supporters} supporters
                            </span>
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4" />
                              {campaign.daysLeft} days left
                            </span>
                          </div>
                          <span className="text-xs">
                            Added on {new Date(campaign.addedDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <StarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
                <p className="text-gray-600 mb-6">
                  Start exploring campaigns and save the ones you want to support!
                </p>
                <Link
                  href="/donor/campaigns"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <HeartIcon className="h-5 w-5" />
                  Browse Campaigns
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <Link
            href="/donor"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
