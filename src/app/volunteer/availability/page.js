'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  HeartIcon,
  CheckCircleIcon,
  XMarkIcon,
  PlusIcon,
  AcademicCapIcon,
  HomeIcon,
  ShieldCheckIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleSolidIcon
} from '@heroicons/react/24/solid';

const daysOfWeek = [
  { id: 'monday', name: 'Monday', short: 'Mon' },
  { id: 'tuesday', name: 'Tuesday', short: 'Tue' },
  { id: 'wednesday', name: 'Wednesday', short: 'Wed' },
  { id: 'thursday', name: 'Thursday', short: 'Thu' },
  { id: 'friday', name: 'Friday', short: 'Fri' },
  { id: 'saturday', name: 'Saturday', short: 'Sat' },
  { id: 'sunday', name: 'Sunday', short: 'Sun' },
];

const timeSlots = [
  { id: 'morning', name: 'Morning (6AM - 12PM)', value: 'morning' },
  { id: 'afternoon', name: 'Afternoon (12PM - 6PM)', value: 'afternoon' },
  { id: 'evening', name: 'Evening (6PM - 10PM)', value: 'evening' },
  { id: 'night', name: 'Night (10PM - 6AM)', value: 'night' },
];

const taskTypes = [
  { id: 'medical', name: 'Medical Assistance', icon: HeartIcon, color: 'red' },
  { id: 'education', name: 'Education Support', icon: AcademicCapIcon, color: 'blue' },
  { id: 'housing', name: 'Housing & Shelter', icon: HomeIcon, color: 'green' },
  { id: 'verification', name: 'Case Verification', icon: ShieldCheckIcon, color: 'purple' },
  { id: 'community', name: 'Community Events', icon: UserGroupIcon, color: 'orange' },
];

