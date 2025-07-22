'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  DocumentTextIcon,
  PhotoIcon,
  PaperClipIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  InformationCircleIcon,
  HeartIcon,
  AcademicCapIcon,
  HomeIcon,
  BanknotesIcon,
  UserGroupIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';

const categories = [
  { id: 'medical', name: 'Medical & Healthcare', icon: HeartIcon, description: 'Medical treatments, surgeries, medications, equipment' },
  { id: 'education', name: 'Education', icon: AcademicCapIcon, description: 'School fees, supplies, educational resources' },
  { id: 'housing', name: 'Housing & Shelter', icon: HomeIcon, description: 'Rent, utilities, home repairs, emergency housing' },
  { id: 'emergency', name: 'Emergency Relief', icon: ExclamationTriangleIcon, description: 'Natural disasters, accidents, urgent situations' },
  { id: 'business', name: 'Small Business', icon: BanknotesIcon, description: 'Business startup, equipment, inventory' },
  { id: 'family', name: 'Family Support', icon: UserGroupIcon, description: 'Child care, family expenses, basic necessities' }
];

const urgencyLevels = [
  { id: 'low', name: 'Standard (30+ days)', description: 'No immediate deadline, flexible timeline' },
  { id: 'medium', name: 'Moderate (2-4 weeks)', description: 'Important but not urgent, planned expenses' },
  { id: 'high', name: 'High Priority (1-2 weeks)', description: 'Time-sensitive, important deadline' },
  { id: 'urgent', name: 'Emergency (Within days)', description: 'Critical situation requiring immediate assistance' }
];

const documentTypes = [
  { id: 'identification', name: 'Government ID', required: true, description: 'Driver\'s license, passport, or national ID' },
  { id: 'medical', name: 'Medical Records', required: false, description: 'Medical reports, bills, prescriptions' },
  { id: 'financial', name: 'Financial Documents', required: false, description: 'Bills, receipts, financial statements' },
  { id: 'photos', name: 'Reference Photos', required: true, description: 'Photos showing the situation or need' },
  { id: 'other', name: 'Other Supporting Documents', required: false, description: 'Any other relevant documentation' }
];

