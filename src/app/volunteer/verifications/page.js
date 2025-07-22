'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheckIcon,
  DocumentTextIcon,
  CameraIcon,
  MapPinIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  HomeIcon,
  HeartIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  PaperClipIcon,
  EyeIcon,
  PhotoIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleSolidIcon,
  ShieldCheckIcon as ShieldCheckSolidIcon
} from '@heroicons/react/24/solid';

const verificationTypes = [
  { id: 'medical', name: 'Medical Verification', icon: HeartIcon, color: 'red' },
  { id: 'housing', name: 'Housing Assessment', icon: HomeIcon, color: 'green' },
  { id: 'education', name: 'Education Verification', icon: AcademicCapIcon, color: 'blue' },
  { id: 'family', name: 'Family Situation', icon: UserIcon, color: 'purple' },
];

const urgencyLevels = [
  { id: 'low', name: 'Low', color: 'green', description: '7+ days' },
  { id: 'medium', name: 'Medium', color: 'yellow', description: '3-7 days' },
  { id: 'high', name: 'High', color: 'orange', description: '1-3 days' },
  { id: 'urgent', name: 'Urgent', color: 'red', description: '<24 hours' },
];

export default function VerificationPage() {
  const [activeTab, setActiveTab] = useState('available');
  const [loading, setLoading] = useState(true);
  const [verifications, setVerifications] = useState({
    available: [],
    inProgress: [],
    completed: [],
    submitted: []
  });
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState({
    findings: '',
    recommendations: '',
    verificationStatus: 'verified',
    evidence: [],
    followUpRequired: false,
    additionalNotes: ''
  });

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      const response = await fetch('/api/volunteer/verifications');
      if (response.ok) {
        const data = await response.json();
        setVerifications(data.verifications);
      }
    } catch (error) {
      console.error('Error fetching verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const acceptVerification = async (verificationId) => {
    try {
      const response = await fetch(`/api/volunteer/verifications/${verificationId}/accept`, {
        method: 'POST',
      });
      if (response.ok) {
        fetchVerifications();
      }
    } catch (error) {
      console.error('Error accepting verification:', error);
    }
  };

  const submitReport = async () => {
    try {
      const response = await fetch(`/api/volunteer/verifications/${selectedVerification.id}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
      });
      if (response.ok) {
        setShowReportModal(false);
        setSelectedVerification(null);
        setReportData({
          findings: '',
          recommendations: '',
          verificationStatus: 'verified',
          evidence: [],
          followUpRequired: false,
          additionalNotes: ''
        });
        fetchVerifications();
      }
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  const getUrgencyColor = (urgency) => {
    const level = urgencyLevels.find(l => l.id === urgency);
    return level ? level.color : 'gray';
  };

  const getTypeIcon = (type) => {
    const verType = verificationTypes.find(t => t.id === type);
    return verType ? verType.icon : DocumentTextIcon;
  };

  const tabs = [
    { id: 'available', name: 'Available', count: verifications.available.length },
    { id: 'inProgress', name: 'In Progress', count: verifications.inProgress.length },
    { id: 'submitted', name: 'Submitted', count: verifications.submitted.length },
    { id: 'completed', name: 'Completed', count: verifications.completed.length },
  ];

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
          <h1 className="text-3xl font-bold text-gray-900">Verification & Reporting</h1>
          <p className="text-gray-600 mt-2">Conduct case verifications and submit detailed reports</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
                {tab.count > 0 && (
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === tab.id
                      ? 'bg-purple-100 text-purple-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Verification List */}
        <div className="space-y-6">
          {verifications[activeTab].length === 0 ? (
            <div className="text-center py-12">
              <ShieldCheckIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {tabs.find(t => t.id === activeTab)?.name.toLowerCase()} verifications
              </h3>
              <p className="text-gray-500">
                {activeTab === 'available' 
                  ? 'Check back later for new verification requests'
                  : `You don't have any ${tabs.find(t => t.id === activeTab)?.name.toLowerCase()} verifications`
                }
              </p>
            </div>
          ) : (
            verifications[activeTab].map((verification, index) => {
              const TypeIcon = getTypeIcon(verification.type);
              const urgencyColor = getUrgencyColor(verification.urgency);
              
              return (
                <motion.div
                  key={verification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg bg-${verificationTypes.find(t => t.id === verification.type)?.color || 'gray'}-100`}>
                          <TypeIcon className={`w-6 h-6 text-${verificationTypes.find(t => t.id === verification.type)?.color || 'gray'}-600`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {verification.title}
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${urgencyColor}-100 text-${urgencyColor}-800`}>
                              {verification.urgency}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-4">{verification.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center text-gray-500">
                              <UserIcon className="w-4 h-4 mr-2" />
                              {verification.requesterName}
                            </div>
                            <div className="flex items-center text-gray-500">
                              <MapPinIcon className="w-4 h-4 mr-2" />
                              {verification.location}
                            </div>
                            <div className="flex items-center text-gray-500">
                              <CalendarDaysIcon className="w-4 h-4 mr-2" />
                              {new Date(verification.requestDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-gray-500">
                              <ClockIcon className="w-4 h-4 mr-2" />
                              Est. {verification.estimatedHours}h
                            </div>
                          </div>

                          {verification.requirements && (
                            <div className="mt-4">
                              <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
                              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                {verification.requirements.map((req, idx) => (
                                  <li key={idx}>{req}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {verification.attachments && verification.attachments.length > 0 && (
                            <div className="mt-4">
                              <h4 className="font-medium text-gray-900 mb-2">Attachments:</h4>
                              <div className="flex flex-wrap gap-2">
                                {verification.attachments.map((attachment, idx) => (
                                  <span key={idx} className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-gray-100 text-gray-700">
                                    <PaperClipIcon className="w-4 h-4 mr-1" />
                                    {attachment.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        {activeTab === 'available' && (
                          <button
                            onClick={() => acceptVerification(verification.id)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                          >
                            <ShieldCheckIcon className="w-4 h-4 mr-2" />
                            Accept
                          </button>
                        )}

                        {activeTab === 'inProgress' && (
                          <button
                            onClick={() => {
                              setSelectedVerification(verification);
                              setShowReportModal(true);
                            }}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <DocumentTextIcon className="w-4 h-4 mr-2" />
                            Submit Report
                          </button>
                        )}

                        {(activeTab === 'submitted' || activeTab === 'completed') && (
                          <button
                            onClick={() => setSelectedVerification(verification)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                          >
                            <EyeIcon className="w-4 h-4 mr-2" />
                            View Details
                          </button>
                        )}
                      </div>
                    </div>

                    {verification.status && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Status:</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            verification.status === 'verified' 
                              ? 'bg-green-100 text-green-800'
                              : verification.status === 'pending-review'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {verification.status.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Report Modal */}
        {showReportModal && selectedVerification && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Submit Verification Report
                </h3>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Case Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Case: {selectedVerification.title}</h4>
                  <p className="text-sm text-gray-600">{selectedVerification.description}</p>
                </div>

                {/* Verification Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Status *
                  </label>
                  <select
                    value={reportData.verificationStatus}
                    onChange={(e) => setReportData(prev => ({ ...prev, verificationStatus: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="verified">Verified - Information confirmed</option>
                    <option value="partially-verified">Partially Verified - Some concerns</option>
                    <option value="not-verified">Not Verified - Information disputed</option>
                    <option value="requires-follow-up">Requires Follow-up - Need more information</option>
                  </select>
                </div>

                {/* Findings */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Findings *
                  </label>
                  <textarea
                    value={reportData.findings}
                    onChange={(e) => setReportData(prev => ({ ...prev, findings: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Describe what you observed during the verification..."
                  />
                </div>

                {/* Recommendations */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recommendations
                  </label>
                  <textarea
                    value={reportData.recommendations}
                    onChange={(e) => setReportData(prev => ({ ...prev, recommendations: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Provide recommendations for next steps..."
                  />
                </div>

                {/* Evidence Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Evidence & Documentation
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <PhotoIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 mb-2">Upload photos, documents, or other evidence</p>
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      <CameraIcon className="w-4 h-4 mr-2" />
                      Choose Files
                    </button>
                  </div>
                </div>

                {/* Follow-up Required */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={reportData.followUpRequired}
                    onChange={(e) => setReportData(prev => ({ ...prev, followUpRequired: e.target.checked }))}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Follow-up verification required
                  </label>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={reportData.additionalNotes}
                    onChange={(e) => setReportData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Any additional observations or notes..."
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitReport}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                  >
                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                    Submit Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {selectedVerification && !showReportModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-3xl shadow-lg rounded-md bg-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Verification Details
                </h3>
                <button
                  onClick={() => setSelectedVerification(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Case Info */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{selectedVerification.title}</h4>
                  <p className="text-gray-600">{selectedVerification.description}</p>
                </div>

                {/* Report Details */}
                {selectedVerification.report && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-2">Verification Status</h5>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedVerification.report.status === 'verified' 
                          ? 'bg-green-100 text-green-800'
                          : selectedVerification.report.status === 'partially-verified'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedVerification.report.status.replace('-', ' ')}
                      </span>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Findings</h5>
                      <p className="text-gray-600">{selectedVerification.report.findings}</p>
                    </div>

                    {selectedVerification.report.recommendations && (
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Recommendations</h5>
                        <p className="text-gray-600">{selectedVerification.report.recommendations}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
