# Admin Dashboard Implementation Guide

## Overview
This document provides detailed information about the Admin Dashboard implementation for the AI Land Verification Platform.

## Architecture

### Database Models
The admin system uses the following MongoDB models:

#### 1. **Verification Model** (`models/Verification.js`)
Stores land verification records with trust score calculations.

**Key Fields:**
- `landId`: Reference to land property
- `userId`: Submitting user
- `assignedVerifier`: Legal professional assigned to verify
- `status`: pending, in-progress, completed, rejected
- `trustScore`: 0-100 overall score
- Individual scoring factors:
  - `documentClarity`: Document completeness (0-100)
  - `ownershipContinuity`: Ownership transfer history (0-100)
  - `legalCleanliness`: Legal disputes status (0-100)
  - `environmentalRisk`: Environmental hazards (0-100)
  - `constructionFeasibility`: Construction viability (0-100)
- `confidence`: high, medium, low
- `documents`: Array of uploaded files with verification status
- Timestamps: `createdAt`, `completedAt`, `updatedAt`

#### 2. **AuditLog Model** (`models/AuditLog.js`)
Tracks all admin activities and system changes.

**Key Fields:**
- `admin`: Admin user performing action
- `action`: Description of action performed
- `targetType`: Type of target (user, verification, document, etc.)
- `targetId`: ID of affected entity
- `changes`: Detailed change log
- `status`: success or failed
- `ipAddress`, `userAgent`: Request metadata

#### 3. **Dispute Model** (`models/Dispute.js`)
Manages user disputes and appeals.

**Key Fields:**
- `verificationId`: Related verification
- `userId`: User filing dispute
- `title`, `description`: Dispute details
- `category`: score-accuracy, document-validity, process-fairness, other
- `status`: open, under-review, resolved, closed
- `priority`: low, medium, high, critical
- `resolution`: Resolution details
- `assignedTo`: Admin handling dispute
- `comments`: Discussion thread
- `attachments`: Supporting documents

#### 4. **SystemConfig Model** (`models/SystemConfig.js`)
Stores system configuration and settings.

**Key Fields:**
- `key`: Unique configuration key
- `value`: Configuration value (any type)
- `category`: trust-score, fees, notifications, security, system, email
- `dataType`: string, number, boolean, json
- `updatedBy`: Admin who last updated

#### 5. **Transaction Model** (`models/Transaction.js`)
Records financial transactions.

**Key Fields:**
- `userId`: Transaction user
- `verificationId`: Related verification
- `amount`: Transaction amount
- `type`: verification-fee, commission, refund, penalty
- `status`: pending, completed, failed, refunded
- `paymentMethod`: Payment method used
- `transactionId`: External payment gateway ID

#### 6. **ActivityLog Model** (`models/ActivityLog.js`)
Tracks user activities for security and monitoring.

**Key Fields:**
- `userId`: User performing action
- `action`: Action description
- `actionType`: login, logout, verification, document-upload, comment, dispute, download
- `resource`: Resource name
- `resourceId`: Resource ID
- `ipAddress`, `userAgent`: Request metadata

---

## Backend API Endpoints

### Base URL: `/api/admin`

### Authentication
All endpoints require admin role. Add middleware:
```javascript
const checkAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'super-admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};
```

### 1. Dashboard

**GET `/dashboard/stats`**
- Returns: KPI statistics, user counts, recent activity
- Response:
```json
{
  "totalUsers": 150,
  "totalVerifications": 200,
  "pendingVerifications": 45,
  "completedVerifications": 150,
  "avgTrustScore": "75.40",
  "buyersCount": 80,
  "sellersCount": 50,
  "verifiersCount": 20,
  "completionRate": "75.00%",
  "recentActivity": []
}
```

### 2. User Management

**GET `/users`**
- Query Params:
  - `role`: Filter by role (buyer, seller, legal, admin)
  - `search`: Search by name or email
  - `page`: Page number (default: 1)
  - `limit`: Results per page (default: 10)
- Returns: Paginated user list

**PUT `/users/:userId/role`**
- Body: `{ "role": "admin", "active": true }`
- Returns: Updated user

**GET `/users/activity-logs`**
- Query Params:
  - `userId`: Filter by user (optional)
  - `page`: Page number
  - `limit`: Results per page
- Returns: Paginated activity logs

**POST `/users/:userId/deactivate`**
- Body: `{ "reason": "Violation of terms" }`
- Returns: Deactivated user

### 3. Verification Management

**GET `/verifications`**
- Query Params:
  - `status`: Filter by status
  - `verifierId`: Filter by assigned verifier
  - `page`: Page number
  - `limit`: Results per page
  - `sortBy`: Sort field (default: createdAt)
- Returns: Paginated verifications

**GET `/verifications/:verificationId`**
- Returns: Full verification details

**POST `/verifications/:verificationId/approve`**
- Body: 
```json
{
  "trustScore": 85,
  "documentClarity": 90,
  "ownershipContinuity": 85,
  "legalCleanliness": 80,
  "environmentalRisk": 75,
  "constructionFeasibility": 85,
  "confidence": "high",
  "comments": "Verification complete"
}
```
- Returns: Approved verification

**POST `/verifications/:verificationId/reject`**
- Body: `{ "rejectionReason": "Incomplete documents" }`
- Returns: Rejected verification

**POST `/verifications/:verificationId/assign-verifier`**
- Body: `{ "verifierId": "user_id" }`
- Returns: Verification with assigned verifier

**POST `/verifications/:verificationId/override-score`**
- Body: 
```json
{
  "newTrustScore": 70,
  "reason": "Data correction"
}
```
- Returns: Updated verification

**GET `/verifications/stats/overview`**
- Returns: Verification statistics by status and confidence

