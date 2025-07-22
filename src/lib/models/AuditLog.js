import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  // Action Information
  action: { type: String, required: true },
  entity: { type: String, required: true }, // User, Campaign, Task, etc.
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
  
  // Actor Information
  performedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  performedByRole: String,
  
  // Details
  description: String,
  changes: {
    before: mongoose.Schema.Types.Mixed,
    after: mongoose.Schema.Types.Mixed,
    fields: [String] // List of changed fields
  },
  
  // Context
  ipAddress: String,
  userAgent: String,
  sessionId: String,
  requestId: String,
  
  // Categorization
  category: {
    type: String,
    enum: [
      'user_management', 'campaign_management', 'task_management',
      'payment_management', 'moderation', 'security', 'settings',
      'authentication', 'authorization', 'data_export'
    ],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  
  // Additional Data
  metadata: mongoose.Schema.Types.Mixed,
  
  // Timestamps
  timestamp: { type: Date, default: Date.now },
  
  // Retention
  expiresAt: Date
}, {
  timestamps: true
});

// Indexes
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ performedBy: 1, timestamp: -1 });
auditLogSchema.index({ entity: 1, entityId: 1, timestamp: -1 });
auditLogSchema.index({ category: 1, timestamp: -1 });
auditLogSchema.index({ severity: 1, timestamp: -1 });
auditLogSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