export default function NewAidRequest() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    description: '',
    urgency: '',
    deadline: '',
    location: '',
    // Document uploads
    documents: {
      identification: [],
      medical: [],
      financial: [],
      photos: [],
      other: []
    },
    // Additional info
    previousRequests: false,
    agreeToTerms: false,
    agreeToVerification: false
  });

  const totalSteps = 4;

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Valid amount is required';
      if (!formData.category) newErrors.category = 'Category is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (formData.description.length < 50) newErrors.description = 'Description must be at least 50 characters';
    }

    if (step === 2) {
      if (!formData.urgency) newErrors.urgency = 'Urgency level is required';
      if (!formData.location.trim()) newErrors.location = 'Location is required';
    }

    if (step === 3) {
      if (formData.documents.identification.length === 0) {
        newErrors.identification = 'Government ID is required';
      }
      if (formData.documents.photos.length === 0) {
        newErrors.photos = 'At least one reference photo is required';
      }
    }

    if (step === 4) {
      if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to terms and conditions';
      if (!formData.agreeToVerification) newErrors.agreeToVerification = 'You must agree to verification process';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleFileUpload = (documentType, files) => {
    const fileArray = Array.from(files);
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: [...prev.documents[documentType], ...fileArray]
      }
    }));
    if (errors[documentType]) {
      setErrors(prev => ({ ...prev, [documentType]: null }));
    }
  };

  const removeFile = (documentType, index) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: prev.documents[documentType].filter((_, i) => i !== index)
      }
    }));
  };

  const submitRequest = async () => {
    if (!validateStep(4)) return;

    setLoading(true);
    try {
      const response = await fetch('/api/donee/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/donee/requests/${result.requestId}/confirmation`);
      } else {
        throw new Error('Failed to submit request');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      setErrors({ submit: 'Failed to submit request. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Request Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Brief, clear title for your aid request"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount Needed (USD) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      placeholder="0.00"
                      min="1"
                      step="0.01"
                      className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.amount ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.amount && <p className="text-red-600 text-sm mt-1">{errors.amount}</p>}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {categories.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => handleInputChange('category', category.id)}
                          className={`p-4 text-left border rounded-lg transition-colors ${
                            formData.category === category.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <IconComponent className={`w-5 h-5 mt-0.5 ${
                              formData.category === category.id ? 'text-blue-600' : 'text-gray-500'
                            }`} />
                            <div>
                              <h4 className={`font-medium ${
                                formData.category === category.id ? 'text-blue-900' : 'text-gray-900'
                              }`}>
                                {category.name}
                              </h4>
                              <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Provide a detailed explanation of your situation and why you need assistance. Include specific details about how the funds will be used."
                    rows={6}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <div className="flex justify-between mt-1">
                    <div>
                      {errors.description && <p className="text-red-600 text-sm">{errors.description}</p>}
                    </div>
                    <p className="text-sm text-gray-500">{formData.description.length}/500 characters</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Urgency & Timeline</h3>
              
              <div className="space-y-6">
                {/* Urgency Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency Level *
                  </label>
                  <div className="space-y-3">
                    {urgencyLevels.map((level) => (
                      <div
                        key={level.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          formData.urgency === level.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onClick={() => handleInputChange('urgency', level.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="urgency"
                            checked={formData.urgency === level.id}
                            onChange={() => handleInputChange('urgency', level.id)}
                            className="text-blue-600"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900">{level.name}</h4>
                            <p className="text-sm text-gray-500">{level.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.urgency && <p className="text-red-600 text-sm mt-1">{errors.urgency}</p>}
                </div>

                {/* Deadline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Deadline (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    If you have a specific deadline, please let us know
                  </p>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="City, State/Province, Country"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.location ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
                  <p className="text-sm text-gray-500 mt-1">
                    This helps us connect you with local resources and volunteers
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Documents</h3>
              <p className="text-gray-600 mb-6">
                Please upload the required documents to verify your request. All documents are kept confidential.
              </p>
              
              <div className="space-y-6">
                {documentTypes.map((docType) => (
                  <div key={docType.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {docType.name}
                          {docType.required && <span className="text-red-500 ml-1">*</span>}
                        </h4>
                        <p className="text-sm text-gray-500">{docType.description}</p>
                      </div>
                    </div>

                    {/* File Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <CloudArrowUpIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Drag and drop files here, or click to select
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={(e) => handleFileUpload(docType.id, e.target.files)}
                        className="hidden"
                        id={`file-${docType.id}`}
                      />
                      <label
                        htmlFor={`file-${docType.id}`}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                      >
                        <PaperClipIcon className="w-4 h-4 mr-2" />
                        Choose Files
                      </label>
                    </div>

                    {/* File List */}
                    {formData.documents[docType.id].length > 0 && (
                      <div className="mt-3 space-y-2">
                        {formData.documents[docType.id].map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center space-x-2">
                              <PaperClipIcon className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-700">{file.name}</span>
                            </div>
                            <button
                              onClick={() => removeFile(docType.id, index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {errors[docType.id] && (
                      <p className="text-red-600 text-sm mt-2">{errors[docType.id]}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <InformationCircleIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Document Guidelines</h4>
                    <ul className="text-sm text-blue-800 mt-2 space-y-1">
                      <li>• Accepted formats: JPG, PNG, PDF, DOC, DOCX</li>
                      <li>• Maximum file size: 10MB per file</li>
                      <li>• Ensure documents are clear and legible</li>
                      <li>• All personal information is kept confidential</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Review & Submit</h3>
              
              {/* Request Summary */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                <h4 className="font-medium text-gray-900 mb-4">Request Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Title:</span>
                    <p className="text-gray-900">{formData.title}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Amount:</span>
                    <p className="text-gray-900">${parseFloat(formData.amount || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Category:</span>
                    <p className="text-gray-900">{categories.find(c => c.id === formData.category)?.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Urgency:</span>
                    <p className="text-gray-900">{urgencyLevels.find(u => u.id === formData.urgency)?.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Location:</span>
                    <p className="text-gray-900">{formData.location}</p>
                  </div>
                  {formData.deadline && (
                    <div>
                      <span className="font-medium text-gray-700">Deadline:</span>
                      <p className="text-gray-900">{new Date(formData.deadline).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <span className="font-medium text-gray-700">Description:</span>
                  <p className="text-gray-900 mt-1">{formData.description}</p>
                </div>
              </div>

              {/* Agreements */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <label className="text-sm text-gray-700">
                      I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms and Conditions</a> and 
                      confirm that all information provided is accurate and truthful. *
                    </label>
                    {errors.agreeToTerms && <p className="text-red-600 text-sm mt-1">{errors.agreeToTerms}</p>}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.agreeToVerification}
                    onChange={(e) => handleInputChange('agreeToVerification', e.target.checked)}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <label className="text-sm text-gray-700">
                      I understand that my request will be reviewed and verified by our volunteer team 
                      before being published. I consent to this verification process. *
                    </label>
                    {errors.agreeToVerification && <p className="text-red-600 text-sm mt-1">{errors.agreeToVerification}</p>}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.previousRequests}
                    onChange={(e) => handleInputChange('previousRequests', e.target.checked)}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="text-sm text-gray-700">
                    I have submitted similar requests on this or other platforms before (optional)
                  </label>
                </div>
              </div>

              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm">{errors.submit}</p>
                </div>
              )}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Submit Aid Request</h1>
          <p className="text-gray-600 mt-2">
            Create a detailed request for assistance. All information is kept confidential.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                    step <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step < currentStep ? (
                    <CheckCircleIcon className="w-6 h-6" />
                  ) : (
                    step
                  )}
                </div>
                {step < totalSteps && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Basic Info</span>
            <span>Timeline</span>
            <span>Documents</span>
            <span>Review</span>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentStep < totalSteps ? (
            <button
              onClick={handleNext}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={submitRequest}
              disabled={loading}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  Submit Request
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
