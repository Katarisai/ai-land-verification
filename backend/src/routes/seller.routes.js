const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/seller.controller');

// Auth middleware (optional - add if you have auth middleware)
// const { authenticate } = require('../middlewares/auth');
// router.use(authenticate);

// ===== SELLER PROFILE ROUTES =====
router.get('/profile/:userId', sellerController.getSellerProfile);
router.post('/profile/:userId', sellerController.upsertSellerProfile);
router.put('/profile/:userId/bank-details', sellerController.updateBankDetails);
router.put('/profile/:userId/preferences', sellerController.updatePreferences);
router.put('/profile/:userId/verification-documents', sellerController.updateVerificationDocuments);

// ===== ANALYTICS ROUTES =====
router.get('/analytics/:sellerId/dashboard', sellerController.getAnalyticsDashboard);
router.get('/analytics/:sellerId/revenue', sellerController.getRevenueAnalytics);
router.get('/analytics/:sellerId/listing-performance', sellerController.getListingPerformance);

// ===== INQUIRY ROUTES =====
router.get('/inquiries/:sellerId', sellerController.getSellerInquiries);
router.get('/inquiry/:inquiryId', sellerController.getInquiry);
router.put('/inquiry/:inquiryId/status', sellerController.updateInquiryStatus);
router.post('/inquiry/:inquiryId/reply', sellerController.replyToInquiry);
router.post('/inquiry/:inquiryId/schedule-meeting', sellerController.scheduleMeeting);
router.post('/inquiry/:inquiryId/archive', sellerController.archiveInquiry);
router.get('/inquiries/:sellerId/stats', sellerController.getInquiryStats);

// ===== LEAD ROUTES =====
router.get('/leads/:sellerId', sellerController.getSellerLeads);
router.get('/lead/:leadId', sellerController.getLead);
router.put('/lead/:leadId/status', sellerController.updateLeadStatus);
router.get('/leads/:sellerId/stats', sellerController.getLeadStats);

module.exports = router;
