const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  // References
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Land',
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SellerProfile',
    required: true,
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
  },
  
  // Inquiry Details
  listingTitle: String,
  buyerName: String,
  buyerEmail: String,
  buyerPhone: String,
  
  // Buyer Information
  buyerType: {
    type: String,
    enum: ['first-time-buyer', 'investor', 'developer', 'agent', 'other'],
  },
  buyerTimeline: {
    type: String,
    enum: ['immediate', '1-3-months', '3-6-months', 'not-sure'],
  },
  budgetRange: {
    minBudget: Number,
    maxBudget: Number,
  },
  
  // Inquiry Message & Communication
  message: String, // Initial inquiry message
  conversationThread: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    senderType: {
      type: String,
      enum: ['buyer', 'seller'],
    },
    senderName: String,
    message: String,
    attachments: [String], // URLs
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  
  // Status Tracking
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'negotiating', 'won', 'lost', 'archived'],
    default: 'new',
  },
  statusChangedAt: Date,
  statusChangedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  
  // Follow-up Management
  followUpDate: Date,
  followUpNotes: String,
  reminderSet: Boolean,
  
  // Internal Notes (Seller Only)
  internalNotes: String,
  sellerTags: [String], // For categorization
  
  // Meeting/Viewing
  scheduledMeeting: {
    date: Date,
    time: String,
    location: String,
    type: {
      type: String,
      enum: ['virtual', 'in-person', 'phone'],
    },
  },
  meetingCompleted: Boolean,
  meetingNotes: String,
  
  // Metadata
  firstResponseTime: Number, // in hours
  lastMessageAt: Date,
  source: {
    type: String,
    enum: ['website', 'app', 'email', 'phone', 'agent-referral'],
    default: 'website',
  },
  
  // Quality Metrics
  qualityScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  closedAt: Date,
  
  // Soft Metadata
  isArchived: {
    type: Boolean,
    default: false,
  },
  archivedAt: Date,
});

// Indexes
inquirySchema.index({ sellerId: 1, createdAt: -1 });
inquirySchema.index({ buyerId: 1, createdAt: -1 });
inquirySchema.index({ listingId: 1 });
inquirySchema.index({ status: 1 });
inquirySchema.index({ sellerId: 1, status: 1 });

module.exports = mongoose.model('Inquiry', inquirySchema);
