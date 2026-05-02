const mongoose = require('mongoose');

const sellerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  businessType: {
    type: String,
    enum: ['Broker', 'Developer', 'Landowner', 'Agent', 'Company', 'Individual'],
    default: 'Individual',
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  alternatePhone: String,
  businessAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  specialization: [String], // ['Agricultural', 'Residential', 'Commercial', 'Industrial']
  yearsInBusiness: Number,
  profileImage: String,
  bio: String,
  websiteUrl: String,
  
  // Bank Details for Payouts
  bankDetails: {
    accountHolder: String,
    accountNumber: String,
    routingNumber: String,
    bankName: String,
    accountType: String, // 'savings' or 'checking'
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationDate: Date,
  },
  
  // Tax Information
  taxId: String, // GST/VAT/EIN
  taxIdVerified: {
    type: Boolean,
    default: false,
  },
  businessLicense: String,
  businessLicenseVerified: {
    type: Boolean,
    default: false,
  },
  
  // Ratings & Reviews
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  responseRate: {
    type: Number,
    default: 0, // percentage
  },
  averageResponseTime: Number, // in hours
  
  // Seller Badges & Status
  badges: [String], // ['verified', 'top-seller', 'responsive', 'trusted']
  isVerified: {
    type: Boolean,
    default: false,
  },
  accountStatus: {
    type: String,
    enum: ['active', 'suspended', 'restricted', 'inactive'],
    default: 'active',
  },
  
  // Communication Preferences
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    smsNotifications: {
      type: Boolean,
      default: true,
    },
    weeklyReports: {
      type: Boolean,
      default: true,
    },
    marketingEmails: {
      type: Boolean,
      default: true,
    },
  },
  
  // Verification Documents
  verificationDocuments: {
    identityProof: {
      url: String,
      verified: Boolean,
      verificationDate: Date,
    },
    addressProof: {
      url: String,
      verified: Boolean,
      verificationDate: Date,
    },
    businessLicenseDoc: {
      url: String,
      verified: Boolean,
      verificationDate: Date,
    },
    taxIdDoc: {
      url: String,
      verified: Boolean,
      verificationDate: Date,
    },
  },
  
  // KPIs
  totalListings: {
    type: Number,
    default: 0,
  },
  activeListings: {
    type: Number,
    default: 0,
  },
  soldListings: {
    type: Number,
    default: 0,
  },
  totalRevenue: {
    type: Number,
    default: 0,
  },
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  lastLoginAt: Date,
  verificationCompletedAt: Date,
});

// Index for fast lookups
sellerProfileSchema.index({ userId: 1 });
sellerProfileSchema.index({ companyName: 1 });
sellerProfileSchema.index({ isVerified: 1 });

module.exports = mongoose.model('SellerProfile', sellerProfileSchema);
