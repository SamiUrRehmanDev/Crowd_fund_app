'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  PlusCircleIcon,
  PhotoIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  InformationCircleIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';

const CATEGORIES = [
  'Medical',
  'Education',
  'Emergency',
  'Community',
  'Environment',
  'Disaster Relief',
  'Children',
  'Elderly Care',
  'Animal Welfare',
  'Other'
];

const URGENCY_LEVELS = [
  { value: 'Low', label: 'Low - General need', color: 'green' },
  { value: 'Medium', label: 'Medium - Important cause', color: 'yellow' },
  { value: 'High', label: 'High - Time sensitive', color: 'orange' },
  { value: 'Critical', label: 'Critical - Immediate help needed', color: 'red' }
];

export default function NewProposal() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    urgency: '',
    description: '',
    beneficiaryInfo: '',
    targetAmount: '',
    timeframe: '',
    location: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    reasonForSupport: '',
    expectedImpact: '',
    additionalNotes: '',
    referenceLinks: '',
    agreeToTerms: false,
    agreeToVerification: false
  });

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user.role !== 'DONOR') {
      router.push('/auth/signin');
      return;
    }
  }, [session, status, router]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate files
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    for (const file of files) {
      if (file.size > maxSize) {
        setMessage({ type: 'error', text: 'Image size must be less than 5MB' });
        return;
      }
      if (!allowedTypes.includes(file.type)) {
        setMessage({ type: 'error', text: 'Only JPEG, PNG, and WebP images are allowed' });
        return;
      }
    }

    setIsUploading(true);
    
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'proposal');

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        return data.url;
      });

      const urls = await Promise.all(uploadPromises);
      setUploadedImages(prev => [...prev, ...urls]);
      setMessage({ type: 'success', text: `${files.length} image(s) uploaded successfully` });
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ type: 'error', text: 'Failed to upload images. Please try again.' });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (indexToRemove) => {
    setUploadedImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const validateForm = () => {
    const required = ['title', 'category', 'urgency', 'description', 'beneficiaryInfo', 'targetAmount', 'timeframe', 'location', 'contactPerson', 'contactPhone', 'contactEmail', 'reasonForSupport'];
    
    for (const field of required) {
      if (!formData[field]?.trim()) {
        setMessage({ type: 'error', text: 'Please fill in all required fields' });
        return false;
      }
    }

    if (!formData.agreeToTerms) {
      setMessage({ type: 'error', text: 'Please agree to the terms and conditions' });
      return false;
    }

    if (!formData.agreeToVerification) {
      setMessage({ type: 'error', text: 'Please agree to the verification process' });
      return false;
    }

    const amount = parseFloat(formData.targetAmount);
    if (isNaN(amount) || amount < 100) {
      setMessage({ type: 'error', text: 'Target amount must be at least $100' });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.contactEmail)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const proposalData = {
        ...formData,
        images: uploadedImages,
        submittedBy: session.user.id
      };

      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(proposalData)
      });

      if (response.ok) {
        const data = await response.json();
        setMessage({ type: 'success', text: 'Proposal submitted successfully! You will receive updates via email.' });
        
        // Redirect after 3 seconds
        setTimeout(() => {
          router.push('/donor/proposals');
        }, 3000);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Failed to submit proposal' });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit a New Case Proposal</h1>
          <p className="text-gray-600">
            Help us identify worthy causes that need support. Your proposal will be reviewed by our admin team.
          </p>
        </div>

        {/* Information Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8"
        >
          <div className="flex items-start space-x-3">
            <InformationCircleIcon className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Proposal Guidelines</h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Provide detailed and accurate information about the beneficiary</li>
                <li>• Include supporting images and documentation when possible</li>
                <li>• Proposals are reviewed within 5-7 business days</li>
                <li>• You'll receive email updates on the status of your proposal</li>
                <li>• Approved proposals will be published as fundraising campaigns</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                <span>Basic Information</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Help John Get Life-Saving Surgery"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={100}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency Level *
                  </label>
                  <select
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select urgency level</option>
                    {URGENCY_LEVELS.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Amount (USD) *
                  </label>
                  <input
                    type="number"
                    name="targetAmount"
                    value={formData.targetAmount}
                    onChange={handleInputChange}
                    placeholder="e.g., 5000"
                    min="100"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeframe *
                  </label>
                  <input
                    type="text"
                    name="timeframe"
                    value={formData.timeframe}
                    onChange={handleInputChange}
                    placeholder="e.g., 3 months, ASAP, by December 2024"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Detailed Description */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Detailed Description</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Provide a detailed description of the situation and why support is needed..."
                    rows={6}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={2000}
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.description.length}/2000 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Beneficiary Information *
                  </label>
                  <textarea
                    name="beneficiaryInfo"
                    value={formData.beneficiaryInfo}
                    onChange={handleInputChange}
                    placeholder="Who will benefit from this campaign? Include age, background, and current situation..."
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={1000}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Support *
                  </label>
                  <textarea
                    name="reasonForSupport"
                    value={formData.reasonForSupport}
                    onChange={handleInputChange}
                    placeholder="Explain why this cause deserves support and how urgent the need is..."
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={1000}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Impact
                  </label>
                  <textarea
                    name="expectedImpact"
                    value={formData.expectedImpact}
                    onChange={handleInputChange}
                    placeholder="What positive impact will this campaign have? How will the funds be used?"
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={500}
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, State/Province, Country"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    placeholder="Primary contact person name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    placeholder="contact@example.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Supporting Materials */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <PhotoIcon className="h-6 w-6 text-blue-600" />
                <span>Supporting Materials</span>
              </h2>
              
              <div className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reference Images
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                          <span>Upload images</span>
                          <input
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleImageUpload}
                            className="sr-only"
                            disabled={isUploading}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, WebP up to 5MB each (max 5 images)
                      </p>
                    </div>
                  </div>

                  {/* Uploaded Images */}
                  {uploadedImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                      {uploadedImages.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {isUploading && (
                    <div className="mt-4 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-sm text-gray-600 mt-2">Uploading images...</p>
                    </div>
                  )}
                </div>

                {/* Reference Links */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reference Links
                  </label>
                  <textarea
                    name="referenceLinks"
                    value={formData.referenceLinks}
                    onChange={handleInputChange}
                    placeholder="Include any relevant links (news articles, medical reports, etc.) - one per line"
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    placeholder="Any additional information you'd like to share..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={500}
                  />
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Terms and Conditions</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                    I agree that the information provided is accurate and truthful. I understand that false or misleading information may result in the rejection of this proposal. *
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="agreeToVerification"
                    name="agreeToVerification"
                    checked={formData.agreeToVerification}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="agreeToVerification" className="text-sm text-gray-700">
                    I consent to verification of the provided information and understand that additional documentation may be required before approval. *
                  </label>
                </div>
              </div>
            </div>

            {/* Message Display */}
            {message.text && (
              <div className={`flex items-center space-x-2 p-4 rounded-lg ${
                message.type === 'error' 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
                {message.type === 'error' ? (
                  <XMarkIcon className="h-5 w-5 flex-shrink-0" />
                ) : (
                  <CheckCircleIcon className="h-5 w-5 flex-shrink-0" />
                )}
                <span className="text-sm">{message.text}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => router.push('/donor/proposals')}
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircleIcon className="h-5 w-5" />
                      <span>Submit Proposal</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
