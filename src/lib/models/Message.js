import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  // Basic Information
  subject: { type: String, required: true },
  content: { type: String, required: true },
  type: {
    type: String,
    enum: ['organizations', 'volunteers', 'system', 'admin'],
    default: 'system'
  },
  
  // Participants
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  recipient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Thread/Conversation
  conversationId: { type: String }, // For grouping related messages
  parentMessage: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Message' 
  },
  
  // Status
  isRead: { type: Boolean, default: false },
  readAt: Date,
  isArchived: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  
  // Priority and Categories
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['general', 'task_related', 'verification', 'system_notification', 'feedback', 'support'],
    default: 'general'
  },
  
  // Attachments
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String,
    fileSize: Number
  }],
  
  // Related Objects
  relatedTask: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Task' 
  },
  relatedCampaign: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Campaign' 
  },
  
  // Metadata
  metadata: {
    automated: { type: Boolean, default: false }, // System-generated message
    requiresResponse: { type: Boolean, default: false },
    template: String, // Template ID if using message templates
    variables: mongoose.Schema.Types.Mixed // Template variables
  }
}, {
  timestamps: true,
  indexes: [
    { recipient: 1, createdAt: -1 },
    { sender: 1, createdAt: -1 },
    { conversationId: 1, createdAt: 1 },
    { isRead: 1, recipient: 1 },
    { type: 1, recipient: 1 }
  ]
});

// Virtual for preview text
messageSchema.virtual('preview').get(function() {
  if (!this.content) return '';
  return this.content.length > 100 
    ? this.content.substring(0, 100) + '...' 
    : this.content;
});

// Method to mark as read
messageSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Static method to get conversation messages
messageSchema.statics.getConversation = function(conversationId) {
  return this.find({ conversationId })
    .populate('sender', 'name email role organization')
    .populate('recipient', 'name email role organization')
    .populate('relatedTask', 'title type')
    .populate('relatedCampaign', 'title organization')
    .sort({ createdAt: 1 });
};

// Static method to get unread count for user
messageSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({ 
    recipient: userId, 
    isRead: false, 
    isDeleted: false 
  });
};

// Pre-save middleware to generate conversation ID
messageSchema.pre('save', function(next) {
  if (!this.conversationId && !this.parentMessage) {
    // Generate new conversation ID for new threads
    this.conversationId = `conv_${this.sender}_${this.recipient}_${Date.now()}`;
  } else if (this.parentMessage && !this.conversationId) {
    // Use parent message's conversation ID
    this.model('Message').findById(this.parentMessage).then(parent => {
      if (parent) {
        this.conversationId = parent.conversationId;
      }
      next();
    }).catch(next);
    return;
  }
  next();
});

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

export default Message;
