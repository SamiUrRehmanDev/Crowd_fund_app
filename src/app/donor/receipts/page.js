'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export default function DonorReceipts() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [receipts, setReceipts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user.role !== 'donor') {
      router.push('/auth/signin');
      return;
    }

    fetchReceipts();
  }, [session, status, router]);

  const fetchReceipts = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockReceipts = [
        {
          id: 'receipt-001',
          donationId: 'don-001',
          campaignTitle: 'Emergency Surgery for Maria',
          amount: 150.00,
          date: '2024-07-20',
          status: 'completed',
          taxDeductible: true,
          receiptNumber: 'RCP-2024-001',
          paymentMethod: 'Credit Card',
          taxId: '12-3456789'
        },
        {
          id: 'receipt-002',
          donationId: 'don-002',
          campaignTitle: 'School Books for Rural Children',
          amount: 75.00,
          date: '2024-07-18',
          status: 'completed',
          taxDeductible: true,
          receiptNumber: 'RCP-2024-002',
          paymentMethod: 'PayPal',
          taxId: '12-3456789'
        },
        {
          id: 'receipt-003',
          donationId: 'don-003',
          campaignTitle: 'Community Garden Project',
          amount: 100.00,
          date: '2024-07-15',
          status: 'completed',
          taxDeductible: true,
          receiptNumber: 'RCP-2024-003',
          paymentMethod: 'Bank Transfer',
          taxId: '12-3456789'
        },
        {
          id: 'receipt-004',
          donationId: 'don-004',
          campaignTitle: 'Clean Water Initiative',
          amount: 200.00,
          date: '2024-07-10',
          status: 'processing',
          taxDeductible: true,
          receiptNumber: 'RCP-2024-004',
          paymentMethod: 'Credit Card',
          taxId: '12-3456789'
        },
        {
          id: 'receipt-005',
          donationId: 'don-005',
          campaignTitle: 'Animal Shelter Support',
          amount: 50.00,
          date: '2024-06-28',
          status: 'failed',
          taxDeductible: false,
          receiptNumber: null,
          paymentMethod: 'Credit Card',
          taxId: null
        }
      ];
      
      setReceipts(mockReceipts);
    } catch (error) {
      console.error('Error fetching receipts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReceipt = async (receiptId) => {
    setDownloadingId(receiptId);
    try {
      // Simulate download delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would download the actual receipt
      // For now, we'll just show a success message
      console.log(`Downloading receipt ${receiptId}`);
      
      // Create a mock PDF download
      const receipt = receipts.find(r => r.id === receiptId);
      if (receipt) {
        const element = document.createElement('a');
        const file = new Blob([`Receipt for ${receipt.campaignTitle}\nAmount: $${receipt.amount}\nDate: ${receipt.date}\nReceipt #: ${receipt.receiptNumber}`], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `receipt-${receipt.receiptNumber}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }
    } catch (error) {
      console.error('Error downloading receipt:', error);
    } finally {
      setDownloadingId(null);
    }
  };

  const downloadAllReceipts = async () => {
    setDownloadingId('all');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a summary file
      const summary = receipts
        .filter(r => r.status === 'completed')
        .map(r => `${r.date} - ${r.campaignTitle} - $${r.amount} - ${r.receiptNumber}`)
        .join('\n');
        
      const element = document.createElement('a');
      const file = new Blob([`Donation Receipts Summary\n\n${summary}`], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `all-receipts-${new Date().getFullYear()}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error) {
      console.error('Error downloading all receipts:', error);
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="h-4 w-4" />;
      case 'processing': return <ClockIcon className="h-4 w-4" />;
      case 'failed': return <XCircleIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  // Filter receipts based on search and filters
  const filteredReceipts = receipts.filter(receipt => {
    const matchesSearch = receipt.campaignTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receipt.receiptNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || receipt.status === filterStatus;
    const matchesYear = filterYear === 'all' || new Date(receipt.date).getFullYear().toString() === filterYear;
    
    return matchesSearch && matchesStatus && matchesYear;
  });

  const completedReceipts = receipts.filter(r => r.status === 'completed');
  const totalAmount = completedReceipts.reduce((sum, r) => sum + r.amount, 0);
  const taxDeductibleAmount = completedReceipts.filter(r => r.taxDeductible).reduce((sum, r) => sum + r.amount, 0);

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
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <DocumentTextIcon className="h-8 w-8 text-purple-600" />
                <span>Donation Receipts</span>
              </h1>
              <p className="text-gray-600 mt-2">
                Download and manage your tax-deductible donation receipts
              </p>
            </div>
            <button
              onClick={downloadAllReceipts}
              disabled={downloadingId === 'all' || completedReceipts.length === 0}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {downloadingId === 'all' ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <ArrowDownTrayIcon className="h-5 w-5" />
              )}
              <span>Download All</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{receipts.length}</p>
              <p className="text-sm text-gray-600">Total Receipts</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">${totalAmount.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Total Donated</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">${taxDeductibleAmount.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Tax Deductible</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{completedReceipts.length}</p>
              <p className="text-sm text-gray-600">Available Downloads</p>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by campaign or receipt number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            
            {/* Year Filter */}
            <div>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Years</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Receipts List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Receipt History</h2>
            
            {filteredReceipts.length > 0 ? (
              <div className="space-y-4">
                {filteredReceipts.map((receipt) => (
                  <div
                    key={receipt.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {receipt.campaignTitle}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <CalendarIcon className="h-4 w-4" />
                                {new Date(receipt.date).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <CurrencyDollarIcon className="h-4 w-4" />
                                ${receipt.amount.toFixed(2)}
                              </span>
                              {receipt.receiptNumber && (
                                <span>Receipt #{receipt.receiptNumber}</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(receipt.status)}`}>
                              {getStatusIcon(receipt.status)}
                              {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
                            </span>
                            {receipt.taxDeductible && (
                              <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Tax Deductible
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span>Payment: {receipt.paymentMethod}</span>
                          {receipt.taxId && (
                            <span>Tax ID: {receipt.taxId}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {receipt.status === 'completed' && (
                          <>
                            <Link
                              href={`/donor/donations/${receipt.donationId}`}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                            >
                              <EyeIcon className="h-4 w-4" />
                              <span className="hidden sm:inline">View</span>
                            </Link>
                            <button
                              onClick={() => downloadReceipt(receipt.id)}
                              disabled={downloadingId === receipt.id}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
                            >
                              {downloadingId === receipt.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                              ) : (
                                <ArrowDownTrayIcon className="h-4 w-4" />
                              )}
                              <span className="hidden sm:inline">Download</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No receipts found</h3>
                <p className="text-gray-600 mb-6">
                  {receipts.length === 0 
                    ? "You haven't made any donations yet."
                    : "No receipts match your current filters."
                  }
                </p>
                {receipts.length === 0 && (
                  <Link
                    href="/donor/campaigns"
                    className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Make Your First Donation
                  </Link>
                )}
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
