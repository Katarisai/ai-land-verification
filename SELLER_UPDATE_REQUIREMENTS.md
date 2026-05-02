# Seller Update - Required Features & New Additions

## Overview
This document outlines all required features for the **Seller Dashboard & Updates** including existing functionality and new proposed features for enhanced seller experience and platform monetization.

---

## PART 1: EXISTING SELLER FEATURES (Currently Implemented)

### 1. **Land Listing Management**
**Status:** ✅ **Implemented**

**Features:**
- ✅ Create new land listings with form dialog
- ✅ Edit existing listings (title, location, price, description)
- ✅ View all own listings
- ✅ Delete listings
- ✅ Add multiple images to listings
- ✅ Set land type (Agricultural, Residential, Commercial, Industrial, Recreational, Mixed Use)
- ✅ Specify land area in acres
- ✅ Add location information
- ✅ Add custom features/amenities (water access, road frontage, etc.)

**Files:**
- `src/app/components/LandListings.tsx` - Listing page with add/edit forms
- `src/app/components/LandDetail.tsx` - Detail edit view
- `backend/src/models/Land.js` - Database schema

**Current Form Fields:**
- Title
- Location
- Price
- Area (acres)
- Type (dropdown)
- Features (comma-separated)
- Images/Image URLs

---

### 2. **Document Upload & Management**
**Status:** ✅ **Implemented**

**Features:**
- ✅ Upload multiple documents (PDF, DOC, DOCX, JPG, PNG)
- ✅ View uploaded files
- ✅ Remove uploaded files
- ✅ File validation
- ✅ Document preview capability (planned)

**Files:**
- Dialog component in `src/app/components/LandDetail.tsx`
- Upload handler: `handleFileUpload()`, `handleUploadDocuments()`
- Accepted formats: .pdf, .doc, .docx, .jpg, .png

---

### 3. **Seller Dashboard Overview**
**Status:** ✅ **Basic View**

**Features:**
- ✅ View all own listings
- ✅ See listing status (verified/in-review)
- ✅ View AI trust score for each listing
- ✅ Search and filter listings
- ✅ Add to cart feature (for bulk operations)

**Files:**
- `src/app/components/LandListings.tsx` - Main dashboard

---

## PART 2: NEW REQUIRED FEATURES FOR SELLER UPDATE

### NEW FEATURE 1: Seller Profile & Account Management
**Priority:** HIGH  
**Status:** ❌ **Not Implemented**

**Required Components:**
1. **Seller Profile Page**
   - Profile picture/avatar
   - Business name/company name
   - Phone number
   - Address
   - Bank account details (for payouts)
   - GST/Tax ID
   - Business license/registration
   - Years in business
   - Specialization (e.g., Agricultural, Residential, Commercial)
   - Bio/Description
   - Seller badges (Verified, Top Seller, etc.)
   - Star rating/review score

2. **Account Settings**
   - Change password
   - Email notifications preferences
   - SMS alerts toggle
   - Banking information updates
   - Payment method preferences
   - Communication preferences

3. **Data Files Needed:**
   - Create `backend/src/models/SellerProfile.js`
   - Add fields to `backend/src/models/User.js`

**Example Schema:**
```javascript
const sellerProfileSchema = {
  userId: ObjectId,
  companyName: String,
  phoneNumber: String,
  businessAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  businessType: String, // Broker, Developer, Landowner, Agent, etc.
  specialization: [String], // Agricultural, Residential, Commercial, etc.
  taxId: String,
  businessLicense: String,
  yearsInBusiness: Number,
  profileImage: String,
  bio: String,
  bankDetails: {
    accountHolder: String,
    accountNumber: String,
    routingNumber: String,
    bankName: String
  },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  badges: [String], // verified, top-seller, responsive, etc.
  createdAt: Date,
  updatedAt: Date
}
```

---

### NEW FEATURE 2: Analytics & Performance Dashboard
**Priority:** HIGH  
**Status:** ❌ **Not Implemented**

**Required Metrics:**
1. **Sales Analytics**
   - Total listings created
   - Active listings count
   - Sold listings count
   - Total revenue generated
   - Average days to sell
   - Conversion rate (views to inquiries)

2. **Listing Performance**
   - Views per listing
   - Inquiry count per listing
   - Lead response time
   - Inquiry-to-sale conversion
   - Most viewed listings
   - Best performing listings

3. **Financial Dashboard**
   - Total earnings (pending, completed, withdrawn)
   - Monthly revenue chart
   - Transaction history
   - Payout schedule
   - Commission breakdown
   - Fees paid
   - Account balance

4. **Charts & Graphs**
   - Revenue over time (line chart)
   - Listing performance (bar chart)
   - Category breakdown (pie chart)
   - Lead source distribution (donut chart)

