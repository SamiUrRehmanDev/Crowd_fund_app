'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
  UserIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  StarIcon,
  PaperAirplaneIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarSolidIcon
} from '@heroicons/react/24/solid';

const supportCategories = [
  {
    id: 'general',
    name: 'General Support',
    icon: QuestionMarkCircleIcon,
    description: 'General questions about using the platform'
  },
  {
    id: 'technical',
    name: 'Technical Issues',
    icon: ExclamationTriangleIcon,
    description: 'Problems with website functionality or access'
  },
  {
    id: 'request-help',
    name: 'Request Assistance',
    icon: ChatBubbleLeftRightIcon,
    description: 'Help with creating or managing your aid requests'
  },
  {
    id: 'account',
    name: 'Account Management',
    icon: UserIcon,
    description: 'Account settings, privacy, or deactivation'
  },
  {
    id: 'verification',
    name: 'Verification Process',
    icon: ShieldCheckIcon,
    description: 'Questions about the verification process'
  },
  {
    id: 'feedback',
    name: 'Platform Feedback',
    icon: HeartIcon,
    description: 'Share your experience and suggestions'
  }
];

const experienceAreas = [
  { id: 'submission', name: 'Request Submission Process' },
  { id: 'verification', name: 'Verification Experience' },
  { id: 'communication', name: 'Communication with Team' },
  { id: 'tracking', name: 'Request Tracking & Updates' },
  { id: 'support', name: 'Support Team Assistance' },
  { id: 'overall', name: 'Overall Platform Experience' }
];

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState('contact');
  const [contactForm, setContactForm] = useState({
    category: '',
    subject: '',
    message: '',
    priority: 'normal',
    attachments: []
  });
  const [feedbackForm, setFeedbackForm] = useState({
    type: 'feedback',
    ratings: {},
    positiveExperience: '',
    improvements: '',
    recommend: '',
    additionalComments: ''
  });
  const [deactivationForm, setDeactivationForm] = useState({
    reason: '',
    feedback: '',
    dataRetention: 'delete',
    confirmDeactivation: false
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState('');
  const [errors, setErrors] = useState({});

  const submitContactForm = async () => {
    const newErrors = {};
    if (!contactForm.category) newErrors.category = 'Please select a category';
    if (!contactForm.subject.trim()) newErrors.subject = 'Subject is required';
    if (!contactForm.message.trim()) newErrors.message = 'Message is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/donee/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'contact', ...contactForm }),
      });

      if (response.ok) {
        setSubmitted('contact');
        setContactForm({
          category: '',
          subject: '',
          message: '',
          priority: 'normal',
          attachments: []
        });
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const submitFeedback = async () => {
    const newErrors = {};
    if (!feedbackForm.positiveExperience.trim()) {
      newErrors.positiveExperience = 'Please share what you liked';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/donee/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'feedback', ...feedbackForm }),
      });

      if (response.ok) {
        setSubmitted('feedback');
        setFeedbackForm({
          type: 'feedback',
          ratings: {},
          positiveExperience: '',
          improvements: '',
          recommend: '',
          additionalComments: ''
        });
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const submitDeactivation = async () => {
    const newErrors = {};
    if (!deactivationForm.reason) newErrors.reason = 'Please select a reason';
    if (!deactivationForm.confirmDeactivation) {
      newErrors.confirmDeactivation = 'Please confirm account deactivation';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/donee/account/deactivate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deactivationForm),
      });

      if (response.ok) {
        setSubmitted('deactivation');
      }
    } catch (error) {
      console.error('Error submitting deactivation request:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const setRating = (area, rating) => {
    setFeedbackForm(prev => ({
      ...prev,
      ratings: { ...prev.ratings, [area]: rating }
    }));
  };

  const RatingStars = ({ area, rating }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(area, star)}
            className="focus:outline-none"
          >
            {star <= rating ? (
              <StarSolidIcon className="w-6 h-6 text-yellow-400" />
            ) : (
              <StarIcon className="w-6 h-6 text-gray-300 hover:text-yellow-400" />
            )}
          </button>
        ))}
      </div>
    );
  };

  const tabs = [
    { id: 'contact', name: 'Contact Support', icon: ChatBubbleLeftRightIcon },
    { id: 'feedback', name: 'Give Feedback', icon: HeartIcon },
    { id: 'deactivate', name: 'Account Settings', icon: UserIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Support & Feedback</h1>
          <p className="text-gray-600 mt-2">
            We're here to help. Contact our support team or share your feedback.
          </p>
        </div>

        {/* Success Messages */}
        {submitted === 'contact' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <div className="flex items-center">
              <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-800">
                Your support request has been submitted. We'll respond within 24 hours.
              </span>
            </div>
          </motion.div>
        )}

        {submitted === 'feedback' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <div className="flex items-center">
              <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-800">
                Thank you for your feedback! Your input helps us improve our platform.
              </span>
            </div>
          </motion.div>
        )}

        {submitted === 'deactivation' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <div className="flex items-center">
              <InformationCircleIcon className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="text-yellow-800">
                Your account deactivation request has been received. We'll process it within 2-3 business days.
              </span>
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="w-5 h-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Contact Support Tab */}
        {activeTab === 'contact' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Support Team</h2>
            
            <div className="space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What do you need help with? *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {supportCategories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => {
                          setContactForm(prev => ({ ...prev, category: category.id }));
                          setErrors(prev => ({ ...prev, category: null }));
                        }}
                        className={`p-4 text-left border rounded-lg transition-colors ${
                          contactForm.category === category.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <IconComponent className={`w-5 h-5 mt-0.5 ${
                            contactForm.category === category.id ? 'text-blue-600' : 'text-gray-500'
                          }`} />
                          <div>
                            <h3 className={`font-medium ${
                              contactForm.category === category.id ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              {category.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <select
                  value={contactForm.priority}
                  onChange={(e) => setContactForm(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low - General inquiry</option>
                  <option value="normal">Normal - Standard support</option>
                  <option value="high">High - Urgent assistance needed</option>
                  <option value="urgent">Urgent - Critical issue</option>
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => {
                    setContactForm(prev => ({ ...prev, subject: e.target.value }));
                    setErrors(prev => ({ ...prev, subject: null }));
                  }}
                  placeholder="Brief description of your issue or question"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.subject ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.subject && <p className="text-red-600 text-sm mt-1">{errors.subject}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Message *
                </label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => {
                    setContactForm(prev => ({ ...prev, message: e.target.value }));
                    setErrors(prev => ({ ...prev, message: null }));
                  }}
                  placeholder="Please provide as much detail as possible about your issue or question. Include any relevant request IDs or error messages."
                  rows={6}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.message ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message}</p>}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  onClick={submitContactForm}
                  disabled={submitting}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Feedback Tab */}
        {activeTab === 'feedback' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Share Your Feedback</h2>
            
            <div className="space-y-6">
              {/* Experience Ratings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Rate Your Experience</h3>
                <div className="space-y-4">
                  {experienceAreas.map((area) => (
                    <div key={area.id} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{area.name}</span>
                      <RatingStars area={area.id} rating={feedbackForm.ratings[area.id] || 0} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Positive Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What did you like most about our platform? *
                </label>
                <textarea
                  value={feedbackForm.positiveExperience}
                  onChange={(e) => {
                    setFeedbackForm(prev => ({ ...prev, positiveExperience: e.target.value }));
                    setErrors(prev => ({ ...prev, positiveExperience: null }));
                  }}
                  placeholder="Tell us about your positive experiences..."
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.positiveExperience ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.positiveExperience && <p className="text-red-600 text-sm mt-1">{errors.positiveExperience}</p>}
              </div>

              {/* Improvements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What could we improve?
                </label>
                <textarea
                  value={feedbackForm.improvements}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, improvements: e.target.value }))}
                  placeholder="Share your suggestions for improvement..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Recommendation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Would you recommend our platform to others?
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'definitely', label: 'Definitely - I would highly recommend it' },
                    { value: 'probably', label: 'Probably - It was a good experience' },
                    { value: 'maybe', label: 'Maybe - It was okay but has room for improvement' },
                    { value: 'probably-not', label: 'Probably not - I had some concerns' },
                    { value: 'definitely-not', label: 'Definitely not - I would not recommend it' }
                  ].map((option) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="recommend"
                        value={option.value}
                        checked={feedbackForm.recommend === option.value}
                        onChange={(e) => setFeedbackForm(prev => ({ ...prev, recommend: e.target.value }))}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <label className="ml-2 text-sm text-gray-700">{option.label}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Comments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Comments
                </label>
                <textarea
                  value={feedbackForm.additionalComments}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, additionalComments: e.target.value }))}
                  placeholder="Any other feedback or comments..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  onClick={submitFeedback}
                  disabled={submitting}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <HeartIcon className="w-5 h-5 mr-2" />
                      Submit Feedback
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Account Deactivation Tab */}
        {activeTab === 'deactivate' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Deactivation</h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-900">Important Information</h3>
                  <p className="text-sm text-yellow-800 mt-1">
                    Deactivating your account will stop all active aid requests and remove your profile. 
                    This action cannot be easily undone. Please consider contacting support first if you're 
                    experiencing issues.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for deactivation *
                </label>
                <select
                  value={deactivationForm.reason}
                  onChange={(e) => {
                    setDeactivationForm(prev => ({ ...prev, reason: e.target.value }));
                    setErrors(prev => ({ ...prev, reason: null }));
                  }}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.reason ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a reason</option>
                  <option value="goal-achieved">My funding goal was achieved</option>
                  <option value="no-longer-needed">No longer need assistance</option>
                  <option value="privacy-concerns">Privacy concerns</option>
                  <option value="poor-experience">Poor experience with platform</option>
                  <option value="technical-issues">Technical issues</option>
                  <option value="other">Other reason</option>
                </select>
                {errors.reason && <p className="text-red-600 text-sm mt-1">{errors.reason}</p>}
              </div>

              {/* Feedback */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional feedback (optional)
                </label>
                <textarea
                  value={deactivationForm.feedback}
                  onChange={(e) => setDeactivationForm(prev => ({ ...prev, feedback: e.target.value }))}
                  placeholder="Help us improve by sharing your experience..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Data Retention */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data retention preference
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="dataRetention"
                      value="delete"
                      checked={deactivationForm.dataRetention === 'delete'}
                      onChange={(e) => setDeactivationForm(prev => ({ ...prev, dataRetention: e.target.value }))}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Delete all my data (recommended)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="dataRetention"
                      value="anonymize"
                      checked={deactivationForm.dataRetention === 'anonymize'}
                      onChange={(e) => setDeactivationForm(prev => ({ ...prev, dataRetention: e.target.value }))}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Anonymize my data for research purposes
                    </label>
                  </div>
                </div>
              </div>

              {/* Confirmation */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  checked={deactivationForm.confirmDeactivation}
                  onChange={(e) => {
                    setDeactivationForm(prev => ({ ...prev, confirmDeactivation: e.target.checked }));
                    setErrors(prev => ({ ...prev, confirmDeactivation: null }));
                  }}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="ml-2">
                  <label className="text-sm text-gray-700">
                    I understand that deactivating my account will stop all active aid requests and 
                    remove my profile. I confirm that I want to proceed with account deactivation. *
                  </label>
                  {errors.confirmDeactivation && <p className="text-red-600 text-sm mt-1">{errors.confirmDeactivation}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  onClick={submitDeactivation}
                  disabled={submitting}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <UserIcon className="w-5 h-5 mr-2" />
                      Request Deactivation
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
