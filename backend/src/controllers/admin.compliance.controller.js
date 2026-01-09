const AuditLog = require('../models/AuditLog');
const Dispute = require('../models/Dispute');

// Get audit logs
exports.getAuditLogs = async (req, res) => {
  try {
    const { action, targetType, page = 1, limit = 20, startDate, endDate } = req.query;
    const query = {};

    if (action) query.action = action;
    if (targetType) query.targetType = targetType;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const logs = await AuditLog.find(query)
      .populate('admin', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await AuditLog.countDocuments(query);

    res.json({
      logs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching audit logs', error: error.message });
  }
};

// Get compliance report
exports.getComplianceReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const totalActions = await AuditLog.countDocuments(query);
    const failedActions = await AuditLog.countDocuments({ ...query, status: 'failed' });
    const successActions = await AuditLog.countDocuments({ ...query, status: 'success' });

    const actionBreakdown = await AuditLog.aggregate([
      { $match: query },
      { $group: { _id: '$action', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      totalActions,
      failedActions,
      successActions,
      successRate: ((successActions / totalActions) * 100 || 0).toFixed(2) + '%',
      actionBreakdown,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating compliance report', error: error.message });
  }
};

// Get data access logs
exports.getDataAccessLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const logs = await AuditLog.find()
      .populate('admin', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    res.json({ logs, totalPages: Math.ceil((await AuditLog.countDocuments()) / limit), currentPage: page });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data access logs', error: error.message });
  }
};

// Get disputes
exports.getDisputes = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;

    const disputes = await Dispute.find(query)
      .populate('userId', 'name email')
      .populate('assignedTo', 'name email')
      .populate('verificationId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ priority: 1, createdAt: -1 });

    const total = await Dispute.countDocuments(query);

    res.json({
      disputes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching disputes', error: error.message });
  }
};

// Update dispute
exports.updateDispute = async (req, res) => {
  try {
    const { disputeId } = req.params;
    const { status, resolution, assignedTo } = req.body;

    const dispute = await Dispute.findByIdAndUpdate(
      disputeId,
      {
        status,
        resolution,
        assignedTo,
        updatedAt: new Date(),
        ...(status === 'resolved' && { resolvedAt: new Date() }),
      },
      { new: true }
    );

    await AuditLog.create({
      admin: req.user.id,
      action: 'Updated dispute',
      targetType: 'dispute',
      targetId: disputeId,
      changes: { status, resolution },
      ipAddress: req.ip,
    });

    res.json({ message: 'Dispute updated successfully', dispute });
  } catch (error) {
    res.status(500).json({ message: 'Error updating dispute', error: error.message });
  }
};

// Add dispute comment
exports.addDisputeComment = async (req, res) => {
  try {
    const { disputeId } = req.params;
    const { text } = req.body;

    const dispute = await Dispute.findByIdAndUpdate(
      disputeId,
      {
        $push: {
          comments: {
            user: req.user.id,
            text,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );

    res.json({ message: 'Comment added successfully', dispute });
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};