5. **Data Files:**
   - Create `backend/src/models/SellerAnalytics.js`
   - Create `backend/src/models/Payout.js`
   - Create API endpoints in `backend/src/controllers/seller.analytics.controller.js`

---

### NEW FEATURE 3: Advanced Listing Features
**Priority:** HIGH  
**Status:** ⚠️ **Partially Implemented**

**Required Components:**

1. **Enhanced Listing Form**
   - [ ] Multiple images upload with drag-drop
   - [ ] Image gallery/carousel preview
   - [ ] Image optimization/compression
   - [ ] Write detailed description with rich text editor
   - [ ] Add amenities checklist
   - [ ] Add property highlights
   - [ ] Set availability status (available, under offer, sold)
   - [ ] Add virtual tour link
   - [ ] Add 3D model link
   - [ ] Set property highlights/key selling points
   - [ ] Add neighboring properties info
   - [ ] Specify property age/year built
   - [ ] Add zoning information
   - [ ] Add utility access info
   - [ ] Add legal description

2. **Listing Templates**
   - Quick listing template
   - Detailed listing template
   - Bulk upload template (CSV)

3. **Documentation:**
   - Supported documents checklist
   - Upload status per document type
   - Document verification status
   - AI analysis results per document

4. **Visibility Control**
   - Set listing to private/public
   - Set visibility duration
   - Scheduled posting
   - Automatic renewal options
   - Priority listing/featured listing option

5. **Pricing Options**
   - Fixed price
   - Price range
   - Negotiable price
   - Auction-style pricing

---

### NEW FEATURE 4: Lead & Inquiry Management
**Priority:** HIGH  
**Status:** ❌ **Not Implemented**

**Required Components:**

1. **Inquiry Management Dashboard**
   - List all inquiries for seller's properties
   - Filter by status (new, contacted, qualified, won, lost)
   - Filter by date range
   - Search inquiries
   - Sort by date, status, property
   - Inquiries count
   - Response time tracking

2. **Inquiry Details View**
   - Buyer name and contact
   - Property interested in
   - Buyer type (first-time buyer, investor, developer)
   - Message/inquiry text
   - Timestamp
   - Buyer's budget range
   - Buyer's timeline
   - Previous inquiries from same buyer

3. **Inquiry Response System**
   - Reply to inquiry
   - Pre-defined message templates
   - Schedule follow-up
   - Add notes to inquiry
   - Mark as contacted/qualified/won/lost
   - Convert inquiry to meeting/deal

4. **Communication Tools**
   - In-app messaging
   - Email integration
   - SMS notification option
   - Call log tracking
   - Meeting scheduler

5. **Data Files:**
   - Create `backend/src/models/Inquiry.js`
   - Create `backend/src/models/Lead.js`
   - Create inquiry controller
   - Create messaging module

