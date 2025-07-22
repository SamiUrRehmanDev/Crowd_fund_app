import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  // Basic Information
  title: { type: String, required: true },
  description: { type: String, required: true },
  shortDescription: { type: String, maxlength: 200 },
  category: {
    type: String,
    enum: ['medical', 'education', 'housing', 'emergency', 'business', 'family', 'community'],
    required: true
  },
  subcategory: String,
  
  // Creator Information
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  beneficiary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Financial Information
  goalAmount: { type: Number, required: true, min: 0 },
  raisedAmount: { type: Number, default: 0, min: 0 },
  currency: { type: String, default: 'USD' },
  
  // Media
  images: [{
    url: String,
    caption: String,
    isPrimary: { type: Boolean, default: false },
    uploadedAt: { type: Date, default: Date.now }
  }],
  videos: [{
    url: String,
    caption: String,
    duration: Number,
    uploadedAt: { type: Date, default: Date.now }
  }],
  documents: [{
    url: String,
    filename: String,
    type: String,
    size: Number,
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // Campaign Details
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  timeline: {
    startDate: Date,
    endDate: Date,
    estimatedDuration: Number // in days
  },
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  
  // Status and Moderation
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'live', 'paused', 'completed', 'cancelled', 'rejected'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'featured', 'archived'],
    default: 'public'
  },
  
  // Admin fields
  featured: { type: Boolean, default: false },
  featuredUntil: Date,
  urgent: { type: Boolean, default: false },
  moderationStatus: {
    type: String,
    enum: ['pending', 'approved', 'flagged', 'rejected'],
    default: 'pending'
  },
  moderationNotes: [{
    note: String,
    moderator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: {
      type: String,
      enum: ['approved', 'rejected', 'flagged', 'edited', 'note_added']
    },
    timestamp: { type: Date, default: Date.now }
  }],
  
  // Verification
  verificationRequired: { type: Boolean, default: false },
  verificationStatus: {
    type: String,
    enum: ['not_required', 'pending', 'verified', 'rejected'],
    default: 'not_required'
  },
  verificationDocuments: [{
    type: String,
    url: String,
    verifiedAt: Date,
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  
  // Statistics
  stats: {
    viewCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
    donationCount: { type: Number, default: 0 },
    uniqueDonors: { type: Number, default: 0 },
    averageDonation: { type: Number, default: 0 },
    lastDonationAt: Date,
    completionPercentage: { type: Number, default: 0 }
  },
  
  // Updates and Communication
  updates: [{
    title: String,
    content: String,
    images: [String],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    publishedAt: { type: Date, default: Date.now },
    visibility: {
      type: String,
      enum: ['public', 'donors_only', 'private'],
      default: 'public'
    }
  }],
  
  // Tasks and Volunteers
  assignedTasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  volunteers: [{
    volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: String,
    assignedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['assigned', 'active', 'completed', 'removed'],
      default: 'assigned'
    }
  }],
  
  // Fraud and Security
  fraudScore: { type: Number, default: 0, min: 0, max: 100 },
  flaggedReasons: [{
    reason: String,
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reportedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
      default: 'pending'
    }
  }],
  
  // SEO and Discovery
  slug: { type: String, unique: true },
  tags: [String],
  keywords: [String],
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  publishedAt: Date,
  completedAt: Date,
  deletedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
campaignSchema.index({ status: 1, visibility: 1 });
campaignSchema.index({ category: 1, urgency: 1 });
campaignSchema.index({ createdBy: 1 });
campaignSchema.index({ featured: 1, featuredUntil: 1 });
campaignSchema.index({ 'location.city': 1, 'location.country': 1 });
campaignSchema.index({ createdAt: -1 });
campaignSchema.index({ tags: 1 });
campaignSchema.index({ fraudScore: 1 });

// Virtuals
campaignSchema.virtual('progressPercentage').get(function() {
  return this.goalAmount > 0 ? Math.min((this.raisedAmount / this.goalAmount) * 100, 100) : 0;
});

campaignSchema.virtual('remainingAmount').get(function() {
  return Math.max(this.goalAmount - this.raisedAmount, 0);
});

campaignSchema.virtual('isCompleted').get(function() {
  return this.raisedAmount >= this.goalAmount || this.status === 'completed';
});

campaignSchema.virtual('daysRemaining').get(function() {
  if (!this.timeline.endDate) return null;
  const now = new Date();
  const endDate = new Date(this.timeline.endDate);
  const diffTime = endDate - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Methods
campaignSchema.methods.updateStats = function() {
  if (this.goalAmount > 0) {
    this.stats.completionPercentage = (this.raisedAmount / this.goalAmount) * 100;
  }
  if (this.stats.donationCount > 0) {
    this.stats.averageDonation = this.raisedAmount / this.stats.donationCount;
  }
  return this.save();
};

campaignSchema.methods.addUpdate = function(updateData, authorId) {
  this.updates.push({
    ...updateData,
    author: authorId,
    publishedAt: new Date()
  });
  return this.save();
};

campaignSchema.methods.incrementView = function() {
  this.stats.viewCount += 1;
  return this.save();
};

campaignSchema.methods.incrementShare = function() {
  this.stats.shareCount += 1;
  return this.save();
};

// Middleware
campaignSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Auto-generate slug if not provided
  if (this.isNew && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  // Update completion percentage
  if (this.goalAmount > 0) {
    this.stats.completionPercentage = (this.raisedAmount / this.goalAmount) * 100;
  }
  
  // Auto-complete if goal reached
  if (this.raisedAmount >= this.goalAmount && this.status === 'live') {
    this.status = 'completed';
    this.completedAt = new Date();
  }
  
  next();
});

export default mongoose.models.Campaign || mongoose.model('Campaign', campaignSchema);