export default function AvailabilityPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    isActive: true,
    availability: {},
    preferredTaskTypes: [],
    maxHoursPerWeek: 10,
    travelRadius: 25,
    preferredLocations: [],
    specialSkills: [],
    languages: [],
    notifications: {
      email: true,
      sms: false,
      push: true,
    }
  });
  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/volunteer/preferences');
      if (response.ok) {
        const data = await response.json();
        setPreferences(prev => ({ ...prev, ...data.preferences }));
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/volunteer/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        setSavedMessage('Preferences saved successfully!');
        setTimeout(() => setSavedMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateAvailability = (day, timeSlot, available) => {
    setPreferences(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [timeSlot]: available
        }
      }
    }));
  };

  const toggleTaskType = (taskTypeId) => {
    setPreferences(prev => ({
      ...prev,
      preferredTaskTypes: prev.preferredTaskTypes.includes(taskTypeId)
        ? prev.preferredTaskTypes.filter(id => id !== taskTypeId)
        : [...prev.preferredTaskTypes, taskTypeId]
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !preferences.specialSkills.includes(newSkill.trim())) {
      setPreferences(prev => ({
        ...prev,
        specialSkills: [...prev.specialSkills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setPreferences(prev => ({
      ...prev,
      specialSkills: prev.specialSkills.filter(s => s !== skill)
    }));
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !preferences.languages.includes(newLanguage.trim())) {
      setPreferences(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (language) => {
    setPreferences(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== language)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Availability & Preferences</h1>
          <p className="text-gray-600 mt-2">Manage your volunteer schedule and preferences to receive relevant task notifications</p>
        </div>

        {/* Success Message */}
        {savedMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <div className="flex items-center">
              <CheckCircleSolidIcon className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-800">{savedMessage}</span>
            </div>
          </motion.div>
        )}

        <div className="space-y-8">
          {/* Active Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Volunteer Status</h2>
                <p className="text-gray-600">Control whether you receive new task notifications</p>
              </div>
              <button
                onClick={() => setPreferences(prev => ({ ...prev, isActive: !prev.isActive }))}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                  preferences.isActive ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    preferences.isActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <div className="mt-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                preferences.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {preferences.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          {/* Weekly Availability */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Availability</h2>
            <p className="text-gray-600 mb-6">Select your available days and time slots</p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-4 font-medium text-gray-700">Day</th>
                    {timeSlots.map(slot => (
                      <th key={slot.id} className="text-center py-2 px-2 font-medium text-gray-700 text-sm">
                        {slot.name.split(' ')[0]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {daysOfWeek.map(day => (
                    <tr key={day.id}>
                      <td className="py-3 px-4 font-medium text-gray-900">{day.name}</td>
                      {timeSlots.map(slot => {
                        const isAvailable = preferences.availability[day.id]?.[slot.value] || false;
                        return (
                          <td key={slot.id} className="text-center py-3 px-2">
                            <button
                              onClick={() => updateAvailability(day.id, slot.value, !isAvailable)}
                              className={`w-8 h-8 rounded-full border-2 transition-colors ${
                                isAvailable
                                  ? 'bg-purple-600 border-purple-600'
                                  : 'bg-white border-gray-300 hover:border-purple-300'
                              }`}
                            >
                              {isAvailable && (
                                <CheckCircleIcon className="w-4 h-4 text-white mx-auto" />
                              )}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Preferred Task Types */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferred Task Types</h2>
            <p className="text-gray-600 mb-6">Choose the types of volunteer work you're interested in</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {taskTypes.map(taskType => {
                const isSelected = preferences.preferredTaskTypes.includes(taskType.id);
                const IconComponent = taskType.icon;
                
                return (
                  <motion.button
                    key={taskType.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleTaskType(taskType.id)}
                    className={`p-4 rounded-lg border-2 transition-colors text-left ${
                      isSelected
                        ? `border-${taskType.color}-500 bg-${taskType.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <IconComponent className={`w-6 h-6 mr-3 ${
                        isSelected ? `text-${taskType.color}-600` : 'text-gray-500'
                      }`} />
                      <div>
                        <h3 className={`font-medium ${
                          isSelected ? `text-${taskType.color}-900` : 'text-gray-900'
                        }`}>
                          {taskType.name}
                        </h3>
                      </div>
                      {isSelected && (
                        <CheckCircleSolidIcon className={`w-5 h-5 ml-auto text-${taskType.color}-600`} />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Time & Location Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Time Commitment</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum hours per week
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    value={preferences.maxHoursPerWeek}
                    onChange={(e) => setPreferences(prev => ({ ...prev, maxHoursPerWeek: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>1 hour</span>
                    <span className="font-medium text-purple-600">{preferences.maxHoursPerWeek} hours</span>
                    <span>40 hours</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Travel Preferences</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Travel radius (miles)
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={preferences.travelRadius}
                    onChange={(e) => setPreferences(prev => ({ ...prev, travelRadius: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>5 miles</span>
                    <span className="font-medium text-purple-600">{preferences.travelRadius} miles</span>
                    <span>100+ miles</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills & Languages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Special Skills</h2>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    placeholder="Add a skill (e.g., Medical training, Translation)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                  <button
                    onClick={addSkill}
                    className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                  >
                    <PlusIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {preferences.specialSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-purple-600 hover:text-purple-800"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Languages</h2>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
                    placeholder="Add a language (e.g., Spanish, Mandarin)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                  <button
                    onClick={addLanguage}
                    className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                  >
                    <PlusIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {preferences.languages.map((language, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {language}
                      <button
                        onClick={() => removeLanguage(language)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h2>
            <div className="space-y-4">
              {Object.entries(preferences.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 capitalize">
                      {key === 'sms' ? 'SMS' : key} Notifications
                    </h3>
                    <p className="text-sm text-gray-500">
                      Receive notifications via {key === 'sms' ? 'text message' : key}
                    </p>
                  </div>
                  <button
                    onClick={() => setPreferences(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, [key]: !value }
                    }))}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                      value ? 'bg-purple-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        value ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={savePreferences}
              disabled={saving}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  Save Preferences
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