**Example Schema:**
```javascript
const inquirySchema = {
  listingId: ObjectId,
  sellerId: ObjectId,
  buyerId: ObjectId,
  message: String,
  buyerType: String, // first-time, investor, developer, etc.
  budget: {
    min: Number,
    max: Number
  },
  timeline: String, // immediate, 1-3 months, etc.
  status: String, // new, contacted, qualified, won, lost
  responses: [{
    message: String,
    sender: ObjectId,
    timestamp: Date
  }],
  followUpDate: Date,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

### NEW FEATURE 5: Seller Ratings & Reviews
**Priority:** MEDIUM  
**Status:** ❌ **Not Implemented**

**Required Components:**

1. **Review System**
   - Buyers can rate sellers (1-5 stars)
   - Written feedback/comments
   - Review categories:
     - Communication
     - Listing accuracy
     - Professionalism
     - Responsiveness
     - Fair pricing
   - Verified purchase badge for reviews

2. **Seller Rating Profile**
   - Overall rating (average)
   - Breakdown by category
   - Total reviews count
   - Response rate to inquiries
   - Response time metrics
   - Positive/negative review ratio

3. **Review Management**
   - View all seller's reviews
   - Reply to reviews
   - Flag inappropriate reviews
   - Response rate tracking

4. **Data Files:**
   - Create `backend/src/models/ReviewRating.js`

---

### NEW FEATURE 6: Verification & Compliance Status
**Priority:** MEDIUM  
**Status:** ⚠️ **Partial - Admin has it**

**Required Components:**

1. **Seller Verification Dashboard**
   - Overall verification status
   - Document checklist:
     - [ ] Identity proof (uploaded/verified)
     - [ ] Business license (uploaded/verified)
     - [ ] Tax ID/GST (uploaded/verified)
     - [ ] Bank details (uploaded/verified)
     - [ ] Address proof (uploaded/verified)
   - Verification progress bar
   - Document status for each item (pending, verified, rejected)
   - Reason for rejection if applicable
   - Resubmission option
   - Support contact for verification issues

2. **Compliance Status**
   - Account status (active/suspended/restricted)
   - Policy compliance
   - Payment status
   - Commission schedule status
   - Any violations or warnings

3. **Trust Score Display**
   - Seller trust score (visible to sellers)
   - How to improve score
   - Pending actions to improve

---

### NEW FEATURE 7: Promotional & Monetization Features
**Priority:** MEDIUM  
**Status:** ❌ **Not Implemented**

**Required Components:**

1. **Featured Listings**
   - Ability to promote listings
   - Featured duration options (30 days, 60 days, etc.)
   - Cost per featured listing
   - Featured badge on listing
   - Higher search ranking

2. **Premium Services**
   - Premium verification service (fast-track)
   - Professional photography service
   - Virtual tour creation
   - AI-generated description service
   - Professional listing optimization

3. **Pricing Page**
   - Show available premium features
   - Pricing for each service
   - Payment & upgrade options
   - Discount codes/coupons

4. **Subscription Plans**
   - Free plan (limited features)
   - Basic plan (monthly subscription)
   - Professional plan (monthly subscription)
   - Enterprise plan (custom pricing)
   - Plan comparison table

---

### NEW FEATURE 8: Bulk Operations
**Priority:** MEDIUM  
**Status:** ⚠️ **Partial - Cart exists**

**Required Components:**

1. **Bulk Listing Management**
   - Select multiple listings
   - Bulk edit (status, features, pricing)
   - Bulk delete listings
   - Bulk upload images
   - Bulk change visibility/settings

2. **Bulk Upload**
   - CSV template download
   - CSV file import for bulk listing creation
   - Validation and error reporting
   - Preview before upload
   - Success/failure report

3. **Batch Operations**
   - Export listings (CSV, PDF)
   - Compare listings
   - Clone listing (duplicate with changes)
   - Archive listings

---

### NEW FEATURE 9: Marketing & Promotion Tools
**Priority:** LOW-MEDIUM  
**Status:** ❌ **Not Implemented**

**Required Components:**

1. **Listings Sharing**
   - Share on social media (Facebook, WhatsApp, Instagram, LinkedIn)
   - Generate QR code for listing
   - Social media pre-configured shares
   - Email listing to contacts
   - Custom sharing links

2. **Marketing Materials**
   - Generate property brochure (PDF)
   - Business card option with QR code
   - Email templates
   - Social media post templates
   - Gallery/flip book generator

3. **Analytics Sharing**
   - Share performance report with buyer/agent
   - Printable analytics report
   - Email weekly/monthly summaries

---

### NEW FEATURE 10: Mobile App Features
**Priority:** LOW  
**Status:** ❌ **Not Implemented**

**Required Components:**

1. **Mobile Optimization**
   - Mobile-responsive seller dashboard
   - Simplified mobile forms
   - Quick add listing on mobile
   - Mobile photo upload from camera
   - Push notifications for inquiries

2. **Offline Capability**
   - Offline listing view
   - Queue listing creation (upload when online)
   - Offline document management

---

## PART 3: BACKEND API ENDPOINTS NEEDED

### Seller Profile Endpoints
```
POST   /api/seller/profile                    - Create/update profile
GET    /api/seller/profile                    - Get seller profile
PUT    /api/seller/profile                    - Update profile
GET    /api/seller/profile/verification       - Get verification status
POST   /api/seller/profile/bank-details       - Update bank details
```

### Listing Endpoints
```
POST   /api/seller/listings                   - Create listing
GET    /api/seller/listings                   - Get all seller's listings
GET    /api/seller/listings/:id               - Get specific listing
PUT    /api/seller/listings/:id               - Update listing
DELETE /api/seller/listings/:id               - Delete listing (soft delete)
POST   /api/seller/listings/bulk-upload       - Bulk upload via CSV
GET    /api/seller/listings/export            - Export listings
```

### Inquiry Endpoints
```
GET    /api/seller/inquiries                  - Get all inquiries
GET    /api/seller/inquiries/:id              - Get specific inquiry
PUT    /api/seller/inquiries/:id/status       - Update inquiry status
POST   /api/seller/inquiries/:id/response     - Reply to inquiry
DELETE /api/seller/inquiries/:id              - Archive inquiry
GET    /api/seller/inquiries/stats            - Get inquiry statistics
```

### Analytics Endpoints
```
GET    /api/seller/analytics/dashboard        - Get dashboard KPIs
GET    /api/seller/analytics/revenue          - Get revenue analytics
GET    /api/seller/analytics/listings         - Get listing performance
GET    /api/seller/analytics/leads            - Get lead statistics
GET    /api/seller/analytics/export           - Export analytics report
```

### Payment Endpoints
```
GET    /api/seller/payouts                    - Get payout history
GET    /api/seller/earnings                   - Get earnings summary
POST   /api/seller/request-payout             - Request withdrawal
GET    /api/seller/invoice/:id                - Get invoice
POST   /api/seller/upgrade-plan               - Upgrade subscription
```

### Document Endpoints
```
POST   /api/seller/documents/upload           - Upload document
DELETE /api/seller/documents/:id              - Delete document
GET    /api/seller/documents                  - List documents
GET    /api/seller/documents/verification     - Get verification status
```

---

## PART 4: DATABASE MODELS NEEDED

### Models to Create:
1. **SellerProfile.js** - Comprehensive seller information
2. **SellerAnalytics.js** - Performance metrics and KPIs
3. **Inquiry.js** - Lead/buyer inquiries
4. **Lead.js** - Lead tracking and conversion
5. **ReviewRating.js** - Seller reviews and ratings
6. **Payout.js** - Payment and withdrawal records
7. **SellerSubscription.js** - Plan and subscription information
8. **ListingActivity.js** - Track listing views, inquiries, etc.
9. **MarketingMaterial.js** - Promotional content
10. **VerificationDocument.js** - Seller verification docs

---

## PART 5: PRIORITY ROADMAP

### Phase 1 (CRITICAL - Week 1-2)
- [ ] Seller Profile Management
- [ ] Enhanced Listing Forms
- [ ] Document Upload improvements
- [ ] Basic Analytics Dashboard

### Phase 2 (HIGH - Week 3-4)
- [ ] Lead/Inquiry Management
- [ ] Advanced Analytics
- [ ] Payout System
- [ ] Seller Verification

### Phase 3 (MEDIUM - Week 5-6)
- [ ] Seller Ratings & Reviews
- [ ] Promotional Tools
- [ ] Bulk Operations
- [ ] Mobile Optimization

### Phase 4 (ENHANCEMENT - Later)
- [ ] Marketing Materials Generator
- [ ] Social Media Integration
- [ ] Premium Services
- [ ] Mobile App

---

## PART 6: TESTING CHECKLIST

### Frontend Testing
- [ ] Profile page loads and saves correctly
- [ ] Listings can be created with all fields
- [ ] Document upload works with validation
- [ ] Analytics charts render properly
- [ ] Responsive design on mobile
- [ ] All forms validate correctly
- [ ] Navigation between pages works

### Backend Testing
- [ ] All API endpoints return correct status codes
- [ ] Authentication/authorization checks work
- [ ] Data validation on endpoints
- [ ] File uploads process correctly
- [ ] Analytics calculations are accurate
- [ ] Error handling and error messages
- [ ] Performance under load

### Integration Testing
- [ ] Sellers can list and sell properties
- [ ] Buyers can inquire about listings
- [ ] Seller notifications work
- [ ] Payment processing works
- [ ] Admin can manage sellers
- [ ] AI verification integrates

---

## SUMMARY TABLE

| Feature | Priority | Status | Est. Hours | Dependencies |
|---------|----------|--------|------------|--------------|
| Seller Profile | HIGH | ❌ | 16 | User Model |
| Analytics Dashboard | HIGH | ❌ | 24 | Database Models |
| Advanced Listings | HIGH | ⚠️ | 12 | Components |
| Lead Management | HIGH | ❌ | 20 | Backend Models |
| Ratings & Reviews | MEDIUM | ❌ | 12 | Review Model |
| Verification Status | MEDIUM | ⚠️ | 8 | Admin System |
| Promotions | MEDIUM | ❌ | 14 | Payment System |
| Bulk Operations | MEDIUM | ⚠️ | 10 | Listings |
| Marketing Tools | LOW | ❌ | 12 | Frontend |
| Mobile Features | LOW | ❌ | 16 | Responsive Design |

---

## NEXT STEPS

1. **Prioritize Features** - Review with team which features are most critical
2. **Design Database** - Finalize all MongoDB schemas
3. **Create Backend APIs** - Implement all endpoints
4. **Build Frontend Components** - Create UI for all features
5. **Integration Testing** - Test end-to-end workflows
6. **Performance Optimization** - Optimize queries and APIs
7. **Deployment** - Deploy to production with monitoring

---

## QUESTIONS TO CLARIFY

1. What is the monetization strategy (free tier vs. premium)?
2. Should sellers get real-time notifications?
3. What payment gateways to integrate (Stripe, PayPal, local)?
4. Should there be a seller approval process before listing?
5. What are the commission rates?
6. Should sellers have different tiers/levels?
7. Integration with email/SMS service required?
8. Should there be seller support chat?

