const Verification = require('../models/Verification');
const AuditLog = require('../models/AuditLog');
const User = require('../models/User');

// Get all verifications with filters
exports.getAllVerifications = async (req, res) => {
  try {
    const { status, verifierId, page = 1, limit = 10, sortBy = 'createdAt' } = req.query;
    const query = {};

    if (status) query.status = status;
    if (verifierId) query.assignedVerifier = verifierId;

    const verifications = await Verification.find(query)
      .populate('userId', 'name email')
      .populate('assignedVerifier', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ [sortBy]: -1 });

    const total = await Verification.countDocuments(query);

    res.json({
      verifications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching verifications', error: error.message });
  }
};

// Get verification details
exports.getVerificationDetails = async (req, res) => {
  try {
    const { verificationId } = req.params;

    const verification = await Verification.findById(verificationId)
      .populate('userId', 'name email')
      .populate('assignedVerifier', 'name email');

    if (!verification) {
      return res.status(404).json({ message: 'Verification not found' });
    }

    res.json(verification);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching verification', error: error.message });
  }
};

// Approve verification
exports.approveVerification = async (req, res) => {
  try {
    const { verificationId } = req.params;
    const { trustScore, documentClarity, ownershipContinuity, legalCleanliness, environmentalRisk, constructionFeasibility, confidence, comments } = req.body;

    const verification = await Verification.findByIdAndUpdate(
      verificationId,
      {
        status: 'completed',
        trustScore,
        documentClarity,
        ownershipContinuity,
        legalCleanliness,
        environmentalRisk,
        constructionFeasibility,
        confidence,
        comments,
        completedAt: new Date(),
      },
      { new: true }
    );

    await AuditLog.create({
      admin: req.user.id,
      action: 'Approved verification',
      targetType: 'verification',
      targetId: verificationId,
      changes: { status: 'completed', trustScore },
      ipAddress: req.ip,
    });

    res.json({ message: 'Verification approved successfully', verification });
  } catch (error) {
    res.status(500).json({ message: 'Error approving verification', error: error.message });
  }
};

// Reject verification
exports.rejectVerification = async (req, res) => {
  try {
    const { verificationId } = req.params;
    const { rejectionReason } = req.body;

    const verification = await Verification.findByIdAndUpdate(
      verificationId,
      {
        status: 'rejected',
        rejectionReason,
        completedAt: new Date(),
      },
      { new: true }
    );

    await AuditLog.create({
      admin: req.user.id,
      action: 'Rejected verification',
      targetType: 'verification',
      targetId: verificationId,
      details: rejectionReason,
      ipAddress: req.ip,
    });

    res.json({ message: 'Verification rejected successfully', verification });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting verification', error: error.message });
  }
};

// Assign verifier
exports.assignVerifier = async (req, res) => {
  try {
    const { verificationId } = req.params;
    const { verifierId } = req.body;

    // Check if verifier exists and has legal role
    const verifier = await User.findById(verifierId);
    if (!verifier || verifier.role !== 'legal') {
      return res.status(400).json({ message: 'Invalid verifier' });
    }

    const verification = await Verification.findByIdAndUpdate(
      verificationId,
      {
        assignedVerifier: verifierId,
        status: 'in-progress',
      },
      { new: true }
    );

    await AuditLog.create({
      admin: req.user.id,
      action: 'Assigned verifier',
      targetType: 'verification',
      targetId: verificationId,
      changes: { assignedVerifier: verifierId },
      ipAddress: req.ip,
    });

    res.json({ message: 'Verifier assigned successfully', verification });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning verifier', error: error.message });
  }
};

// Get verification statistics
exports.getVerificationStats = async (req, res) => {
  try {
    const stats = await Verification.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgTrustScore: { $avg: '$trustScore' },
        },
      },
    ]);

    const confidenceLevels = await Verification.aggregate([
      { $group: { _id: '$confidence', count: { $sum: 1 } } },
    ]);

    res.json({
      byStatus: stats,
      byConfidence: confidenceLevels,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
};

// Override trust score
exports.overrideTrustScore = async (req, res) => {
  try {
    const { verificationId } = req.params;
    const { newTrustScore, reason } = req.body;

    if (newTrustScore < 0 || newTrustScore > 100) {
      return res.status(400).json({ message: 'Trust score must be between 0 and 100' });
    }

    const verification = await Verification.findByIdAndUpdate(
      verificationId,
      { trustScore: newTrustScore },
      { new: true }
    );

    await AuditLog.create({
      admin: req.user.id,
      action: 'Override trust score',
      targetType: 'trustscore',
      targetId: verificationId,
      changes: { newTrustScore, oldTrustScore: verification.trustScore },
      details: reason,
      ipAddress: req.ip,
    });

    res.json({ message: 'Trust score overridden successfully', verification });
  } catch (error) {
    res.status(500).json({ message: 'Error overriding trust score', error: error.message });
  }
};
