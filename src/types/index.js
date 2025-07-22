// User Role Constants
export const UserRole = {
  ADMIN: 'admin',
  DONOR: 'donor',
  VOLUNTEER: 'volunteer',
  DONEE: 'donee',
};

// Campaign Status Constants
export const CampaignStatus = {
  DRAFT: 'draft',
  PENDING: 'pending',
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  SUSPENDED: 'suspended'
};

// Campaign Category Constants
export const CampaignCategory = {
  EDUCATION: 'education',
  HEALTH: 'health',
  DISASTER_RELIEF: 'disaster-relief',
  COMMUNITY: 'community',
  ENVIRONMENT: 'environment',
  TECHNOLOGY: 'technology',
  ARTS: 'arts',
  SPORTS: 'sports',
  ANIMALS: 'animals',
  OTHER: 'other'
};

// Donation Status Constants
export const DonationStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  CANCELLED: 'cancelled'
};

// Payment Method Constants
export const PaymentMethod = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PAYPAL: 'paypal',
  BANK_TRANSFER: 'bank_transfer',
  CRYPTO: 'crypto',
  MOBILE_PAYMENT: 'mobile_payment'
};

// Task Status Constants
export const TaskStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Task Priority Constants
export const TaskPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

// Notification Type Constants
export const NotificationType = {
  DONATION_RECEIVED: 'donation_received',
  CAMPAIGN_UPDATE: 'campaign_update',
  GOAL_REACHED: 'goal_reached',
  CAMPAIGN_APPROVED: 'campaign_approved',
  CAMPAIGN_REJECTED: 'campaign_rejected',
  WITHDRAWAL_APPROVED: 'withdrawal_approved',
  SYSTEM_ANNOUNCEMENT: 'system_announcement'
};

// Admin Permission Constants
export const AdminPermissions = {
  USER_MANAGEMENT: 'user_management',
  CAMPAIGN_MANAGEMENT: 'campaign_management',
  DONATION_MANAGEMENT: 'donation_management',
  PAYMENT_MANAGEMENT: 'payment_management',
  TASK_MANAGEMENT: 'task_management',
  CONTENT_MODERATION: 'content_moderation',
  ANALYTICS_VIEW: 'analytics_view',
  SYSTEM_SETTINGS: 'system_settings',
  AUDIT_LOGS: 'audit_logs',
  COMMUNICATION: 'communication',
  FINANCIAL_REPORTS: 'financial_reports'
};

// Validation Constants
export const ValidationLimits = {
  USER_NAME_MIN: 2,
  USER_NAME_MAX: 50,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 128,
  CAMPAIGN_TITLE_MIN: 10,
  CAMPAIGN_TITLE_MAX: 100,
  CAMPAIGN_DESCRIPTION_MIN: 50,
  CAMPAIGN_DESCRIPTION_MAX: 5000,
  DONATION_MIN: 1,
  DONATION_MAX: 100000,
  COMMENT_MAX: 500
};

// API Response Constants
export const ApiResponseStatus = {
  SUCCESS: 'success',
  ERROR: 'error',
  LOADING: 'loading'
};

// File Upload Constants
export const FileTypes = {
  IMAGE: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  VIDEO: ['video/mp4', 'video/webm', 'video/ogg']
};

export const FileSizeLimits = {
  AVATAR: 5 * 1024 * 1024, // 5MB
  CAMPAIGN_IMAGE: 10 * 1024 * 1024, // 10MB
  DOCUMENT: 20 * 1024 * 1024, // 20MB
  VIDEO: 100 * 1024 * 1024 // 100MB
};

// Default Values
export const DefaultValues = {
  PAGINATION_LIMIT: 20,
  CAMPAIGN_GOAL_MIN: 100,
  CAMPAIGN_DURATION_MAX: 365, // days
  PASSWORD_RESET_EXPIRY: 3600000, // 1 hour in milliseconds
  EMAIL_VERIFICATION_EXPIRY: 86400000, // 24 hours in milliseconds
  SESSION_TIMEOUT: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

// Helper Functions
export const isValidUserRole = (role) => {
  return Object.values(UserRole).includes(role);
};

export const isValidCampaignStatus = (status) => {
  return Object.values(CampaignStatus).includes(status);
};

export const isValidDonationStatus = (status) => {
  return Object.values(DonationStatus).includes(status);
};

export const isValidPaymentMethod = (method) => {
  return Object.values(PaymentMethod).includes(method);
};

export const isValidTaskStatus = (status) => {
  return Object.values(TaskStatus).includes(status);
};

export const isValidTaskPriority = (priority) => {
  return Object.values(TaskPriority).includes(priority);
};

export const isValidNotificationType = (type) => {
  return Object.values(NotificationType).includes(type);
};

export const hasAdminPermission = (userPermissions, requiredPermission) => {
  return userPermissions && userPermissions.includes(requiredPermission);
};

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatDate = (date, options = {}) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  }).format(new Date(date));
};

export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

export const calculateProgress = (raised, goal) => {
  if (!goal || goal <= 0) return 0;
  return Math.min((raised / goal) * 100, 100);
};

export const getDaysRemaining = (endDate) => {
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(diffDays, 0);
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && 
         password.length >= ValidationLimits.PASSWORD_MIN && 
         password.length <= ValidationLimits.PASSWORD_MAX;
};

export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};
