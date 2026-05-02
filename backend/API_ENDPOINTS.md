# 🔌 BACKEND API ENDPOINTS - LAND VERIFICATION SYSTEM

## 📚 API Overview
All endpoints follow RESTful principles and return JSON responses.

---

## 🔓 1. SELLER ENDPOINTS - LAND MANAGEMENT

### POST /api/lands/upload
**Description:** Upload a new land with documents and details

**Request:**
```json
{
  "owner": {
    "name": "Sai Kumar",
    "email": "sai@email.com",
    "phone": "+91-9876543210",
    "governmentId": "AADHAR-XXXX-XXXX-5678",
    "address": "123 Main St, Hyderabad"
  },
  "land": {
    "surveyNumber": "45A/12",
    "type": "Agricultural",
    "area": 5.2,
    "areaUnit": "Acres",
    "price": 2500000,
    "location": "Hyderabad, Telangana",
    "description": "Fertile agricultural land..."
  },
  "gps": {
    "latitude": 28.6139,
    "longitude": 77.2090
  },
  "documents": ["file_urls_array"],
  "images": ["image_urls_array"]
}
```

**Response:**
```json
{
  "success": true,
  "landId": "LND-HYD-2024-001",
  "message": "Land submitted for AI verification",
  "status": "Processing"
}
```

---

### GET /api/lands/:landId
**Description:** Get specific land details

**Response:**
```json
{
  "success": true,
  "land": {
    "landId": "LND-HYD-2024-001",
    "owner": {
      "name": "Sai Kumar",
      "email": "sai@email.com"
    },
    "location": "Hyderabad, Telangana",
    "surveyNumber": "45A/12",
    "price": 2500000,
    "verified": true,
    "riskLevel": "low",
    "aiSummary": "This land is legally verified...",
    "chatContext": "Full extracted data for chatbot..."
  }
}
```

---

### GET /api/lands?seller=:sellerId
**Description:** Get all lands by a seller

**Response:**
```json
{
  "success": true,
  "lands": [
    {
      "landId": "LND-HYD-2024-001",
      "surveyNumber": "45A/12",
      "location": "Hyderabad",
      "verified": true,
      "views": 24,
      "leads": 5
    }
  ],
  "total": 5
}
```

---

### PUT /api/lands/:landId
**Description:** Update land details

**Request:**
```json
{
  "price": 2750000,
  "description": "Updated description...",
  "location": "New location"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Land updated successfully",
  "land": { updated_land_object }
}
```

---

### DELETE /api/lands/:landId
**Description:** Delete a land listing

**Response:**
```json
{
  "success": true,
  "message": "Land deleted successfully"
}
```

---

## 🤖 2. AI VERIFICATION ENDPOINTS

### POST /api/ai/verify-documents
**Description:** Process documents with OCR and AI extraction

**Request:**
```json
{
  "landId": "LND-HYD-2024-001",
  "documentUrls": ["url1", "url2"],
  "documentTypes": ["Title Deed", "Survey Report"]
}
```

**Response:**
```json
{
  "success": true,
  "extractedData": {
    "ownerName": "Sai Kumar",
    "landId": "45A/12",
    "legalStatus": "Registered",
    "boundaries": "North: Road, South: Field...",
    "confidence": 0.95
  },
  "aiSummary": "This land is legally verified and registered under Sai Kumar...",
  "chatContext": "Full context for chatbot",
  "riskAssessment": {
    "riskLevel": "Low",
    "riskScore": 0.15,
    "alerts": []
  }
}
```

---

### POST /api/ai/check-duplicate
**Description:** Check for duplicate ownership or conflicting lands

**Request:**
```json
{
  "ownerName": "Sai Kumar",
  "surveyNumber": "45A/12",
  "location": "Hyderabad"
}
```

**Response:**
```json
{
  "success": true,
  "isDuplicate": false,
  "conflicts": [],
  "message": "No duplicate ownership found"
}
```

---

### POST /api/ai/generate-context
**Description:** Generate AI context for chatbot from land data

**Request:**
```json
{
  "landId": "LND-HYD-2024-001"
}
```

**Response:**
```json
{
  "success": true,
  "context": "LAND INFORMATION:\nOwner: Sai Kumar\nLocation: Hyderabad...",
  "summary": "This land is legally verified and safe to invest..."
}
```

---

## 💬 3. CHATBOT ENDPOINTS

### POST /api/chat
**Description:** Send message to land-specific chatbot

**Request:**
```json
{
  "message": "Is this land legally safe?",
  "landId": "LND-HYD-2024-001",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Tell me about this land"
    },
    {
      "role": "assistant",
      "content": "This land is 5.2 acres..."
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "reply": "Yes, based on uploaded documents, this land is registered under Sai Kumar and has no ownership conflicts.",
  "usage": {
    "prompt_tokens": 250,
    "completion_tokens": 50,
    "total_tokens": 300
  }
}
```

---

### GET /api/chat/history/:landId/:userId
**Description:** Get chat history for a land and user

**Response:**
```json
{
  "success": true,
  "chatHistory": [
    {
      "chatId": "CHAT-001",
      "timestamp": "2024-04-15T14:00:00Z",
      "messages": [
        {
          "role": "user",
          "content": "Is this land safe?",
          "timestamp": "2024-04-15T14:00:00Z"
        }
      ]
    }
  ]
}
```

