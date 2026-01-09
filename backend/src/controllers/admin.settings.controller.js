const SystemConfig = require('../models/SystemConfig');
const Transaction = require('../models/Transaction');
const AuditLog = require('../models/AuditLog');
const Verification = require('../models/Verification');

// Get system configuration
exports.getSystemConfig = async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};

    const configs = await SystemConfig.find(query).populate('updatedBy', 'name email');

    res.json(configs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching system configuration', error: error.message });
  }
};

// Update system configuration
exports.updateSystemConfig = async (req, res) => {
  try {
    const { key, value, category, description, dataType } = req.body;

    let config = await SystemConfig.findOne({ key });

    if (config) {
      config = await SystemConfig.findByIdAndUpdate(
        config._id,
        {
          value,
          category,
          description,
          dataType,
          updatedBy: req.user.id,
          updatedAt: new Date(),
        },
        { new: true }
      );
    } else {
      config = await SystemConfig.create({
        key,
        value,
        category,
        description,
        dataType,
        updatedBy: req.user.id,
      });
    }

    await AuditLog.create({
      admin: req.user.id,
      action: 'Updated system configuration',
      targetType: 'system',
      details: `Updated ${key}`,
      ipAddress: req.ip,
    });

    res.json({ message: 'Configuration updated successfully', config });
  } catch (error) {
    res.status(500).json({ message: 'Error updating configuration', error: error.message });
  }
};

// Get financial report
exports.getFinancialReport = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    const query = { status: 'completed' };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    if (type) query.type = type;

    const transactions = await Transaction.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    const avgTransaction = transactions.length > 0 ? (totalRevenue / transactions.length).toFixed(2) : 0;

    const breakdown = await Transaction.aggregate([
      { $match: query },
      { $group: { _id: '$type', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);

    res.json({
      totalRevenue,
      avgTransaction,
      transactionCount: transactions.length,
      breakdown,
      transactions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating financial report', error: error.message });
  }
};

// Get trust score analytics
exports.getTrustScoreAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const stats = await Verification.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          avgTrustScore: { $avg: '$trustScore' },
          minTrustScore: { $min: '$trustScore' },
          maxTrustScore: { $max: '$trustScore' },
          totalVerifications: { $sum: 1 },
        },
      },
    ]);

    const distribution = await Verification.aggregate([
      { $match: query },
      {
        $bucket: {
          groupBy: '$trustScore',
          boundaries: [0, 20, 40, 60, 80, 100],
          default: 'Other',
          output: { count: { $sum: 1 } },
        },
      },
    ]);

    const factorAnalysis = await Verification.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          avgDocumentClarity: { $avg: '$documentClarity' },
          avgOwnershipContinuity: { $avg: '$ownershipContinuity' },
          avgLegalCleanliness: { $avg: '$legalCleanliness' },
          avgEnvironmentalRisk: { $avg: '$environmentalRisk' },
          avgConstructionFeasibility: { $avg: '$constructionFeasibility' },
        },
      },
    ]);

    res.json({
      overallStats: stats[0] || {},
      distribution,
      factorAnalysis: factorAnalysis[0] || {},
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trust score analytics', error: error.message });
  }
};

// Get billing report
exports.getBillingReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query).populate('userId', 'name email');

    const summary = await Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' },
        },
      },
    ]);

    res.json({
      transactions,
      summary,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating billing report', error: error.message });
  }
};
