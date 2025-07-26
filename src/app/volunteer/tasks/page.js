'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  HeartIcon,
  AcademicCapIcon,
  HomeIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarSolidIcon
} from '@heroicons/react/24/solid';

const taskCategories = [
  { id: 'medical', name: 'Medical', icon: HeartIcon, color: 'red' },
  { id: 'education', name: 'Education', icon: AcademicCapIcon, color: 'blue' },
  { id: 'housing', name: 'Housing', icon: HomeIcon, color: 'green' },
  { id: 'verification', name: 'Verification', icon: ShieldCheckIcon, color: 'purple' },
  { id: 'community', name: 'Community', icon: UserGroupIcon, color: 'orange' },
];

export default function TaskDiscoveryPage() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedUrgency, setSelectedUrgency] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [appliedTasks, setAppliedTasks] = useState(new Set());

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchQuery, selectedCategory, selectedUrgency, selectedLocation]);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/volunteer/tasks');
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = tasks;

    // Search filter - enhanced with tags and keywords
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.organization.toLowerCase().includes(query) ||
        task.location.toLowerCase().includes(query) ||
        (task.tags && task.tags.some(tag => tag.toLowerCase().includes(query))) ||
        (task.keywords && task.keywords.some(keyword => keyword.toLowerCase().includes(query))) ||
        (task.skills && task.skills.some(skill => skill.toLowerCase().includes(query)))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(task => task.category === selectedCategory);
    }

    // Urgency filter
    if (selectedUrgency !== 'all') {
      filtered = filtered.filter(task => task.urgency.toLowerCase() === selectedUrgency);
    }

    // Location filter
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(task => task.location.includes(selectedLocation));
    }

    setFilteredTasks(filtered);
  };

  const applyToTask = async (taskId) => {
    try {
      const response = await fetch(`/api/volunteer/tasks/${taskId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setAppliedTasks(new Set([...appliedTasks, taskId]));
        // Show success message
      }
    } catch (error) {
      console.error('Error applying to task:', error);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    const categoryObj = taskCategories.find(cat => cat.id === category);
    return categoryObj ? categoryObj.icon : UserGroupIcon;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Tasks</h1>
          <p className="text-gray-600">Find meaningful volunteer opportunities that match your skills and availability</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tasks by keywords, skills, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Filter Options */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="all">All Categories</option>
                    {taskCategories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                {/* Urgency Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Urgency</label>
                  <select
                    value={selectedUrgency}
                    onChange={(e) => setSelectedUrgency(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="all">All Levels</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="all">All Locations</option>
                    <option value="New York">New York</option>
                    <option value="Los Angeles">Los Angeles</option>
                    <option value="Chicago">Chicago</option>
                    <option value="Houston">Houston</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Showing {filteredTasks.length} of {tasks.length} available tasks
          </p>
        </div>

        {/* Tasks Grid */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTasks.map((task) => {
              const CategoryIcon = getCategoryIcon(task.category);
              const isApplied = appliedTasks.has(task.id);

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <CategoryIcon className="h-8 w-8 text-purple-600" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                          <p className="text-sm text-gray-600">{task.organization}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(task.urgency)}`}>
                        {task.urgency}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 line-clamp-3">{task.description}</p>

                    {/* Task Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPinIcon className="w-4 h-4 mr-2" />
                        {task.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarDaysIcon className="w-4 h-4 mr-2" />
                        {task.deadline}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="w-4 h-4 mr-2" />
                        {task.estimatedHours} hours
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <UserGroupIcon className="w-4 h-4 mr-2" />
                        {task.volunteersNeeded} needed
                      </div>
                    </div>

                    {/* Skills Required */}
                    {task.skillsRequired && task.skillsRequired.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Skills Required:</p>
                        <div className="flex flex-wrap gap-2">
                          {task.skillsRequired.map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {task.tags && task.tags.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {task.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarSolidIcon
                              key={i}
                              className={`h-4 w-4 ${i < task.organizationRating ? 'text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">({task.organizationRating})</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => window.location.href = `/volunteer/tasks/${task.id}`}
                          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                        >
                          View Details
                        </button>
                        
                        <button
                          onClick={() => applyToTask(task.id)}
                          disabled={isApplied}
                          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                            isApplied
                              ? 'bg-green-100 text-green-800 cursor-not-allowed'
                              : 'text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
                          } transition-colors`}
                        >
                          {isApplied ? (
                            <>
                              <CheckCircleIcon className="w-4 h-4 mr-2" />
                              Applied
                            </>
                          ) : (
                            'Apply Now'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        {filteredTasks.length > 0 && filteredTasks.length < tasks.length && (
          <div className="mt-8 text-center">
            <button className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
              Load More Tasks
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