### 4. Compliance & Audit

**GET `/audit-logs`**
- Query Params:
  - `action`: Filter by action
  - `targetType`: Filter by target type
  - `startDate`, `endDate`: Date range
  - `page`: Page number
  - `limit`: Results per page
- Returns: Paginated audit logs

**GET `/compliance/report`**
- Query Params: `startDate`, `endDate`
- Returns: Compliance statistics

**GET `/disputes`**
- Query Params:
  - `status`: Filter by status
  - `priority`: Filter by priority
  - `page`: Page number
  - `limit`: Results per page
- Returns: Paginated disputes

**PUT `/disputes/:disputeId`**
- Body: `{ "status": "resolved", "resolution": "Score updated", "assignedTo": "admin_id" }`
- Returns: Updated dispute

**POST `/disputes/:disputeId/comment`**
- Body: `{ "text": "Comment text" }`
- Returns: Updated dispute with new comment

### 5. Settings & Configuration

**GET `/settings/config`**
- Query Params: `category` (optional)
- Returns: System configuration objects

**PUT `/settings/config`**
- Body:
```json
{
  "key": "verification_fee",
  "value": 100,
  "category": "fees",
  "description": "Verification fee in USD",
  "dataType": "number"
}
```
- Returns: Updated configuration

**GET `/reports/financial`**
- Query Params: `startDate`, `endDate`, `type`
- Returns: Financial statistics and transaction list

**GET `/reports/trust-score-analytics`**
- Query Params: `startDate`, `endDate`
- Returns: Trust score distribution and factor analysis

**GET `/reports/billing`**
- Query Params: `startDate`, `endDate`
- Returns: Billing report with transaction summary

---

## Frontend Components

### 1. AdminDashboard
**File:** `src/app/components/AdminDashboard.tsx`

Main dashboard with KPI cards and charts showing:
- Total users breakdown
- Verification statistics
- Average trust score
- Recent activity feed
- Visual charts for status distribution

### 2. AdminUserManagement
**File:** `src/app/components/AdminUserManagement.tsx`

Features:
- Search and filter users
- View user details
- Change user roles
- Deactivate users
- Pagination support

### 3. AdminVerificationManagement
**File:** `src/app/components/AdminVerificationManagement.tsx`

Features:
- Filter verifications by status
- View verification details
- Trust score display with color coding
- Assign verifiers
- Approve/Reject verifications

### 4. AdminComplianceAudit
**File:** `src/app/components/AdminComplianceAudit.tsx`

Features:
- Audit log viewer
- Dispute management
- Status tracking
- Priority filtering
- Comment system for disputes

### 5. AdminReportsAnalytics
**File:** `src/app/components/AdminReportsAnalytics.tsx`

Features:
- Trust score analytics
- Score distribution charts
- Factor analysis
- Date range filtering
- Export capabilities

---

## Integration Steps

### 1. Backend Setup
1. Import admin routes in your main server file:
```javascript
const adminRoutes = require('./routes/admin.routes');
app.use('/api/admin', adminRoutes);
```

2. Ensure authentication middleware is in place
3. Update User model to include admin role

### 2. Frontend Setup
1. Import components in your App.tsx routing
2. Add admin route protection
3. Import UI components from your shadcn setup

### 3. Database
1. Create indexes on frequently queried fields:
```javascript
// AuditLog indexes
db.auditlogs.createIndex({ createdAt: -1 });
db.auditlogs.createIndex({ admin: 1 });

// Verification indexes
db.verifications.createIndex({ status: 1 });
db.verifications.createIndex({ userId: 1 });
```

---

## Security Considerations

1. **Role-Based Access Control**: Only admins can access admin endpoints
2. **Audit Logging**: All admin actions are logged
3. **Data Encryption**: Sensitive data should be encrypted
4. **API Rate Limiting**: Implement rate limiting on admin endpoints
5. **Session Management**: Implement session timeouts for admin users
6. **Two-Factor Authentication**: Recommended for admin accounts

---

## Configuration Examples

### Trust Score Algorithm Configuration
```json
{
  "key": "trust_score_weights",
  "value": {
    "documentClarity": 0.2,
    "ownershipContinuity": 0.25,
    "legalCleanliness": 0.25,
    "environmentalRisk": 0.15,
    "constructionFeasibility": 0.15
  },
  "category": "trust-score",
  "dataType": "json"
}
```

### Verification Fees
```json
{
  "key": "verification_fee_usd",
  "value": 150,
  "category": "fees",
  "dataType": "number"
}
```

---

## Performance Optimization

1. **Database Indexing**: Index frequently queried fields
2. **Pagination**: Implement pagination for large datasets
3. **Caching**: Cache dashboard stats for 5 minutes
4. **Query Optimization**: Use aggregation pipeline for complex queries
5. **API Response Limits**: Limit data returned per request

---

## Testing

### Unit Tests for Controllers
```javascript
describe('Admin User Controller', () => {
  it('should fetch all users with filters', async () => {
    // Test implementation
  });

  it('should update user role', async () => {
    // Test implementation
  });
});
```

### Integration Tests
```javascript
describe('Admin API Routes', () => {
  it('should require admin authentication', async () => {
    // Test implementation
  });
});
```

---

## Monitoring & Logging

1. Track admin actions in audit logs
2. Monitor verification completion rates
3. Track average trust scores over time
4. Monitor dispute resolution times
5. Track financial transactions

---

## Future Enhancements

1. Export reports to PDF/Excel
2. Email notifications for admins
3. Bulk operations (update multiple users/verifications)
4. Advanced filtering and search
5. Custom dashboard widgets
6. Real-time notifications
7. Admin role-based permissions
8. Two-factor authentication
9. Admin activity alerts
