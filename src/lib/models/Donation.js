import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  // Basic Information
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'USD' },
  
  // Relationships
  donor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
    // Can be null for anonymous donations
  },
  campaign: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Campaign', 
    required: true 
  },
  
  // Donor Information (for anonymous donations)
  anonymousDonor: {
    name: String,
    email: String,
    message: String
  },
  isAnonymous: { type: Boolean, default: false },
  
  // Payment Information
  paymentMethod: {
    type: String,
    enum: ['stripe', 'razorpay', 'paypal', 'bank_transfer', 'cash'],
    required: true
  },
  paymentId: String, // External payment gateway transaction ID
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'disputed'],
    default: 'pending'
  },
  
  // Transaction Details
  transactionFee: { type: Number, default: 0 },
  netAmount: Number, // amount - transactionFee
  
  // Message and Dedication
  message: String,
  dedication: {
    type: String,
    enum: ['memory', 'honor', 'celebration', 'general'],
    dedicatedTo: String
  },
  
  // Receipt and Tax
  receiptNumber: { type: String, unique: true },
  receiptGenerated: { type: Boolean, default: false },
  receiptUrl: String,
  taxDeductible: { type: Boolean, default: false },
  
  // Admin and Moderation
  adminNotes: [{
    note: String,
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addedAt: { type: Date, default: Date.now }
  }],
  flagged: { type: Boolean, default: false },
  flaggedReason: String,
  
  // Refund Information
  refund: {
    amount: Number,
    reason: String,
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    processedAt: Date,
    refundId: String, // External refund ID
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    }
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  processedAt: Date,
  completedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
donationSchema.index({ donor: 1, createdAt: -1 });
donationSchema.index({ campaign: 1, createdAt: -1 });
donationSchema.index({ paymentStatus: 1 });
donationSchema.index({ createdAt: -1 });
donationSchema.index({ amount: -1 });

// Virtuals
donationSchema.virtual('donorName').get(function() {
  if (this.isAnonymous) {
    return this.anonymousDonor?.name || 'Anonymous';
  }
  return this.donor ? `${this.donor.firstName} ${this.donor.lastName}` : 'Anonymous';
});

// Methods
donationSchema.methods.generateReceiptNumber = function() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  this.receiptNumber = `RCP-${date}-${random}`;
  return this.receiptNumber;
};

donationSchema.methods.processRefund = async function(refundData, adminId) {
  this.refund = {
    ...refundData,
    processedBy: adminId,
    processedAt: new Date(),
    status: 'pending'
  };
  this.paymentStatus = 'refunded';
  return this.save();
};

// Pre-save middleware
donationSchema.pre('save', function(next) {
  // Calculate net amount
  this.netAmount = this.amount - (this.transactionFee || 0);
  
  // Generate receipt number if not exists
  if (this.isNew && !this.receiptNumber) {
    this.generateReceiptNumber();
  }
  
  next();
});

// Post-save middleware to update campaign stats
donationSchema.post('save', async function(doc) {
  if (doc.paymentStatus === 'completed') {
    const Campaign = mongoose.model('Campaign');
    await Campaign.findByIdAndUpdate(doc.campaign, {
      $inc: {
        raisedAmount: doc.amount,
        'stats.donationCount': 1
      },
      $set: {
        'stats.lastDonationAt': doc.completedAt || doc.createdAt
      }
    });
  }
});

export default mongoose.models.Donation || mongoose.model('Donation', donationSchema);
