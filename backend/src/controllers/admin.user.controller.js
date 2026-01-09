const User = require('../models/User');
const Verification = require('../models/Verification');
const AuditLog = require('../models/AuditLog');
const ActivityLog = require('../models/ActivityLog');

// Dashboard Overview - Get KPIs and statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVerifications = await Verification.countDocuments();
    const pendingVerifications = await Verification.countDocuments({ status: 'pending' });
    const completedVerifications = await Verification.countDocuments({ status: 'completed' });

    const avgTrustScore =
      (await Verification.aggregate([{ $group: { _id: null, avg: { $avg: '$trustScore' } } }])).length > 0
        ? (await Verification.aggregate([{ $group: { _id: null, avg: { $avg: '$trustScore' } } }]))[0].avg
        : 0;

    const buyersCount = await User.countDocuments({ role: 'buyer' });
    const sellersCount = await User.countDocuments({ role: 'seller' });
    const verifiersCount = await User.countDocuments({ role: 'legal' });

    // Recent activity
    const recentActivity = await ActivityLog.find()
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      totalUsers,
      totalVerifications,
      pendingVerifications,
      completedVerifications,
      avgTrustScore: avgTrustScore.toFixed(2),
      buyersCount,
      sellersCount,
      verifiersCount,
      recentActivity,
      completionRate: ((completedVerifications / totalVerifications) * 100 || 0).toFixed(2) + '%',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};

// Get all users with filters
exports.getAllUsers = async (req, res) => {
  try {
    const { role, status, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Update user status/role
exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role, active } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { role, active },
      { new: true }
    ).select('-password');

    // Log audit
    await AuditLog.create({
      admin: req.user.id,
      action: 'Updated user role/status',
      targetType: 'user',
      targetId: userId,
      changes: { role, active },
      ipAddress: req.ip,
    });

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// Get user activity logs
exports.getUserActivityLogs = async (req, res) => {
  try {
    const { userId, page = 1, limit = 20 } = req.query;

    const logs = await ActivityLog.find(userId ? { userId } : {})
      .populate('userId', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await ActivityLog.countDocuments(userId ? { userId } : {});

    res.json({
      logs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activity logs', error: error.message });
  }
};

// Deactivate user
exports.deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { active: false },
      { new: true }
    ).select('-password');

    await AuditLog.create({
      admin: req.user.id,
      action: 'Deactivated user',
      targetType: 'user',
      targetId: userId,
      details: reason,
      ipAddress: req.ip,
    });

    res.json({ message: 'User deactivated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error deactivating user', error: error.message });
  }
};

// Overview grouped by roles including creator and last login/activity summary
exports.getUsersOverview = async (req, res) => {
  try {
    const allRoles = ['buyer', 'seller', 'legal'];
    const { role, page = 1, limit = 10, startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    const buildOverviewForRole = async (r, pg = 1, lim = 10) => {
      const total = await User.countDocuments({ role: r });
      const users = await User.find({ role: r })
        .select('-password')
        .populate('createdBy', 'name email role')
        .limit(Number(lim))
        .skip((Number(pg) - 1) * Number(lim))
        .sort({ createdAt: -1 });

      const enriched = await Promise.all(users.map(async (u) => {
        const lastLogin = await ActivityLog.findOne({ userId: u._id, actionType: 'login' })
          .sort({ createdAt: -1 })
          .lean();

        const recentAdds = await ActivityLog.find({
          userId: u._id,
          actionType: { $in: ['document-upload', 'verification'] },
          ...(dateFilter.createdAt ? { createdAt: dateFilter.createdAt } : {}),
        })
          .sort({ createdAt: -1 })
          .limit(20)
          .lean();

        return {
          _id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          createdAt: u.createdAt,
          createdBy: u.createdBy || null,
          lastLoginAt: lastLogin?.createdAt || null,
          recentAdds: recentAdds.map((r) => ({
            action: r.action,
            actionType: r.actionType,
            resource: r.resource,
            resourceId: r.resourceId || null,
            createdAt: r.createdAt,
          })),
          addsCount: recentAdds.length,
        };
      }));

      return {
        role: r,
        total,
        count: enriched.length,
        page: Number(pg),
        totalPages: Math.ceil(total / Number(lim)),
        users: enriched,
      };
    };

    if (role && allRoles.includes(role)) {
      const overview = await buildOverviewForRole(role, page, limit);
      return res.json({ roleOverview: overview });
    }

    const rolesSummary = {};
    for (const r of allRoles) {
      rolesSummary[r] = await buildOverviewForRole(r, 1, 10);
    }
    res.json({ rolesSummary });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users overview', error: error.message });
  }
};

// Login summary for every login grouped by user
exports.getLoginSummary = async (req, res) => {
  try {
    const logs = await ActivityLog.aggregate([
      { $match: { actionType: 'login' } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$userId',
          lastLoginAt: { $first: '$createdAt' },
          totalLogins: { $sum: 1 },
        },
      },
    ]);

    const withUsers = await User.populate(logs, { path: '_id', select: 'name email role' });

    res.json({ users: withUsers });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching login summary', error: error.message });
  }
};

// Recent adds per user with optional date filter
exports.getUserRecentAdds = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate, limit = 50 } = req.query;

    const match = {
      userId,
      actionType: { $in: ['document-upload', 'verification'] },
    };
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }

    const logs = await ActivityLog.find(match)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .lean();

    res.json({
      userId,
      count: logs.length,
      items: logs.map((r) => ({
        action: r.action,
        actionType: r.actionType,
        resource: r.resource,
        resourceId: r.resourceId || null,
        details: r.details || '',
        createdAt: r.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent adds', error: error.message });
  }
};
