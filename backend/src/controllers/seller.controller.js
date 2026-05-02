const SellerProfile = require('../models/SellerProfile');
const SellerAnalytics = require('../models/SellerAnalytics');
const Inquiry = require('../models/Inquiry');
const Lead = require('../models/Lead');
const User = require('../models/User');

// ===== SELLER PROFILE ENDPOINTS =====

// Get Seller Profile
exports.getSellerProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await SellerProfile.findOne({ userId });
    
    if (!profile) {
      return res.status(404).json({ message: 'Seller profile not found' });
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching seller profile', error: error.message });
  }
};

// Create or Update Seller Profile
exports.upsertSellerProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { companyName, businessType, phoneNumber, businessAddress, specialization, bio, preferences, bankDetails } = req.body;
    
    let profile = await SellerProfile.findOne({ userId });
    
    if (!profile) {
      profile = new SellerProfile({
        userId,
        companyName,
        businessType,
        phoneNumber,
        businessAddress,
        specialization,
        bio,
        preferences,
        bankDetails,
      });
    } else {
      Object.assign(profile, req.body);
    }
    
    await profile.save();
    res.json({ message: 'Seller profile updated successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Error updating seller profile', error: error.message });
  }
};

// Update Bank Details
exports.updateBankDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const { bankDetails } = req.body;
    
    const profile = await SellerProfile.findOneAndUpdate(
      { userId },
      { bankDetails },
      { new: true }
    );
    
    res.json({ message: 'Bank details updated', profile });
  } catch (error) {
    res.status(500).json({ message: 'Error updating bank details', error: error.message });
  }
};

// Update Communication Preferences
exports.updatePreferences = async (req, res) => {
  try {
    const { userId } = req.params;
    const { preferences } = req.body;
    
    const profile = await SellerProfile.findOneAndUpdate(
      { userId },
      { preferences },
      { new: true }
    );
    
    res.json({ message: 'Preferences updated', profile });
  } catch (error) {
    res.status(500).json({ message: 'Error updating preferences', error: error.message });
  }
};

// Update Verification Documents
exports.updateVerificationDocuments = async (req, res) => {
  try {
    const { userId } = req.params;
    const { verificationDocuments } = req.body;
    
    const profile = await SellerProfile.findOneAndUpdate(
      { userId },
      { verificationDocuments },
      { new: true }
    );
    
    res.json({ message: 'Verification documents updated', profile });
  } catch (error) {
    res.status(500).json({ message: 'Error updating documents', error: error.message });
  }
};

// ===== SELLER ANALYTICS ENDPOINTS =====

