const mongoose = require('mongoose');

const workDoneReportSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  period: {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  totalHours: {
    type: Number,
    default: 0,
  },
  totalWorkers: {
    type: Number,
    default: 0,
  },
  materialsConsumed: [{
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RawMaterial',
    },
    quantity: Number,
    cost: Number,
  }],
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  milestones: [{
    name: String,
    completed: Boolean,
    date: Date,
  }],
  issues: [{
    type: String,
  }],
  recommendations: [{
    type: String,
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('WorkDoneReport', workDoneReportSchema);
