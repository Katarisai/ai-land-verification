const mongoose = require('mongoose');

const systemConfigSchema = new mongoose.Schema({
  key: {
    type: String,
    unique: true,
    required: true,
  },
  value: mongoose.Schema.Types.Mixed,
  category: {
    type: String,
    enum: ['trust-score', 'fees', 'notifications', 'security', 'system', 'email'],
    required: true,
  },
  description: String,
  dataType: {
    type: String,
    enum: ['string', 'number', 'boolean', 'json'],
    default: 'string',
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SystemConfig', systemConfigSchema);
