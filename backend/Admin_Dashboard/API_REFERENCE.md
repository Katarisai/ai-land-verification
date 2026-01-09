# Admin Dashboard API Reference

## Quick Start

### Authentication
All admin endpoints require user with `admin` or `super-admin` role.

Add to request header:
```
Authorization: Bearer <token>
```

### Base URL
```
http://localhost:3000/api/admin
```

---

## API Endpoints Quick Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/stats` | Get dashboard KPIs and statistics |
| GET | `/users` | List all users with filters |
| PUT | `/users/:userId/role` | Update user role |
| GET | `/users/activity-logs` | Get user activity logs |
| POST | `/users/:userId/deactivate` | Deactivate user account |
| GET | `/verifications` | List all verifications |
| GET | `/verifications/:verificationId` | Get verification details |
| POST | `/verifications/:verificationId/approve` | Approve verification |
| POST | `/verifications/:verificationId/reject` | Reject verification |
| POST | `/verifications/:verificationId/assign-verifier` | Assign verifier |
| POST | `/verifications/:verificationId/override-score` | Override trust score |
| GET | `/verifications/stats/overview` | Get verification statistics |
| GET | `/audit-logs` | Get audit logs |
| GET | `/compliance/report` | Get compliance report |
| GET | `/disputes` | List disputes |
| PUT | `/disputes/:disputeId` | Update dispute |
| POST | `/disputes/:disputeId/comment` | Add dispute comment |
| GET | `/settings/config` | Get system configuration |
| PUT | `/settings/config` | Update system configuration |
| GET | `/reports/financial` | Get financial report |
| GET | `/reports/trust-score-analytics` | Get trust score analytics |
| GET | `/reports/billing` | Get billing report |

---

## Detailed Endpoint Documentation

### 1. Dashboard Stats
**GET** `/dashboard/stats`

Returns overall platform statistics and recent activities.

