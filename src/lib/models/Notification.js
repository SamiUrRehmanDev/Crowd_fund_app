import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  // Basic Information
  type: {
    type: String,
    enum: [
      'donation_received',
      'campaign_update',
      'milestone_reached',
      'proposal_status',
      'favorite_campaign_update',
      'payment_method',
      'receipt_available',
      'campaign_approved',
      'campaign_rejected',
      'volunteer_task',
      'system_announcement',
      // Volunteer-specific types
      'task_match',
      'task_update',
      'task_assigned',
      'task_completed',
      'verification',
      'verification_approved',
      'verification_rejected',
      'system',
      'certificate_awarded',
      'rating_received'
    ],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  
  // Recipient Information
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipientRole: {
    type: String,
    enum: ['donor', 'donee', 'volunteer', 'admin'],
    required: true
  },
  
  // Related Objects
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign'
  },
  donation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation'
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  
  // Additional Data
  metadata: {
    amount: Number,
    campaignTitle: String,
    milestone: Number,
    paymentMethodLast4: String,
    donationId: String,
    proposalId: String,
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    }
  },
  
  // Status
  isRead: { type: Boolean, default: false },
  readAt: Date,
  
  // Display
  icon: {
    type: String,
    default: 'BellIcon'
  },
  color: {
    type: String,
    enum: ['red', 'green', 'blue', 'yellow', 'purple', 'gray', 'indigo', 'emerald'],
    default: 'blue'
  },
  
  // Action
  actionUrl: String,
  actionText: String,
  
  // Admin
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  expiresAt: Date // For auto-cleanup of old notifications
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ type: 1, recipient: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for auto-cleanup

// Virtual for time ago
notificationSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
});

// Static methods
notificationSchema.statics.createDonationNotification = function(donationData) {
  return this.create({
    type: 'donation_received',
    title: 'Your donation was successful',
    message: `Your $${donationData.amount} donation to "${donationData.campaignTitle}" has been processed successfully.`,
    recipient: donationData.donorId,
    recipientRole: 'donor',
    campaign: donationData.campaignId,
    donation: donationData.donationId,
    metadata: {
      amount: donationData.amount,
      campaignTitle: donationData.campaignTitle
    },
    icon: 'CheckCircleIcon',
    color: 'green',
    actionUrl: `/campaigns/${donationData.campaignId}`
  });
};

notificationSchema.statics.createCampaignUpdateNotification = function(campaignData, recipientId) {
  return this.create({
    type: 'campaign_update',
    title: 'Campaign Update',
    message: campaignData.message,
    recipient: recipientId,
    recipientRole: 'donor',
    campaign: campaignData.campaignId,
    metadata: {
      campaignTitle: campaignData.campaignTitle
    },
    icon: 'InformationCircleIcon',
    color: 'blue',
    actionUrl: `/campaigns/${campaignData.campaignId}`
  });
};

notificationSchema.statics.createMilestoneNotification = function(campaignData, recipientId) {
  return this.create({
    type: 'milestone_reached',
    title: 'Milestone Reached!',
    message: `The campaign "${campaignData.campaignTitle}" has reached ${campaignData.milestone}% of its goal!`,
    recipient: recipientId,
    recipientRole: 'donor',
    campaign: campaignData.campaignId,
    metadata: {
      campaignTitle: campaignData.campaignTitle,
      milestone: campaignData.milestone
    },
    icon: 'TrophyIcon',
    color: 'yellow',
    actionUrl: `/campaigns/${campaignData.campaignId}`
  });
};

// Instance methods
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
