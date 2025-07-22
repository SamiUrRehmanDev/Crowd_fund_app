import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // Basic Information
  firstName: { type: String },
  lastName: { type: String },
  name: { type: String }, // Adding name field as it's used in auth
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  dateOfBirth: { type: Date },
  
  // Authentication
  password: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  twoFactorEnabled: { type: Boolean, default: false },
  
  // Profile
  avatar: { type: String },
  bio: { type: String },
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
  
  // Role and Status
  role: { 
    type: String, 
    enum: ['admin', 'volunteer', 'donee', 'donor'], 
    required: true 
  },
  isAdmin: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'banned', 'pending'],
    default: 'pending'
  },
  
  // Admin-specific fields
  adminLevel: {
    type: String,
    enum: ['super', 'manager', 'moderator'],
    required: function() { return this.role === 'admin'; }
  },
  permissions: [{
    type: String,
    enum: [
      'user_management', 
      'campaign_management', 
      'task_management',
      'payment_management', 
      'analytics_view', 
      'content_moderation', 
      'system_configuration',
      'communication_management',
      'analytics', 
      'moderation', 
      'settings',
      'notifications', 
      'reports', 
      'audit_logs',
      'system_settings',
      'financial_reports'
    ]
  }],
  
  // Verification
  verificationStatus: {
    type: String,
    enum: ['unverified', 'pending', 'verified', 'rejected'],
    default: 'unverified'
  },
  verificationDocuments: [{
    type: String,
    url: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    uploadedAt: { type: Date, default: Date.now },
    reviewedAt: Date,
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  
  // Statistics
  stats: {
    totalDonations: { type: Number, default: 0 },
    donationCount: { type: Number, default: 0 },
    totalReceived: { type: Number, default: 0 },
    campaignsCreated: { type: Number, default: 0 },
    tasksCompleted: { type: Number, default: 0 },
    volunteerHours: { type: Number, default: 0 },
    lastActivity: Date,
    loginCount: { type: Number, default: 0 },
    lastLogin: Date
  },
  
  // Preferences
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'donors', 'private'],
        default: 'public'
      },
      showDonations: { type: Boolean, default: true },
      showLocation: { type: Boolean, default: false }
    },
    language: { type: String, default: 'en' },
    timezone: { type: String, default: 'UTC' }
  },
  
  // Security
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // Admin actions tracking
  adminNotes: [{
    note: String,
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addedAt: { type: Date, default: Date.now },
    category: {
      type: String,
      enum: ['warning', 'info', 'violation', 'support', 'verification']
    }
  }],
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1, status: 1 });
userSchema.index({ verificationStatus: 1 });
userSchema.index({ 'location.city': 1, 'location.country': 1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Methods
userSchema.methods.toSafeObject = function() {
  const user = this.toObject();
  delete user.password;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  return user;
};

userSchema.methods.incrementLoginAttempts = function() {
  // Lock account after 5 failed attempts for 30 minutes
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    this.lockUntil = Date.now() + 30 * 60 * 1000; // 30 minutes
  }
  this.loginAttempts += 1;
  return this.save();
};

userSchema.methods.resetLoginAttempts = function() {
  this.loginAttempts = 0;
  this.lockUntil = undefined;
  return this.save();
};

// Middleware
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.User || mongoose.model('User', userSchema);
