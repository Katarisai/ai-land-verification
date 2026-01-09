const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  landId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Land',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedVerifier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'rejected'],
    default: 'pending',
  },
  trustScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  documentClarity: { type: Number, min: 0, max: 100 },
  ownershipContinuity: { type: Number, min: 0, max: 100 },
  legalCleanliness: { type: Number, min: 0, max: 100 },
  environmentalRisk: { type: Number, min: 0, max: 100 },
  constructionFeasibility: { type: Number, min: 0, max: 100 },
  confidence: {
    type: String,
    enum: ['high', 'medium', 'low'],
  },
  documents: [
    {
      fileName: String,
      fileUrl: String,
      verified: Boolean,
      uploadedAt: { type: Date, default: Date.now },
    },
  ],
  comments: String,
  rejectionReason: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: Date,
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Verification', verificationSchema);