**Response:**
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
  "recentActivity": [
    {
      "_id": "user_id",
      "userId": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "action": "verification_submitted",
      "createdAt": "2025-01-06T10:30:00Z"
    }
  ]
}
```

---

### 2. List Users
**GET** `/users`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| role | string | Filter by role: buyer, seller, legal, admin |
| search | string | Search by name or email |
| page | number | Page number (default: 1) |
| limit | number | Results per page (default: 10) |

**Example Request:**
```
GET /users?role=buyer&search=john&page=1&limit=10
```

**Response:**
```json
{
  "users": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "buyer",
      "createdAt": "2025-01-01T00:00:00Z",
      "active": true
    }
  ],
  "totalPages": 5,
  "currentPage": 1,
  "total": 50
}
```

---

### 3. Update User Role
**PUT** `/users/:userId/role`

**Request Body:**
```json
{
  "role": "seller",
  "active": true
}
```

**Response:**
```json
{
  "message": "User updated successfully",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "seller",
    "active": true
  }
}
```

---

### 4. Get Verifications
**GET** `/verifications`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | pending, in-progress, completed, rejected |
| verifierId | string | Filter by assigned verifier ID |
| page | number | Page number (default: 1) |
| limit | number | Results per page (default: 10) |
| sortBy | string | Field to sort by (default: createdAt) |

**Response:**
```json
{
  "verifications": [
    {
      "_id": "verification_id",
      "userId": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "status": "completed",
      "trustScore": 85,
      "confidence": "high",
      "assignedVerifier": {
        "name": "Jane Smith"
      },
      "createdAt": "2025-01-05T00:00:00Z"
    }
  ],
  "totalPages": 10,
  "currentPage": 1,
  "total": 100
}
```

---

### 5. Approve Verification
**POST** `/verifications/:verificationId/approve`

**Request Body:**
```json
{
  "trustScore": 85,
  "documentClarity": 90,
  "ownershipContinuity": 85,
  "legalCleanliness": 80,
  "environmentalRisk": 75,
  "constructionFeasibility": 85,
  "confidence": "high",
  "comments": "All documents verified. Land is clear for purchase."
}
```

**Response:**
```json
{
  "message": "Verification approved successfully",
  "verification": {
    "_id": "verification_id",
    "status": "completed",
    "trustScore": 85,
    "completedAt": "2025-01-06T10:30:00Z"
  }
}
```

---

### 6. Reject Verification
**POST** `/verifications/:verificationId/reject`

**Request Body:**
```json
{
  "rejectionReason": "Missing legal documentation. Please resubmit with complete documents."
}
```

**Response:**
```json
{
  "message": "Verification rejected successfully",
  "verification": {
    "_id": "verification_id",
    "status": "rejected",
    "rejectionReason": "Missing legal documentation...",
    "completedAt": "2025-01-06T10:30:00Z"
  }
}
```

---

### 7. Assign Verifier
**POST** `/verifications/:verificationId/assign-verifier`

**Request Body:**
```json
{
  "verifierId": "verifier_user_id"
}
```

**Response:**
```json
{
  "message": "Verifier assigned successfully",
  "verification": {
    "_id": "verification_id",
    "status": "in-progress",
    "assignedVerifier": {
      "_id": "verifier_user_id",
      "name": "Jane Smith"
    }
  }
}
```

---

### 8. Override Trust Score
**POST** `/verifications/:verificationId/override-score`

**Request Body:**
```json
{
  "newTrustScore": 72,
  "reason": "Manual adjustment based on additional legal review"
}
```

**Response:**
```json
{
  "message": "Trust score overridden successfully",
  "verification": {
    "_id": "verification_id",
    "trustScore": 72
  }
}
```

---

### 9. Get Audit Logs
**GET** `/audit-logs`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| action | string | Filter by action type |
| targetType | string | user, verification, document, etc. |
| startDate | string | ISO date string |
| endDate | string | ISO date string |
| page | number | Page number (default: 1) |
| limit | number | Results per page (default: 20) |

**Response:**
```json
{
  "logs": [
    {
      "_id": "log_id",
      "admin": {
        "name": "Admin User",
        "email": "admin@example.com"
      },
      "action": "Approved verification",
      "targetType": "verification",
      "status": "success",
      "createdAt": "2025-01-06T10:30:00Z"
    }
  ],
  "totalPages": 5,
  "currentPage": 1
}
```

---

### 10. Get Disputes
**GET** `/disputes`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | open, under-review, resolved, closed |
| priority | string | low, medium, high, critical |
| page | number | Page number (default: 1) |
| limit | number | Results per page (default: 10) |

**Response:**
```json
{
  "disputes": [
    {
      "_id": "dispute_id",
      "userId": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "title": "Incorrect trust score calculation",
      "status": "under-review",
      "priority": "high",
      "createdAt": "2025-01-05T00:00:00Z"
    }
  ],
  "totalPages": 3,
  "currentPage": 1,
  "total": 25
}
```

---

### 11. Update Dispute
**PUT** `/disputes/:disputeId`

**Request Body:**
```json
{
  "status": "resolved",
  "resolution": "Score recalculated and updated to 78",
  "assignedTo": "admin_id"
}
```

**Response:**
```json
{
  "message": "Dispute updated successfully",
  "dispute": {
    "_id": "dispute_id",
    "status": "resolved",
    "resolution": "Score recalculated..."
  }
}
```

---

### 12. Add Dispute Comment
**POST** `/disputes/:disputeId/comment`

**Request Body:**
```json
{
  "text": "We have reviewed the documents and found the score is accurate."
}
```

**Response:**
```json
{
  "message": "Comment added successfully",
  "dispute": {
    "_id": "dispute_id",
    "comments": [
      {
        "user": { "name": "Admin Name" },
        "text": "We have reviewed...",
        "createdAt": "2025-01-06T10:30:00Z"
      }
    ]
  }
}
```

---

### 13. Get System Configuration
**GET** `/settings/config`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | trust-score, fees, notifications, security, system, email |

**Response:**
```json
[
  {
    "_id": "config_id",
    "key": "verification_fee",
    "value": 150,
    "category": "fees",
    "description": "Verification fee in USD",
    "dataType": "number",
    "updatedBy": { "name": "Admin" },
    "updatedAt": "2025-01-06T00:00:00Z"
  }
]
```

---

### 14. Update System Configuration
**PUT** `/settings/config`

**Request Body:**
```json
{
  "key": "verification_fee",
  "value": 200,
  "category": "fees",
  "description": "Verification fee in USD",
  "dataType": "number"
}
```

**Response:**
```json
{
  "message": "Configuration updated successfully",
  "config": {
    "key": "verification_fee",
    "value": 200
  }
}
```

---

### 15. Trust Score Analytics
**GET** `/reports/trust-score-analytics`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| startDate | string | ISO date string |
| endDate | string | ISO date string |

**Response:**
```json
{
  "overallStats": {
    "avgTrustScore": 75.4,
    "minTrustScore": 20,
    "maxTrustScore": 100,
    "totalVerifications": 200
  },
  "distribution": [
    { "_id": "0-20", "count": 15 },
    { "_id": "20-40", "count": 30 },
    { "_id": "40-60", "count": 50 },
    { "_id": "60-80", "count": 70 },
    { "_id": "80-100", "count": 35 }
  ],
  "factorAnalysis": {
    "avgDocumentClarity": 78.5,
    "avgOwnershipContinuity": 76.2,
    "avgLegalCleanliness": 74.8,
    "avgEnvironmentalRisk": 72.3,
    "avgConstructionFeasibility": 75.6
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid input",
  "error": "Trust score must be between 0 and 100"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Admin privileges required."
}
```

### 404 Not Found
```json
{
  "message": "Verification not found"
}
```

### 500 Server Error
```json
{
  "message": "Error approving verification",
  "error": "Database connection failed"
}
```

---

## Rate Limiting

Admin endpoints have rate limiting to prevent abuse:
- 1000 requests per hour per admin user
- 100 requests per minute for bulk operations

---

## Pagination

All list endpoints support pagination with default values:
- Default page: 1
- Default limit: 10-20 (varies by endpoint)
- Maximum limit: 100

Example:
```
GET /users?page=2&limit=25
```