---

## 📍 4. LAND SEARCH & FILTER ENDPOINTS

### GET /api/lands/search?q=:query
**Description:** Search lands by location, owner, survey number

**Example:** `/api/lands/search?q=Hyderabad&type=Agricultural&priceMin=2000000&priceMax=3000000`

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "landId": "LND-HYD-2024-001",
      "location": "Hyderabad",
      "surveyNumber": "45A/12",
      "verified": true
    }
  ],
  "total": 5,
  "filters": {
    "type": "Agricultural",
    "priceRange": "2M - 3M"
  }
}
```

---

### GET /api/lands?verified=true&riskLevel=low&city=Hyderabad
**Description:** Get filtered lands

**Response:**
```json
{
  "success": true,
  "lands": [...],
  "total": 15,
  "filters": {
    "verified": true,
    "riskLevel": "low",
    "city": "Hyderabad"
  }
}
```

---

## 👤 5. BUYER ENDPOINTS

### POST /api/leads/create
**Description:** Create a lead (buyer interest)

**Request:**
```json
{
  "landId": "LND-HYD-2024-001",
  "buyerName": "John Doe",
  "buyerEmail": "john@email.com",
  "buyerPhone": "+91-9999999999",
  "message": "Interested in this land",
  "offeredPrice": 2400000
}
```

**Response:**
```json
{
  "success": true,
  "leadId": "LEAD-001",
  "message": "Lead created. Seller will contact you soon."
}
```

---

### GET /api/lands/:landId/leads
**Description:** Get all leads for a land (seller view)

**Response:**
```json
{
  "success": true,
  "leads": [
    {
      "leadId": "LEAD-001",
      "buyerName": "John Doe",
      "buyerEmail": "john@email.com",
      "offeredPrice": 2400000,
      "status": "Active",
      "createdDate": "2024-04-15"
    }
  ],
  "total": 3
}
```

---

## 📊 6. ANALYTICS ENDPOINTS

### GET /api/lands/:landId/analytics
**Description:** Get land analytics (views, leads, engagement)

**Response:**
```json
{
  "success": true,
  "analytics": {
    "totalViews": 156,
    "totalLeads": 12,
    "totalOffers": 3,
    "averageLeadTime": "2 days",
    "conversionRate": 7.7,
    "viewsByDay": [
      { "date": "2024-04-15", "views": 24 },
      { "date": "2024-04-14", "views": 32 }
    ]
  }
}
```

---

## ✅ 7. VERIFICATION STATUS ENDPOINTS

### GET /api/lands/:landId/verification-status
**Description:** Get detailed verification status

**Response:**
```json
{
  "success": true,
  "status": {
    "overallStatus": "Approved",
    "verifiedDate": "2024-04-15T11:30:00Z",
    "steps": [
      {
        "step": "Ownership Verification",
        "status": "Complete",
        "progress": 100,
        "details": "Verified via Aadhar and Title Deed"
      }
    ],
    "riskAssessment": {
      "riskLevel": "Low",
      "findings": [
        "✓ Ownership clearly established",
        "✓ No legal disputes found"
      ]
    }
  }
}
```

---

## 📄 8. DOCUMENT ENDPOINTS

### GET /api/lands/:landId/documents
**Description:** Get all documents for a land

**Response:**
```json
{
  "success": true,
  "documents": [
    {
      "documentId": "DOC-001",
      "type": "Title Deed",
      "fileName": "Title_Deed.pdf",
      "status": "Verified",
      "downloadUrl": "s3://bucket/file.pdf"
    }
  ]
}
```

---

### POST /api/lands/:landId/documents/upload
**Description:** Upload additional documents

**Request:**
```json
{
  "documentType": "Tax Receipt",
  "file": "base64_file_data"
}
```

**Response:**
```json
{
  "success": true,
  "documentId": "DOC-003",
  "message": "Document uploaded successfully"
}
```

---

## 🖼️ 9. IMAGE GALLERY ENDPOINTS

### GET /api/lands/:landId/images
**Description:** Get all images for a land

**Response:**
```json
{
  "success": true,
  "images": [
    {
      "imageId": "IMG-001",
      "url": "s3://bucket/image.jpg",
      "description": "North entry view",
      "gpsTag": {
        "latitude": 28.6139,
        "longitude": 77.2090
      },
      "uploadDate": "2024-04-15"
    }
  ]
}
```

---

### POST /api/lands/:landId/images/upload
**Description:** Upload images with GPS tags

**Request:**
```json
{
  "imageData": "base64",
  "description": "North boundary view",
  "gpsTag": {
    "latitude": 28.6139,
    "longitude": 77.2090
  }
}
```

**Response:**
```json
{
  "success": true,
  "imageId": "IMG-002",
  "url": "s3://bucket/IMG-002.jpg"
}
```

---

## 🔐 AUTHENTICATION

All endpoints (except search) require Bearer token:
```
Header: Authorization: Bearer {jwt_token}
```

---

## 📋 ERROR RESPONSES

```json
{
  "success": false,
  "error": "Invalid land ID",
  "statusCode": 400
}
```

---

## 🚀 DEPLOYMENT NOTES

- All file uploads use AWS S3 for storage
- OCR processing uses Tesseract/AWS Textract
- OpenAI API for chatbot responses
- MongoDB Atlas for database
- Redis for caching frequently accessed lands
