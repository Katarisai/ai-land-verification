const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  // References
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
  inquiryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inquiry',
  },
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Land',
  },
  
  // Lead Information
  leadName: String,
  leadEmail: String,
  leadPhone: String,
  companyName: String,
  
  // Lead Profile
  leadType: {
    type: String,
    enum: ['individual-buyer', 'investor', 'corporate-buyer', 'agent', 'developer', 'other'],
    default: 'individual-buyer',
  },
  
  budget: {
    minBudget: Number,
    maxBudget: Number,
    currency: {
      type: String,
      default: 'USD',
    },
  },
  
  timeline: {
    type: String,
    enum: ['immediate', '1-3-months', '3-6-months', '6-12-months', 'not-decided', 'not-interested'],
  },
  
  propertyPreference: {
    type: [String],
    enum: ['Agricultural', 'Residential', 'Commercial', 'Industrial', 'Recreational', 'Mixed Use'],
  },
  
  // Lead Status Pipeline
  status: {
    type: String,
    enum: ['new', 'contacted', 'interested', 'qualified', 'proposal-sent', 'negotiating', 'won', 'lost'],
    default: 'new',
  },
  
  statusHistory: [{
    status: String,
    changedAt: {
      type: Date,
      default: Date.now,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: String,
  }],
  
  // Lead Scoring
  leadScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  
  scoreBreakdown: {
    engagement: Number, // 0-30
    budget: Number, // 0-20
    timeline: Number, // 0-20
    needFit: Number, // 0-20
    communication: Number, // 0-10
  },
  
  // Engagement Metrics
  engagement: {
    firstContactDate: Date,
    lastInteractionDate: Date,
    totalInteractions: {
      type: Number,
      default: 0,
    },
    emailsSent: Number,
    callsMade: Number,
    meetingsScheduled: Number,
    meetingsAttended: Number,
    documentsSent: Number,
    proposalsSent: Number,
  },
  
  // Sales Notes & Plan
  salesPlan: String,
  notes: [{
    noteText: String,
    noteType: {
      type: String,
      enum: ['general', 'follow-up', 'concern', 'opportunity', 'quote'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  
  // Deal Information (if applicable)
  dealAmount: Number,
  dealCurrency: {
    type: String,
    default: 'USD',
  },
  dealClosedDate: Date,
  dealStatus: {
    type: String,
    enum: ['pending', 'in-progress', 'closed-won', 'closed-lost', 'cancelled'],
  },
  dealNotes: String,
  
  // Contact Preferences
  preferredContactMethod: {
    type: String,
    enum: ['email', 'phone', 'sms', 'whatsapp', 'in-person'],
  },
  
  // Source & Properties
  leadSource: {
    type: String,
    enum: ['direct', 'referral', 'website', 'app', 'advertisement', 'social-media', 'cold-call', 'other'],
  },
  linkedProperties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Land',
  }],
  
  // Follow-up Scheduling
  nextFollowUpDate: Date,
  nextFollowUpTask: String,
  followUpFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'bi-weekly', 'monthly', 'as-needed'],
  },
  
  // Soft Delete & Archive
  isArchived: {
    type: Boolean,
    default: false,
  },
  archivedAt: Date,
  archivedReason: String,
  
  // Notifications
  notifyOnStatusChange: {
    type: Boolean,
    default: true,
  },
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

// Indexes
leadSchema.index({ sellerId: 1, createdAt: -1 });
leadSchema.index({ sellerId: 1, status: 1 });
leadSchema.index({ buyerId: 1 });
leadSchema.index({ leadScore: -1 });
leadSchema.index({ status: 1 });

module.exports = mongoose.model('Lead', leadSchema);
