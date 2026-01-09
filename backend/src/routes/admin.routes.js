const express = require('express');
const router = express.Router();
const adminUserController = require('../controllers/admin.user.controller');
const adminVerificationController = require('../controllers/admin.verification.controller');
const adminComplianceController = require('../controllers/admin.compliance.controller');
const adminSettingsController = require('../controllers/admin.settings.controller');

// Middleware to check admin role (should be added to auth middleware)
const checkAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'super-admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};

// ============== DASHBOARD ==============
router.get('/dashboard/stats', checkAdmin, adminUserController.getDashboardStats);

// ============== USER MANAGEMENT ==============
router.get('/users', checkAdmin, adminUserController.getAllUsers);
router.put('/users/:userId/role', checkAdmin, adminUserController.updateUserRole);
router.get('/users/activity-logs', checkAdmin, adminUserController.getUserActivityLogs);
router.post('/users/:userId/deactivate', checkAdmin, adminUserController.deactivateUser);
router.get('/users/overview', checkAdmin, adminUserController.getUsersOverview);
router.get('/users/login-summary', checkAdmin, adminUserController.getLoginSummary);
router.get('/users/:userId/recent-adds', checkAdmin, adminUserController.getUserRecentAdds);

// ============== VERIFICATION MANAGEMENT ==============
router.get('/verifications', checkAdmin, adminVerificationController.getAllVerifications);
router.get('/verifications/:verificationId', checkAdmin, adminVerificationController.getVerificationDetails);
router.post('/verifications/:verificationId/approve', checkAdmin, adminVerificationController.approveVerification);
router.post('/verifications/:verificationId/reject', checkAdmin, adminVerificationController.rejectVerification);
router.post('/verifications/:verificationId/assign-verifier', checkAdmin, adminVerificationController.assignVerifier);
router.post('/verifications/:verificationId/override-score', checkAdmin, adminVerificationController.overrideTrustScore);
router.get('/verifications/stats/overview', checkAdmin, adminVerificationController.getVerificationStats);

// ============== COMPLIANCE & AUDIT ==============
router.get('/audit-logs', checkAdmin, adminComplianceController.getAuditLogs);
router.get('/compliance/report', checkAdmin, adminComplianceController.getComplianceReport);
router.get('/compliance/data-access', checkAdmin, adminComplianceController.getDataAccessLogs);
router.get('/disputes', checkAdmin, adminComplianceController.getDisputes);
router.put('/disputes/:disputeId', checkAdmin, adminComplianceController.updateDispute);
router.post('/disputes/:disputeId/comment', checkAdmin, adminComplianceController.addDisputeComment);

// ============== SETTINGS & CONFIGURATION ==============
router.get('/settings/config', checkAdmin, adminSettingsController.getSystemConfig);
router.put('/settings/config', checkAdmin, adminSettingsController.updateSystemConfig);
router.get('/reports/financial', checkAdmin, adminSettingsController.getFinancialReport);
router.get('/reports/trust-score-analytics', checkAdmin, adminSettingsController.getTrustScoreAnalytics);
router.get('/reports/billing', checkAdmin, adminSettingsController.getBillingReport);

module.exports = router;