// Get Analytics Dashboard
exports.getAnalyticsDashboard = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { period = 'current' } = req.query; // 'current', 'last-month', 'last-three-months', 'year'
    
    let query = { sellerId };
    const now = new Date();
    
    if (period === 'last-month') {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      query.date = { $gte: lastMonth, $lt: now };
    } else if (period === 'last-three-months') {
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      query.date = { $gte: threeMonthsAgo, $lt: now };
    } else if (period === 'year') {
      const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);
      query.date = { $gte: yearAgo, $lt: now };
    }
    
    const analytics = await SellerAnalytics.find(query).sort({ date: -1 }).limit(30);
    
    // Get seller profile for KPI summary
    const profile = await SellerProfile.findById(sellerId);
    
    res.json({
      analytics,
      summary: {
        totalListings: profile?.totalListings || 0,
        activeListings: profile?.activeListings || 0,
        soldListings: profile?.soldListings || 0,
        totalRevenue: profile?.totalRevenue || 0,
        rating: profile?.rating || 0,
        responseRate: profile?.responseRate || 0,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
};

// Get Revenue Analytics
exports.getRevenueAnalytics = async (req, res) => {
  try {
    const { sellerId } = req.params;
    
    const analytics = await SellerAnalytics.find({ sellerId }).sort({ date: -1 }).limit(12);
    
    const revenueData = analytics.map(a => ({
      date: a.date,
      revenue: a.revenueMetrics?.monthlyRevenue || 0,
      earnings: a.revenueMetrics?.netEarnings || 0,
      commission: a.revenueMetrics?.commissionPaid || 0,
    }));
    
    res.json(revenueData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching revenue analytics', error: error.message });
  }
};

// Get Listing Performance
exports.getListingPerformance = async (req, res) => {
  try {
    const { sellerId } = req.params;
    
    const analytics = await SellerAnalytics.findOne({ sellerId }).sort({ date: -1 });
    
    res.json({
      listingMetrics: analytics?.listingMetrics || {},
      performanceMetrics: analytics?.performanceMetrics || {},
      inquiryMetrics: analytics?.inquiryMetrics || {},
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching listing performance', error: error.message });
  }
};

// ===== INQUIRY ENDPOINTS =====

// Get All Inquiries for Seller
exports.getSellerInquiries = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { status, sort = '-createdAt', page = 1, limit = 10 } = req.query;
    
    const query = { sellerId, isArchived: false };
    if (status) query.status = status;
    
    const skip = (page - 1) * limit;
    const inquiries = await Inquiry.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('buyerId', 'name email')
      .populate('listingId', 'title');
    
    const total = await Inquiry.countDocuments(query);
    
    res.json({
      inquiries,
      pagination: { page: parseInt(page), limit: parseInt(limit), total },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inquiries', error: error.message });
  }
};

// Get Single Inquiry
exports.getInquiry = async (req, res) => {
  try {
    const { inquiryId } = req.params;
    
    const inquiry = await Inquiry.findById(inquiryId)
      .populate('buyerId', 'name email phone')
      .populate('listingId', 'title price location');
    
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inquiry', error: error.message });
  }
};

// Update Inquiry Status
exports.updateInquiryStatus = async (req, res) => {
  try {
    const { inquiryId } = req.params;
    const { status, notes } = req.body;
    
    const inquiry = await Inquiry.findByIdAndUpdate(
      inquiryId,
      {
        status,
        statusChangedAt: new Date(),
        followUpNotes: notes || inquiry.followUpNotes,
      },
      { new: true }
    );
    
    res.json({ message: 'Inquiry status updated', inquiry });
  } catch (error) {
    res.status(500).json({ message: 'Error updating inquiry', error: error.message });
  }
};

// Reply to Inquiry
exports.replyToInquiry = async (req, res) => {
  try {
    const { inquiryId } = req.params;
    const { reply, senderId, senderType } = req.body;
    
    const inquiry = await Inquiry.findByIdAndUpdate(
      inquiryId,
      {
        $push: {
          conversationThread: {
            sender: senderId,
            senderType,
            message: reply,
            timestamp: new Date(),
          },
        },
        lastMessageAt: new Date(),
      },
      { new: true }
    );
    
    res.json({ message: 'Reply sent', inquiry });
  } catch (error) {
    res.status(500).json({ message: 'Error sending reply', error: error.message });
  }
};

// Schedule Meeting
exports.scheduleMeeting = async (req, res) => {
  try {
    const { inquiryId } = req.params;
    const { date, time, location, type } = req.body;
    
    const inquiry = await Inquiry.findByIdAndUpdate(
      inquiryId,
      {
        scheduledMeeting: { date, time, location, type },
      },
      { new: true }
    );
    
    res.json({ message: 'Meeting scheduled', inquiry });
  } catch (error) {
    res.status(500).json({ message: 'Error scheduling meeting', error: error.message });
  }
};

// Archive Inquiry
exports.archiveInquiry = async (req, res) => {
  try {
    const { inquiryId } = req.params;
    
    const inquiry = await Inquiry.findByIdAndUpdate(
      inquiryId,
      {
        isArchived: true,
        archivedAt: new Date(),
        status: 'archived',
      },
      { new: true }
    );
    
    res.json({ message: 'Inquiry archived', inquiry });
  } catch (error) {
    res.status(500).json({ message: 'Error archiving inquiry', error: error.message });
  }
};

// ===== LEAD ENDPOINTS =====

// Get All Leads for Seller
exports.getSellerLeads = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { status, sort = '-createdAt', page = 1, limit = 10 } = req.query;
    
    const query = { sellerId, isArchived: false };
    if (status) query.status = status;
    
    const skip = (page - 1) * limit;
    const leads = await Lead.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('buyerId', 'name email');
    
    const total = await Lead.countDocuments(query);
    
    res.json({
      leads,
      pagination: { page: parseInt(page), limit: parseInt(limit), total },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leads', error: error.message });
  }
};

// Get Single Lead
exports.getLead = async (req, res) => {
  try {
    const { leadId } = req.params;
    
    const lead = await Lead.findById(leadId)
      .populate('buyerId', 'name email phone')
      .populate('linkedProperties', 'title price');
    
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lead', error: error.message });
  }
};

// Update Lead Status
exports.updateLeadStatus = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { status, notes } = req.body;
    
    const lead = await Lead.findByIdAndUpdate(
      leadId,
      {
        status,
        $push: {
          statusHistory: {
            status,
            notes,
          },
        },
      },
      { new: true }
    );
    
    res.json({ message: 'Lead status updated', lead });
  } catch (error) {
    res.status(500).json({ message: 'Error updating lead', error: error.message });
  }
};

// Get Inquiry Statistics
exports.getInquiryStats = async (req, res) => {
  try {
    const { sellerId } = req.params;
    
    const stats = await Inquiry.aggregate([
      { $match: { sellerId: require('mongoose').Types.ObjectId(sellerId), isArchived: false } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);
    
    const totalInquiries = await Inquiry.countDocuments({ sellerId, isArchived: false });
    
    res.json({
      totalInquiries,
      byStatus: stats,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inquiry stats', error: error.message });
  }
};

// Get Lead Statistics
exports.getLeadStats = async (req, res) => {
  try {
    const { sellerId } = req.params;
    
    const stats = await Lead.aggregate([
      { $match: { sellerId: require('mongoose').Types.ObjectId(sellerId), isArchived: false } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);
    
    const totalLeads = await Lead.countDocuments({ sellerId, isArchived: false });
    
    res.json({
      totalLeads,
      byStatus: stats,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lead stats', error: error.message });
  }
};
