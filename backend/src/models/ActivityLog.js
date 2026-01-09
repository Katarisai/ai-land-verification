const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  actionType: {
    type: String,
    enum: ['login', 'logout', 'verification', 'document-upload', 'comment', 'dispute', 'download'],
    required: true,
  },
  resource: String,
  resourceId: mongoose.Schema.Types.ObjectId,
  details: String,
  ipAddress: String,
  userAgent: String,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
