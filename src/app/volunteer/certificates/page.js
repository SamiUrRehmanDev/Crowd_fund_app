'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrophyIcon,
  DocumentArrowDownIcon,
  CalendarDaysIcon,
  ClockIcon,
  StarIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  HeartIcon,
  HomeIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  PrinterIcon,
  ShareIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import {
  TrophyIcon as TrophySolidIcon,
  StarIcon as StarSolidIcon
} from '@heroicons/react/24/solid';

const certificateTypes = [
  { id: 'completion', name: 'Completion Certificate', description: 'Awarded after completing volunteer tasks', icon: CheckCircleIcon, color: 'green' },
  { id: 'hours', name: 'Hours Certificate', description: 'Milestone certificates for hours volunteered', icon: ClockIcon, color: 'blue' },
  { id: 'impact', name: 'Impact Recognition', description: 'Special recognition for exceptional impact', icon: TrophyIcon, color: 'yellow' },
  { id: 'specialty', name: 'Specialty Certificate', description: 'Certificates for specialized skills', icon: StarIcon, color: 'purple' },
];

const hoursMilestones = [
  { hours: 10, level: 'Bronze', color: 'orange' },
  { hours: 25, level: 'Silver', color: 'gray' },
  { hours: 50, level: 'Gold', color: 'yellow' },
  { hours: 100, level: 'Platinum', color: 'blue' },
  { hours: 200, level: 'Diamond', color: 'purple' },
];

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [volunteerStats, setVolunteerStats] = useState({});

  useEffect(() => {
    fetchCertificates();
    fetchVolunteerStats();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/volunteer/certificates');
      if (response.ok) {
        const data = await response.json();
        setCertificates(data.certificates || []);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
      // Mock data for development
      setCertificates([
        {
          id: 'cert-1',
          type: 'completion',
          title: 'Medical Verification Specialist',
          description: 'Completed 15 medical verification tasks with 100% accuracy',
          issuedDate: '2024-01-20',
          taskCount: 15,
          category: 'medical',
          status: 'issued',
          downloadUrl: '/api/volunteer/certificates/cert-1/download'
        },
        {
          id: 'cert-2',
          type: 'hours',
          title: 'Gold Level Volunteer - 50 Hours',
          description: 'Achieved 50+ hours of volunteer service',
          issuedDate: '2024-01-15',
          hoursCompleted: 52,
          level: 'Gold',
          status: 'issued',
          downloadUrl: '/api/volunteer/certificates/cert-2/download'
        },
        {
          id: 'cert-3',
          type: 'impact',
          title: 'Community Impact Award',
          description: 'Exceptional service supporting 25+ families in need',
          issuedDate: '2024-01-10',
          impactMetric: '25 families helped',
          status: 'issued',
          downloadUrl: '/api/volunteer/certificates/cert-3/download'
        },
        {
          id: 'cert-4',
          type: 'specialty',
          title: 'Emergency Response Volunteer',
          description: 'Specialized training in emergency response protocols',
          issuedDate: '2024-01-05',
          specialization: 'Emergency Response',
          status: 'issued',
          downloadUrl: '/api/volunteer/certificates/cert-4/download'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchVolunteerStats = async () => {
    try {
      const response = await fetch('/api/volunteer/dashboard');
      if (response.ok) {
        const data = await response.json();
        setVolunteerStats(data.stats || {});
      }
    } catch (error) {
      console.error('Error fetching volunteer stats:', error);
      // Mock stats
      setVolunteerStats({
        hoursVolunteered: 52,
        tasksCompleted: 25,
        livesImpacted: 35,
        rating: 4.9
      });
    }
  };

  const downloadCertificate = async (certificate) => {
    try {
      const response = await fetch(certificate.downloadUrl);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${certificate.title.replace(/\s+/g, '_')}_Certificate.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading certificate:', error);
      // Fallback: Generate and download a simple certificate
      generateAndDownloadCertificate(certificate);
    }
  };

  const generateAndDownloadCertificate = (certificate) => {
    // Create a simple certificate as HTML and convert to PDF-like format
    const certificateContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${certificate.title}</title>
        <style>
          body { font-family: 'Times New Roman', serif; text-align: center; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
          .certificate { background: white; padding: 60px; border: 10px solid #gold; border-radius: 20px; margin: 20px; }
          .header { font-size: 48px; color: #2d3748; margin-bottom: 20px; }
          .title { font-size: 24px; color: #4a5568; margin: 20px 0; }
          .name { font-size: 36px; color: #2d3748; margin: 30px 0; font-weight: bold; }
          .description { font-size: 18px; color: #718096; margin: 20px 0; }
          .date { font-size: 16px; color: #a0aec0; margin-top: 40px; }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="header">🏆 CERTIFICATE OF ACHIEVEMENT 🏆</div>
          <div class="title">This certifies that</div>
          <div class="name">Volunteer Recipient</div>
          <div class="title">has successfully earned</div>
          <div class="name">${certificate.title}</div>
          <div class="description">${certificate.description}</div>
          <div class="date">Issued on: ${new Date(certificate.issuedDate).toLocaleDateString()}</div>
          <div class="date">CrowdFunding Platform - Volunteer Recognition Program</div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([certificateContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `${certificate.title.replace(/\s+/g, '_')}_Certificate.html`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const getCertificateIcon = (type) => {
    const typeConfig = certificateTypes.find(t => t.id === type);
    return typeConfig ? typeConfig.icon : TrophyIcon;
  };

  const getCertificateColor = (type) => {
    const typeConfig = certificateTypes.find(t => t.id === type);
    return typeConfig ? typeConfig.color : 'gray';
  };

  const getNextMilestone = () => {
    const currentHours = volunteerStats.hoursVolunteered || 0;
    return hoursMilestones.find(milestone => milestone.hours > currentHours);
  };

  const getCurrentLevel = () => {
    const currentHours = volunteerStats.hoursVolunteered || 0;
    return hoursMilestones
      .slice()
      .reverse()
      .find(milestone => currentHours >= milestone.hours);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading certificates...</p>
        </div>
      </div>
    );
  }

  const nextMilestone = getNextMilestone();
  const currentLevel = getCurrentLevel();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <TrophySolidIcon className="w-8 h-8 text-yellow-600 mr-3" />
            Volunteer Certificates
          </h1>
          <p className="text-gray-600 mt-1">
            Recognition for your valuable volunteer contributions
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <ClockIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Hours Volunteered</p>
                <p className="text-2xl font-bold text-gray-900">{volunteerStats.hoursVolunteered || 0}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tasks Completed</p>
                <p className="text-2xl font-bold text-gray-900">{volunteerStats.tasksCompleted || 0}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <TrophySolidIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Certificates Earned</p>
                <p className="text-2xl font-bold text-gray-900">{certificates.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center">
              <div className={`bg-${currentLevel?.color || 'gray'}-100 p-3 rounded-lg`}>
                <StarSolidIcon className={`h-6 w-6 text-${currentLevel?.color || 'gray'}-600`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Current Level</p>
                <p className="text-2xl font-bold text-gray-900">{currentLevel?.level || 'Beginner'}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Next Milestone */}
        {nextMilestone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Next Milestone: {nextMilestone.level} Level</h3>
                <p className="text-purple-100 mt-1">
                  Complete {nextMilestone.hours - (volunteerStats.hoursVolunteered || 0)} more hours to unlock your {nextMilestone.level} certificate
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{nextMilestone.hours}h</div>
                <div className="text-sm text-purple-200">Target</div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="bg-purple-400 rounded-full h-3">
                <div 
                  className="bg-white rounded-full h-3 transition-all duration-500"
                  style={{ 
                    width: `${Math.min(((volunteerStats.hoursVolunteered || 0) / nextMilestone.hours) * 100, 100)}%` 
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-purple-100 mt-2">
                <span>{volunteerStats.hoursVolunteered || 0}h completed</span>
                <span>{Math.round(((volunteerStats.hoursVolunteered || 0) / nextMilestone.hours) * 100)}%</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate, index) => {
            const IconComponent = getCertificateIcon(certificate.type);
            const color = getCertificateColor(certificate.type);
            
            return (
              <motion.div
                key={certificate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className={`bg-${color}-50 p-6 text-center border-b border-${color}-100`}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-${color}-100 rounded-full mb-4`}>
                    <IconComponent className={`w-8 h-8 text-${color}-600`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{certificate.title}</h3>
                  <p className="text-sm text-gray-600 mt-2">{certificate.description}</p>
                </div>
                
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarDaysIcon className="w-4 h-4 mr-2" />
                      Issued: {new Date(certificate.issuedDate).toLocaleDateString()}
                    </div>
                    
                    {certificate.hoursCompleted && (
                      <div className="flex items-center text-sm text-gray-600">
                        <ClockIcon className="w-4 h-4 mr-2" />
                        {certificate.hoursCompleted} hours completed
                      </div>
                    )}
                    
                    {certificate.taskCount && (
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircleIcon className="w-4 h-4 mr-2" />
                        {certificate.taskCount} tasks completed
                      </div>
                    )}
                    
                    {certificate.impactMetric && (
                      <div className="flex items-center text-sm text-gray-600">
                        <HeartIcon className="w-4 h-4 mr-2" />
                        {certificate.impactMetric}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 flex space-x-3">
                    <button
                      onClick={() => setSelectedCertificate(certificate)}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <EyeIcon className="w-4 h-4 mr-2" />
                      Preview
                    </button>
                    
                    <button
                      onClick={() => downloadCertificate(certificate)}
                      className={`flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-${color}-600 hover:bg-${color}-700`}
                    >
                      <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                      Download
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {certificates.length === 0 && (
          <div className="text-center py-12">
            <TrophyIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No certificates yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Complete volunteer tasks to earn your first certificate!
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
        )}

        {/* Certificate Types Info */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Certificate Types</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificateTypes.map((type) => (
                <div key={type.id} className="flex items-start space-x-4">
                  <div className={`bg-${type.color}-100 p-2 rounded-lg`}>
                    <type.icon className={`w-5 h-5 text-${type.color}-600`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{type.name}</h3>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
