import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  // Basic Information
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: {
    type: String,
    enum: ['verification', 'field_visit', 'documentation', 'content_review', 'investigation', 'follow_up'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Relationships
  campaign: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Campaign', 
    required: true 
  },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Task Details
  requirements: [String],
  expectedDeliverables: [String],
  estimatedHours: { type: Number, min: 0 },
  actualHours: { type: Number, min: 0 },
  
  // Location (if field work required)
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  
  // Timeline
  deadline: Date,
  estimatedStartDate: Date,
  actualStartDate: Date,
  actualCompletionDate: Date,
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in_progress', 'review', 'completed', 'cancelled', 'overdue'],
    default: 'pending'
  },
  
  // Progress and Updates
  progress: { type: Number, default: 0, min: 0, max: 100 },
  updates: [{
    content: String,
    images: [String],
    documents: [String],
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    submittedAt: { type: Date, default: Date.now },
    type: {
      type: String,
      enum: ['progress', 'issue', 'completion', 'question']
    }
  }],
  
  // Results and Deliverables
  results: {
    summary: String,
    findings: [String],
    recommendations: [String],
    evidence: [{
      type: String, // 'image', 'document', 'video', 'audio'
      url: String,
      caption: String,
      uploadedAt: { type: Date, default: Date.now }
    }],
    verificationStatus: {
      type: String,
      enum: ['verified', 'needs_clarification', 'rejected', 'pending'],
      default: 'pending'
    }
  },
  
  // Admin Review
  adminReview: {
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: Date,
    decision: {
      type: String,
      enum: ['approved', 'rejected', 'needs_revision']
    },
    feedback: String,
    internalNotes: String
  },
  
  // AI Matching (for auto-assignment)
  aiMatchScore: { type: Number, min: 0, max: 100 },
  matchingCriteria: {
    skills: [String],
    experience: [String],
    location: String,
    availability: String
  },
  
  // Compensation (if applicable)
  compensation: {
    type: {
      type: String,
      enum: ['volunteer', 'paid', 'reimbursement']
    },
    amount: Number,
    currency: { type: String, default: 'USD' },
    paid: { type: Boolean, default: false },
    paidAt: Date
  },
  
  // Flags and Issues
  flagged: { type: Boolean, default: false },
  flaggedReason: String,
  issues: [{
    description: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reportedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open'
    },
    resolution: String,
    resolvedAt: Date
  }],
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  assignedAt: Date,
  completedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
taskSchema.index({ status: 1, priority: 1 });
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ campaign: 1 });
taskSchema.index({ deadline: 1 });
taskSchema.index({ createdAt: -1 });
taskSchema.index({ type: 1 });

// Virtuals
taskSchema.virtual('isOverdue').get(function() {
  return this.deadline && new Date() > this.deadline && this.status !== 'completed';
});

taskSchema.virtual('timeRemaining').get(function() {
  if (!this.deadline) return null;
  const now = new Date();
  const deadline = new Date(this.deadline);
  return deadline - now;
});

taskSchema.virtual('daysRemaining').get(function() {
  const timeRemaining = this.timeRemaining;
  if (timeRemaining === null) return null;
  return Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
});

// Methods
taskSchema.methods.assign = function(volunteerId, assignedById) {
  this.assignedTo = volunteerId;
  this.assignedAt = new Date();
  this.status = 'assigned';
  this.updates.push({
    content: 'Task assigned to volunteer',
    submittedBy: assignedById,
    type: 'progress'
  });
  return this.save();
};

taskSchema.methods.updateProgress = function(progressData, userId) {
  this.progress = progressData.progress || this.progress;
  if (progressData.status) {
    this.status = progressData.status;
  }
  
  this.updates.push({
    content: progressData.content,
    images: progressData.images || [],
    documents: progressData.documents || [],
    submittedBy: userId,
    type: progressData.type || 'progress'
  });
  
  if (progressData.progress === 100 || progressData.status === 'completed') {
    this.status = 'review';
    this.actualCompletionDate = new Date();
  }
  
  return this.save();
};

taskSchema.methods.complete = function(results, reviewerId) {
  this.status = 'completed';
  this.completedAt = new Date();
  this.progress = 100;
  
  if (results) {
    this.results = {
      ...this.results,
      ...results
    };
  }
  
  this.adminReview = {
    reviewedBy: reviewerId,
    reviewedAt: new Date(),
    decision: 'approved'
  };
  
  return this.save();
};

// Middleware
taskSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Auto-set overdue status
  if (this.deadline && new Date() > this.deadline && this.status === 'in_progress') {
    this.status = 'overdue';
  }
  
  // Auto-set start date when status changes to in_progress
  if (this.status === 'in_progress' && !this.actualStartDate) {
    this.actualStartDate = new Date();
  }
  
  next();
});

export default mongoose.models.Task || mongoose.model('Task', taskSchema);
