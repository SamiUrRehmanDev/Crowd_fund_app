import mongoose from 'mongoose';

const systemSettingsSchema = new mongoose.Schema({
  // General Settings
  siteName: { type: String, default: 'CrowdFunding Platform' },
  siteDescription: String,
  logoUrl: String,
  faviconUrl: String,
  
  // Localization
  defaultLanguage: { type: String, default: 'en' },
  supportedLanguages: [String],
  defaultTimezone: { type: String, default: 'UTC' },
  defaultCurrency: { type: String, default: 'USD' },
  supportedCurrencies: [String],
  
  // Payment Settings
  paymentGateways: {
    stripe: {
      enabled: { type: Boolean, default: false },
      publicKey: String,
      secretKey: String,
      webhookSecret: String,
      sandboxMode: { type: Boolean, default: true }
    },
    razorpay: {
      enabled: { type: Boolean, default: false },
      keyId: String,
      keySecret: String,
      webhookSecret: String,
      sandboxMode: { type: Boolean, default: true }
    },
    paypal: {
      enabled: { type: Boolean, default: false },
      clientId: String,
      clientSecret: String,
      sandboxMode: { type: Boolean, default: true }
    }
  },
  
  // Donation Limits
  donationLimits: {
    minimum: { type: Number, default: 1 },
    maximum: { type: Number, default: 10000 },
    dailyLimit: { type: Number, default: 50000 },
    monthlyLimit: { type: Number, default: 500000 }
  },
  
  // Campaign Settings
  campaignSettings: {
    autoApproval: { type: Boolean, default: false },
    requireVerification: { type: Boolean, default: true },
    maxDuration: { type: Number, default: 365 }, // days
    minGoalAmount: { type: Number, default: 100 },
    maxGoalAmount: { type: Number, default: 1000000 },
    allowAnonymousCampaigns: { type: Boolean, default: false }
  },
  
  // Content Moderation
  moderation: {
    autoModerationEnabled: { type: Boolean, default: true },
    profanityFilter: { type: Boolean, default: true },
    imageModeration: { type: Boolean, default: true },
    fraudDetection: { type: Boolean, default: true },
    fraudThreshold: { type: Number, default: 75 }, // 0-100
    suspiciousActivityThreshold: { type: Number, default: 85 }
  },
  
  // Email Settings
  email: {
    provider: { type: String, enum: ['sendgrid', 'mailgun', 'ses'], default: 'sendgrid' },
    apiKey: String,
    fromEmail: String,
    fromName: String,
    replyToEmail: String,
    templates: {
      welcome: String,
      emailVerification: String,
      passwordReset: String,
      donationReceipt: String,
      campaignApproved: String,
      campaignRejected: String,
      donationReceived: String,
      goalReached: String
    }
  },
  
  // SMS Settings
  sms: {
    provider: { type: String, enum: ['twilio', 'messagebird'], default: 'twilio' },
    accountSid: String,
    authToken: String,
    fromNumber: String,
    enabled: { type: Boolean, default: false }
  },
  
  // Feature Flags
  features: {
    userRegistration: { type: Boolean, default: true },
    socialLogin: { type: Boolean, default: true },
    twoFactorAuth: { type: Boolean, default: false },
    guestDonations: { type: Boolean, default: true },
    campaignSharing: { type: Boolean, default: true },
    volunteerProgram: { type: Boolean, default: true },
    aiMatching: { type: Boolean, default: false },
    advancedAnalytics: { type: Boolean, default: true },
    mobileApp: { type: Boolean, default: false }
  },
  
  // Analytics
  analytics: {
    googleAnalyticsId: String,
    facebookPixelId: String,
    hotjarId: String,
    enabled: { type: Boolean, default: true }
  },
  
  // Social Media
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
    youtube: String
  },
  
  // Security
  security: {
    passwordPolicy: {
      minLength: { type: Number, default: 8 },
      requireUppercase: { type: Boolean, default: true },
      requireLowercase: { type: Boolean, default: true },
      requireNumbers: { type: Boolean, default: true },
      requireSymbols: { type: Boolean, default: false },
      maxAge: { type: Number, default: 90 } // days
    },
    sessionTimeout: { type: Number, default: 30 }, // minutes
    maxLoginAttempts: { type: Number, default: 5 },
    lockoutDuration: { type: Number, default: 30 }, // minutes
    ipWhitelist: [String],
    ipBlacklist: [String]
  },
  
  // File Upload
  fileUpload: {
    maxFileSize: { type: Number, default: 10485760 }, // 10MB in bytes
    allowedTypes: [String],
    storageProvider: { type: String, enum: ['local', 's3', 'cloudinary'], default: 'local' },
    s3: {
      bucket: String,
      region: String,
      accessKey: String,
      secretKey: String
    },
    cloudinary: {
      cloudName: String,
      apiKey: String,
      apiSecret: String
    }
  },
  
  // API Settings
  api: {
    rateLimit: {
      windowMs: { type: Number, default: 900000 }, // 15 minutes
      maxRequests: { type: Number, default: 100 }
    },
    cors: {
      enabled: { type: Boolean, default: true },
      origins: [String]
    },
    versioning: { type: Boolean, default: true }
  },
  
  // Maintenance
  maintenance: {
    enabled: { type: Boolean, default: false },
    message: String,
    allowedIPs: [String],
    scheduledStart: Date,
    scheduledEnd: Date
  },
  
  // Backup and Recovery
  backup: {
    enabled: { type: Boolean, default: true },
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'daily' },
    retention: { type: Number, default: 30 }, // days
    destination: { type: String, enum: ['local', 's3', 'gcs'], default: 'local' }
  },
  
  // Notifications
  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: true },
    inApp: { type: Boolean, default: true },
    adminEmail: String,
    webhookUrls: [String]
  },
  
  // Legal and Compliance
  legal: {
    termsOfServiceUrl: String,
    privacyPolicyUrl: String,
    cookiePolicyUrl: String,
    gdprCompliant: { type: Boolean, default: false },
    ccpaCompliant: { type: Boolean, default: false }
  },
  
  // Version and Updates
  version: String,
  lastUpdated: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

// Ensure only one settings document exists
systemSettingsSchema.index({}, { unique: true });

// Methods
systemSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

systemSettingsSchema.methods.updateSetting = function(path, value, updatedBy) {
  this.set(path, value);
  this.lastUpdated = new Date();
  this.updatedBy = updatedBy;
  return this.save();
};

export default mongoose.models.SystemSettings || mongoose.model('SystemSettings', systemSettingsSchema);
