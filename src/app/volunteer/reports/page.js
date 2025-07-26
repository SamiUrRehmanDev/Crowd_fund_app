'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DocumentTextIcon,
  CameraIcon,
  MapPinIcon,
  CalendarDaysIcon,
  ClockIcon,
  PaperClipIcon,
  PhotoIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

export default function ProgressReportPage() {
  const [activeTask, setActiveTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [report, setReport] = useState({
    taskId: '',
    description: '',
    progressPercentage: 0,
    challenges: '',
    nextSteps: '',
    attachments: [],
    location: null,
    estimatedCompletion: ''
  });
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetchActiveTasks();
    getCurrentLocation();
  }, []);

  const fetchActiveTasks = async () => {
    try {
      const response = await fetch('/api/volunteer/tasks?status=in_progress');
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks || []);
        if (data.tasks && data.tasks.length > 0) {
          setActiveTask(data.tasks[0]);
          setReport(prev => ({ ...prev, taskId: data.tasks[0].id }));
        }
      }
    } catch (error) {
      console.error('Error fetching active tasks:', error);
      // Mock data for development
      const mockTasks = [
        {
          id: 'task-1',
          title: 'Medical Supply Verification',
          description: 'Verify medical supply needs for pediatric patients',
          organization: 'City Medical Center',
          location: 'Downtown District',
          startDate: '2024-01-20',
          estimatedHours: 6,
          progress: 60
        },
        {
          id: 'task-2',
          title: 'Housing Assessment',
          description: 'Assess housing conditions for family relocation',
          organization: 'Housing Authority',
          location: 'North District',
          startDate: '2024-01-18',
          estimatedHours: 4,
          progress: 25
        }
      ];
      setTasks(mockTasks);
      if (mockTasks.length > 0) {
        setActiveTask(mockTasks[0]);
        setReport(prev => ({ ...prev, taskId: mockTasks[0].id }));
      }
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setReport(prev => ({
            ...prev,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            }
          }));
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  };

  const handleFileUpload = (files) => {
    const newAttachments = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));

    setReport(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments]
    }));
  };

  const removeAttachment = (attachmentId) => {
    setReport(prev => ({
      ...prev,
      attachments: prev.attachments.filter(att => att.id !== attachmentId)
    }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const submitReport = async () => {
    if (!activeTask || !report.description) {
      alert('Please select a task and provide a description');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('taskId', report.taskId);
      formData.append('description', report.description);
      formData.append('progressPercentage', report.progressPercentage);
      formData.append('challenges', report.challenges);
      formData.append('nextSteps', report.nextSteps);
      formData.append('estimatedCompletion', report.estimatedCompletion);
      
      if (report.location) {
        formData.append('location', JSON.stringify(report.location));
      }

      report.attachments.forEach((attachment, index) => {
        formData.append(`attachment_${index}`, attachment.file);
      });

      const response = await fetch('/api/volunteer/progress-reports', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('Progress report submitted successfully!');
        // Reset form
        setReport({
          taskId: activeTask.id,
          description: '',
          progressPercentage: 0,
          challenges: '',
          nextSteps: '',
          attachments: [],
          location: report.location, // Keep location
          estimatedCompletion: ''
        });
        // Refresh task data
        fetchActiveTasks();
      } else {
        throw new Error('Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading active tasks...</p>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No active tasks</h3>
            <p className="mt-1 text-sm text-gray-500">
              You need to have active tasks to submit progress reports.
            </p>
            <div className="mt-6">
              <button
                onClick={() => window.location.href = '/volunteer/tasks'}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                Find Tasks
              </button>
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
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <DocumentTextIcon className="w-8 h-8 text-purple-600 mr-3" />
            Submit Progress Report
          </h1>
          <p className="text-gray-600 mt-1">
            Update your task progress with detailed reports and evidence
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Task Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Active Tasks</h2>
              </div>
              <div className="p-6 space-y-4">
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      activeTask?.id === task.id
                        ? 'border-purple-300 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setActiveTask(task);
                      setReport(prev => ({ ...prev, taskId: task.id }));
                    }}
                  >
                    <h3 className="font-medium text-gray-900 text-sm">{task.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">{task.organization}</p>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{task.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${task.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center mt-2 space-x-3 text-xs text-gray-500">
                      <div className="flex items-center">
                        <MapPinIcon className="w-3 h-3 mr-1" />
                        {task.location}
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="w-3 h-3 mr-1" />
                        {task.estimatedHours}h
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Report Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Progress Report: {activeTask?.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1">{activeTask?.organization}</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Progress Percentage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Progress
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={report.progressPercentage}
                      onChange={(e) => setReport(prev => ({ ...prev, progressPercentage: parseInt(e.target.value) }))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm font-medium text-gray-900 min-w-[60px]">
                      {report.progressPercentage}%
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-purple-600 h-3 rounded-full transition-all"
                      style={{ width: `${report.progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Progress Description *
                  </label>
                  <textarea
                    value={report.description}
                    onChange={(e) => setReport(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what you've accomplished, activities completed, and current status..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>

                {/* Challenges */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Challenges Encountered (Optional)
                  </label>
                  <textarea
                    value={report.challenges}
                    onChange={(e) => setReport(prev => ({ ...prev, challenges: e.target.value }))}
                    placeholder="Describe any obstacles, issues, or difficulties faced..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                {/* Next Steps */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Next Steps (Optional)
                  </label>
                  <textarea
                    value={report.nextSteps}
                    onChange={(e) => setReport(prev => ({ ...prev, nextSteps: e.target.value }))}
                    placeholder="Outline planned activities and next actions..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                {/* Estimated Completion */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Completion Date
                  </label>
                  <input
                    type="date"
                    value={report.estimatedCompletion}
                    onChange={(e) => setReport(prev => ({ ...prev, estimatedCompletion: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attachments (Photos, Documents)
                  </label>
                  
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      dragActive 
                        ? 'border-purple-400 bg-purple-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Drop files here or click to upload
                        </span>
                        <input
                          type="file"
                          multiple
                          accept="image/*,.pdf,.doc,.docx"
                          onChange={(e) => handleFileUpload(e.target.files)}
                          className="hidden"
                        />
                      </label>
                      <p className="mt-1 text-xs text-gray-500">
                        PNG, JPG, PDF up to 10MB each
                      </p>
                    </div>
                  </div>

                  {/* Attachment Preview */}
                  {report.attachments.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {report.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {attachment.preview ? (
                              <img 
                                src={attachment.preview} 
                                alt={attachment.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                                <DocumentTextIcon className="w-5 h-5 text-gray-500" />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeAttachment(attachment.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Location Info */}
                {report.location && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-900">Location Captured</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Lat: {report.location.latitude.toFixed(6)}, 
                      Long: {report.location.longitude.toFixed(6)}
                      {report.location.accuracy && ` (±${Math.round(report.location.accuracy)}m)`}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitReport}
                    disabled={submitting || !report.description}
                    className="px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="w-4 h-4 mr-2" />
                        Submit Report
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
