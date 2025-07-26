'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  PlusCircleIcon,
  DocumentTextIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function DonorProposals() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user.role !== 'donor') {
      router.push('/auth/signin');
      return;
    }

    fetchProposals();
  }, [session, status, router]);

  const fetchProposals = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockProposals = [
        {
          id: 'prop-1',
          title: 'Medical Aid for Local Family',
          category: 'Medical',
          status: 'pending',
          urgency: 'High',
          submittedDate: '2024-07-20',
          description: 'Emergency medical assistance needed for family with sick child...'
        },
        {
          id: 'prop-2',
          title: 'School Supplies for Rural School',
          category: 'Education',
          status: 'approved',
          urgency: 'Medium',
          submittedDate: '2024-07-18',
          description: 'Educational support needed for children in rural area...'
        }
      ];
      
      setProposals(mockProposals);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'under_review': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <ClockIcon className="h-4 w-4" />;
      case 'approved': return <CheckCircleIcon className="h-4 w-4" />;
      case 'rejected': return <XCircleIcon className="h-4 w-4" />;
      case 'under_review': return <ExclamationTriangleIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
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
              <h1 className="text-3xl font-bold text-gray-900">My Proposals</h1>
              <p className="text-gray-600 mt-2">
                Track and manage your submitted proposals
              </p>
            </div>
            <Link
              href="/donor/proposals/new"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <PlusCircleIcon className="h-5 w-5" />
              <span>Submit New Proposal</span>
            </Link>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{proposals.length}</p>
              <p className="text-sm text-gray-600">Total Proposals</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {proposals.filter(p => p.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-600">Pending Review</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {proposals.filter(p => p.status === 'approved').length}
              </p>
              <p className="text-sm text-gray-600">Approved</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {proposals.filter(p => p.status === 'rejected').length}
              </p>
              <p className="text-sm text-gray-600">Rejected</p>
            </div>
          </motion.div>
        </div>

        {/* Proposals List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">All Proposals</h2>
            
            {proposals.length > 0 ? (
              <div className="space-y-4">
                {proposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {proposal.title}
                          </h3>
                          <div className="flex items-center gap-2 ml-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                              {getStatusIcon(proposal.status)}
                              {proposal.status.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(proposal.urgency)}`}>
                              {proposal.urgency}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span className="inline-flex items-center gap-1">
                            <DocumentTextIcon className="h-4 w-4" />
                            {proposal.category}
                          </span>
                          <span>Submitted: {proposal.submittedDate}</span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4">
                          {proposal.description}
                        </p>
                        
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/donor/proposals/${proposal.id}`}
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            <EyeIcon className="h-4 w-4" />
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No proposals yet</h3>
                <p className="text-gray-600 mb-6">
                  You haven't submitted any proposals yet. Start by creating your first proposal.
                </p>
                <Link
                  href="/donor/proposals/new"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <PlusCircleIcon className="h-5 w-5" />
                  Submit Your First Proposal
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
