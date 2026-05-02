const mongoose = require('mongoose');

const sellerAnalyticsSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SellerProfile',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  month: String, // 'YYYY-MM'
  year: Number,
  
  // Listing Metrics
  listingMetrics: {
    totalListings: Number,
    activeListings: Number,
    drafts: Number,
    archivedListings: Number,
    soldListings: Number,
    listingViews: Number,
    listingViewsLastMonth: Number,
    averageViewsPerListing: Number,
    newListingsThisMonth: Number,
  },
  
  // Inquiry Metrics
  inquiryMetrics: {
    totalInquiries: Number,
    newInquiries: Number,
    respondedInquiries: Number,
    qualifiedLeads: Number,
    convertedLeads: Number,
    responseRate: Number, // percentage
    averageResponseTime: Number, // in hours
    inquirySourceBreakdown: {
      website: Number,
      app: Number,
      agent: Number,
      other: Number,
    },
  },
  
  // Revenue Metrics
  revenueMetrics: {
    totalRevenue: Number,
    monthlyRevenue: Number,
    averageTransactionValue: Number,
    commissionPaid: Number,
    feePaid: Number,
    netEarnings: Number,
    previousMonthRevenue: Number,
    revenueGrowth: Number, // percentage
    topPerformingListing: String, // listing name
    topPerformingListingRevenue: Number,
  },
  
  // Performance Metrics
  performanceMetrics: {
    listingConversionRate: Number, // views to inquiries
    inquiryToSaleConversion: Number,
    averageDaysToSell: Number,
    totalPendingTransactions: Number,
    totalCompletedTransactions: Number,
    cancellationRate: Number, // percentage
    refundRate: Number, // percentage
  },
  
  // Traffic & Engagement
  trafficMetrics: {
    webVisits: Number,
    appVisits: Number,
    uniqueVisitors: Number,
    returningVisitors: Number,
    bounceRate: Number, // percentage
    averageSessionDuration: Number, // in seconds
    clickThroughRate: Number, // percentage
    topReferralSource: String,
  },
  
  // Rating & Review Metrics
  reviewMetrics: {
    averageRating: Number, // 1-5
    totalReviews: Number,
    newReviewsThisMonth: Number,
    positiveReviews: Number,
    negativeReviews: Number,
    sentimentScore: Number, // -100 to 100
  },
  
  // Payout Metrics
  payoutMetrics: {
    amountDue: Number,
    amountPaid: Number,
    nextPayoutDate: Date,
    totalPayoutsYearToDate: Number,
    accountBalance: Number,
  },
  
  // Daily Breakdown
  dailyMetrics: {
    date: Date,
    views: Number,
    inquiries: Number,
    revenue: Number,
    newListings: Number,
    activeListings: Number,
  },
  
  // Createddate and Updated
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for fast lookups
sellerAnalyticsSchema.index({ sellerId: 1, date: -1 });
sellerAnalyticsSchema.index({ sellerId: 1, month: 1 });
sellerAnalyticsSchema.index({ sellerId: 1, year: 1 });

module.exports = mongoose.model('SellerAnalytics', sellerAnalyticsSchema);
