'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiDollarSign, 
  FiCreditCard, 
  FiDownload, 
  FiEye, 
  FiRefreshCw,
  FiFilter,
  FiSearch,
  FiCheck,
  FiX,
  FiAlertTriangle,
  FiTrendingUp,
  FiTrendingDown
} from 'react-icons/fi';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useAdminAuth } from '../../../components/admin/AdminAuthProvider';

const PaymentManagement = () => {
  const { user, hasPermission } = useAdminAuth();
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState('');

  // Mock data - replace with API calls
  useEffect(() => {
    setStats({
      totalRevenue: 125000,
      monthlyRevenue: 15000,
      totalTransactions: 1250,
      pendingPayments: 15,
      failedPayments: 8,
      refundedAmount: 2500,
      processingFees: 3750,
      revenueGrowth: 12.5
    });

    setPayments([
      {
        id: 'PAY_001',
        transactionId: 'TXN_123456789',
        donor: {
          name: 'John Doe',
          email: 'john@example.com',
          id: 'USER_001'
        },
        campaign: {
          title: 'Medical Treatment for Cancer Patient',
          id: 'CAMP_001'
        },
        amount: 500,
        currency: 'USD',
        fee: 15,
        netAmount: 485,
        paymentMethod: 'Credit Card',
        paymentProvider: 'Stripe',
        status: 'completed',
        type: 'donation',
        processedAt: '2024-07-18T10:30:00Z',
        createdAt: '2024-07-18T10:28:00Z',
        receipt: 'RCP_001',
        metadata: {
          cardLast4: '4242',
          cardBrand: 'Visa'
        }
      },
      {
        id: 'PAY_002',
        transactionId: 'TXN_987654321',
        donor: {
          name: 'Jane Smith',
          email: 'jane@example.com',
          id: 'USER_002'
        },
        campaign: {
          title: 'Educational Support for Orphans',
          id: 'CAMP_002'
        },
        amount: 250,
        currency: 'USD',
        fee: 7.5,
        netAmount: 242.5,
        paymentMethod: 'PayPal',
        paymentProvider: 'PayPal',
        status: 'pending',
        type: 'donation',
        processedAt: null,
        createdAt: '2024-07-18T09:15:00Z',
        receipt: null,
        metadata: {}
      },
      {
        id: 'PAY_003',
        transactionId: 'TXN_456789123',
        donor: {
          name: 'Mike Johnson',
          email: 'mike@example.com',
          id: 'USER_003'
        },
        campaign: {
          title: 'Community Garden Project',
          id: 'CAMP_003'
        },
        amount: 1000,
        currency: 'USD',
        fee: 30,
        netAmount: 970,
        paymentMethod: 'Bank Transfer',
        paymentProvider: 'Stripe',
        status: 'failed',
        type: 'donation',
        processedAt: '2024-07-18T08:45:00Z',
        createdAt: '2024-07-18T08:40:00Z',
        receipt: null,
        metadata: {
          failureReason: 'Insufficient funds'
        }
      },
      {
        id: 'PAY_004',
        transactionId: 'REF_789123456',
        donor: {
          name: 'Sarah Wilson',
          email: 'sarah@example.com',
          id: 'USER_004'
        },
        campaign: {
          title: 'Medical Treatment for Cancer Patient',
          id: 'CAMP_001'
        },
        amount: -200,
        currency: 'USD',
        fee: -6,
        netAmount: -194,
        paymentMethod: 'Credit Card',
        paymentProvider: 'Stripe',
        status: 'refunded',
        type: 'refund',
        processedAt: '2024-07-17T14:20:00Z',
        createdAt: '2024-07-17T14:15:00Z',
        receipt: 'REF_001',
        metadata: {
          refundReason: 'Duplicate payment'
        }
      }
    ]);

    setLoading(false);
  }, []);

  const handleProcessRefund = async (paymentId) => {
    if (!refundReason.trim()) {
      alert('Please provide a refund reason');
      return;
    }

    // Here you would make an API call to process the refund
    const refund = {
      id: `REF_${Date.now()}`,
      transactionId: `REF_${Date.now()}`,
      amount: -selectedPayment.amount,
      currency: selectedPayment.currency,
      fee: -selectedPayment.fee,
      netAmount: -selectedPayment.netAmount,
      paymentMethod: selectedPayment.paymentMethod,
      paymentProvider: selectedPayment.paymentProvider,
      status: 'refunded',
      type: 'refund',
      processedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      receipt: `REF_${Date.now()}`,
      donor: selectedPayment.donor,
      campaign: selectedPayment.campaign,
      metadata: {
        refundReason: refundReason,
        originalPaymentId: paymentId
      }
    };

    setPayments([refund, ...payments]);
    setShowRefundModal(false);
    setSelectedPayment(null);
    setRefundReason('');
  };

  const handleExportPayments = () => {
    // Here you would generate and download a CSV/Excel file
    const csvContent = payments.map(payment => 
      `${payment.id},${payment.donor.name},${payment.campaign.title},${payment.amount},${payment.status},${payment.createdAt}`
    ).join('\\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payments_export.csv';
    a.click();
  };

  const filteredPayments = payments.filter(payment => {
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    const matchesType = filterType === 'all' || payment.type === filterType;
    const matchesSearch = payment.donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FiCheck className="text-green-600" />;
      case 'pending': return <FiRefreshCw className="text-yellow-600" />;
      case 'failed': return <FiX className="text-red-600" />;
      case 'refunded': return <FiRefreshCw className="text-gray-600" />;
      default: return <FiAlertTriangle className="text-gray-600" />;
    }
  };

  if (!hasPermission('payment_management')) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access payment management.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
            <p className="text-gray-600 mt-2">Monitor and manage all payment transactions</p>
          </div>
          <button
            onClick={handleExportPayments}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FiDownload /> Export Data
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue?.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FiDollarSign className="text-green-600" size={24} />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <FiTrendingUp className="text-green-600 mr-1" size={16} />
              <span className="text-green-600 text-sm font-medium">+{stats.revenueGrowth}%</span>
              <span className="text-gray-600 text-sm ml-1">vs last month</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.monthlyRevenue?.toLocaleString()}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FiTrendingUp className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions?.toLocaleString()}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FiCreditCard className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processing Fees</p>
                <p className="text-2xl font-bold text-gray-900">${stats.processingFees?.toLocaleString()}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <FiDollarSign className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <div className="flex items-center">
              <FiRefreshCw className="text-yellow-600 mr-2" />
              <span className="text-yellow-800 font-medium">Pending: {stats.pendingPayments}</span>
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <div className="flex items-center">
              <FiX className="text-red-600 mr-2" />
              <span className="text-red-800 font-medium">Failed: {stats.failedPayments}</span>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
            <div className="flex items-center">
              <FiRefreshCw className="text-gray-600 mr-2" />
              <span className="text-gray-800 font-medium">Refunded: ${stats.refundedAmount?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="donation">Donations</option>
                <option value="refund">Refunds</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{payment.id}</div>
                        <div className="text-sm text-gray-500">{payment.transactionId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{payment.donor.name}</div>
                        <div className="text-sm text-gray-500">{payment.donor.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{payment.campaign.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className={`text-sm font-medium ${payment.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {payment.amount >= 0 ? '+' : ''}${Math.abs(payment.amount)}
                        </div>
                        <div className="text-xs text-gray-500">Fee: ${Math.abs(payment.fee)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.paymentMethod}</div>
                      <div className="text-sm text-gray-500">{payment.paymentProvider}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(payment.status)}
                        <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedPayment(payment)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FiEye size={16} />
                        </button>
                        {payment.status === 'completed' && payment.type === 'donation' && (
                          <button
                            onClick={() => {
                              setSelectedPayment(payment);
                              setShowRefundModal(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiRefreshCw size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Details Modal */}
        {selectedPayment && !showRefundModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Payment Details</h2>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment ID</label>
                    <p className="text-sm text-gray-900">{selectedPayment.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
                    <p className="text-sm text-gray-900">{selectedPayment.transactionId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Donor</label>
                    <p className="text-sm text-gray-900">{selectedPayment.donor.name}</p>
                    <p className="text-sm text-gray-500">{selectedPayment.donor.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Campaign</label>
                    <p className="text-sm text-gray-900">{selectedPayment.campaign.title}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <p className="text-sm text-gray-900">${selectedPayment.amount}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fee</label>
                    <p className="text-sm text-gray-900">${selectedPayment.fee}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Net Amount</label>
                    <p className="text-sm text-gray-900">${selectedPayment.netAmount}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                    <p className="text-sm text-gray-900">{selectedPayment.paymentMethod}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Provider</label>
                    <p className="text-sm text-gray-900">{selectedPayment.paymentProvider}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedPayment.status)}`}>
                      {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <p className="text-sm text-gray-900">{selectedPayment.type}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created At</label>
                    <p className="text-sm text-gray-900">{new Date(selectedPayment.createdAt).toLocaleString()}</p>
                  </div>
                  {selectedPayment.processedAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Processed At</label>
                      <p className="text-sm text-gray-900">{new Date(selectedPayment.processedAt).toLocaleString()}</p>
                    </div>
                  )}
                </div>

                {selectedPayment.metadata && Object.keys(selectedPayment.metadata).length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Metadata</label>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      {Object.entries(selectedPayment.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-1">
                          <span className="text-sm font-medium text-gray-600">{key}:</span>
                          <span className="text-sm text-gray-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Refund Modal */}
        {showRefundModal && selectedPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Process Refund</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Refunding payment: {selectedPayment.id}</p>
                  <p className="text-lg font-semibold">Amount: ${selectedPayment.amount}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Refund Reason</label>
                  <textarea
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Enter reason for refund..."
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleProcessRefund(selectedPayment.id)}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                  >
                    Process Refund
                  </button>
                  <button
                    onClick={() => {
                      setShowRefundModal(false);
                      setSelectedPayment(null);
                      setRefundReason('');
                    }}
                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PaymentManagement;
