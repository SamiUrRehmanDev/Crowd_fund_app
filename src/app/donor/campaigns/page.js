'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  HeartIcon,
  ShareIcon,
  StarIcon,
  ClockIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  TagIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon
} from '@heroicons/react/24/solid';

const CATEGORIES = [
  'All',
  'Medical',
  'Education',
  'Emergency',
  'Community',
  'Environment',
  'Disaster Relief',
  'Children',
  'Elderly Care',
  'Animal Welfare'
];

const URGENCY_LEVELS = [
  'All',
  'Critical',
  'High',
  'Medium',
  'Low'
];

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'urgent', label: 'Most Urgent' },
  { value: 'progress', label: 'Highest Progress' },
  { value: 'amount_high', label: 'Highest Goal' },
  { value: 'amount_low', label: 'Lowest Goal' },
  { value: 'ending_soon', label: 'Ending Soon' }
];

export default function CampaignDiscovery() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  
  // Filter and search states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedUrgency, setSelectedUrgency] = useState(searchParams.get('urgency') || 'All');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'recent');
  const [showFilters, setShowFilters] = useState(false);
  const [minAmount, setMinAmount] = useState(searchParams.get('min_amount') || '');
  const [maxAmount, setMaxAmount] = useState(searchParams.get('max_amount') || '');
  const [fundsRemaining, setFundsRemaining] = useState(searchParams.get('funds_remaining') || '');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user.role !== 'donor') {
      router.push('/auth/signin');
      return;
    }

    fetchCampaigns();
    fetchFavorites();
  }, [session, status, router]);

  useEffect(() => {
    applyFilters();
  }, [campaigns, searchQuery, selectedCategory, selectedUrgency, sortBy, minAmount, maxAmount, fundsRemaining]);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/campaigns');
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.campaigns || []);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/donor/favorites');
      if (response.ok) {
        const data = await response.json();
        setFavorites(new Set(data.favorites?.map(f => f.campaignId) || []));
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...campaigns];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(campaign => 
        campaign.title.toLowerCase().includes(query) ||
        campaign.description.toLowerCase().includes(query) ||
        campaign.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(campaign => campaign.category === selectedCategory);
    }

    // Urgency filter
    if (selectedUrgency !== 'All') {
      filtered = filtered.filter(campaign => campaign.urgency === selectedUrgency);
    }

    // Amount filters
    if (minAmount) {
      filtered = filtered.filter(campaign => campaign.goal >= parseInt(minAmount));
    }
    if (maxAmount) {
      filtered = filtered.filter(campaign => campaign.goal <= parseInt(maxAmount));
    }

    // Funds remaining filter
    if (fundsRemaining) {
      const remaining = parseInt(fundsRemaining);
      filtered = filtered.filter(campaign => {
        const remainingAmount = campaign.goal - campaign.raised;
        return remainingAmount <= remaining;
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.donorCount || 0) - (a.donorCount || 0);
        case 'urgent':
          const urgencyOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
          return (urgencyOrder[b.urgency] || 0) - (urgencyOrder[a.urgency] || 0);
        case 'progress':
          const aProgress = (a.raised / a.goal) * 100;
          const bProgress = (b.raised / b.goal) * 100;
          return bProgress - aProgress;
        case 'amount_high':
          return b.goal - a.goal;
        case 'amount_low':
          return a.goal - b.goal;
        case 'ending_soon':
          return new Date(a.endDate) - new Date(b.endDate);
        case 'recent':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredCampaigns(filtered);
  };

  const toggleFavorite = async (campaignId) => {
    try {
      const response = await fetch('/api/donor/favorites', {
        method: favorites.has(campaignId) ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId })
      });

      if (response.ok) {
        const newFavorites = new Set(favorites);
        if (favorites.has(campaignId)) {
          newFavorites.delete(campaignId);
        } else {
          newFavorites.add(campaignId);
        }
        setFavorites(newFavorites);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const shareCampaign = async (campaign) => {
    const shareData = {
      title: campaign.title,
      text: `Check out this campaign: ${campaign.title}`,
      url: `${window.location.origin}/campaigns/${campaign.id}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(shareData.url);
      // You could show a toast notification here
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedUrgency('All');
    setSortBy('recent');
    setMinAmount('');
    setMaxAmount('');
    setFundsRemaining('');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Campaigns</h1>
          <p className="text-gray-600">Find meaningful causes and make a difference today</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          {/* Search Bar */}
          <div className="relative mb-6">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns by keyword, title, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <TagIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Urgency:</span>
              <select
                value={selectedUrgency}
                onChange={(e) => setSelectedUrgency(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {URGENCY_LEVELS.map(urgency => (
                  <option key={urgency} value={urgency}>{urgency}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">More Filters</span>
            </button>

            {(searchQuery || selectedCategory !== 'All' || selectedUrgency !== 'All' || minAmount || maxAmount || fundsRemaining) && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-200 pt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Goal Amount
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 1000"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Goal Amount
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 10000"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Funds Remaining (Max)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 5000"
                    value={fundsRemaining}
                    onChange={(e) => setFundsRemaining(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {filteredCampaigns.length} of {campaigns.length} campaigns
          </p>
          <div className="flex items-center space-x-4">
            <Link
              href="/donor/favorites"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
            >
              <StarSolidIcon className="h-4 w-4" />
              <span>View Favorites ({favorites.size})</span>
            </Link>
          </div>
        </div>

        {/* Campaign Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              isFavorite={favorites.has(campaign.id)}
              onToggleFavorite={() => toggleFavorite(campaign.id)}
              onShare={() => shareCampaign(campaign)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredCampaigns.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Load More (if implementing pagination) */}
        {filteredCampaigns.length > 0 && filteredCampaigns.length < campaigns.length && (
          <div className="text-center mt-12">
            <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors">
              Load More Campaigns
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Campaign Card Component
function CampaignCard({ campaign, isFavorite, onToggleFavorite, onShare }) {
  const progressPercentage = Math.min((campaign.raised / campaign.goal) * 100, 100);
  const remainingAmount = campaign.goal - campaign.raised;
  const daysLeft = Math.max(0, Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24)));
  
  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Campaign Image */}
      <div className="relative h-48 bg-gray-200">
        {campaign.image ? (
          <img
            src={campaign.image}
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <HeartIcon className="h-16 w-16 text-gray-400" />
          </div>
        )}
        
        {/* Overlay Actions */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={onToggleFavorite}
            className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-colors"
          >
            {isFavorite ? (
              <HeartSolidIcon className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-gray-600" />
            )}
          </button>
          <button
            onClick={onShare}
            className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-colors"
          >
            <ShareIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Urgency Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(campaign.urgency)}`}>
            {campaign.urgency}
          </span>
        </div>
      </div>

      {/* Campaign Content */}
      <div className="p-6">
        {/* Category and Tags */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {campaign.category}
          </span>
          {campaign.tags && campaign.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {campaign.tags.slice(0, 2).map((tag, index) => (
                <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {campaign.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {campaign.description}
        </p>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>${campaign.raised.toLocaleString()} raised</span>
            <span>${campaign.goal.toLocaleString()} goal</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{progressPercentage.toFixed(1)}% funded</span>
            <span>${remainingAmount.toLocaleString()} remaining</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-1">
            <UserGroupIcon className="h-4 w-4" />
            <span>{campaign.donorCount || 0} donors</span>
          </div>
          <div className="flex items-center space-x-1">
            <ClockIcon className="h-4 w-4" />
            <span>{daysLeft} days left</span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href={`/campaigns/${campaign.id}`}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium block"
        >
          View Details & Donate
        </Link>
      </div>
    </motion.div>
  );
}
