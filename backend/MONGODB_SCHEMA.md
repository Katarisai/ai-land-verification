# 📦 MongoDB LAND VERIFICATION SYSTEM - SCHEMA & STORAGE

## 🗄️ LAND COLLECTION SCHEMA

```javascript
// MongoDB Schema for Land Documents
db.lands.insertOne({
  // Essential Land Identifiers
  _id: ObjectId(),
  landId: "LND-HYD-2024-001",                  // Unique land identifier
  surveyNumber: "45A/12",                       // Government survey number
  
  // Seller/Owner Information
  owner: {
    name: "Sai Kumar",
    email: "sai@email.com",
    phone: "+91-9876543210",
    governmentId: "AADHAR-XXXX-XXXX-5678",
    address: "123 Main St, Hyderabad, TS"
  },

  // Land Details
  location: {
    city: "Hyderabad",
    district: "Rangareddy",
    state: "Telangana",
    country: "India",
    gps: {
      latitude: 28.6139,
      longitude: 77.2090,
      accuracy: "±5 meters"
    }
  },

  // Property Details
  property: {
    type: "Agricultural",                       // Agricultural, Residential, Commercial, etc.
    area: 5.2,
    areaUnit: "Acres",
    price: 2500000,
    currency: "INR",
    description: "Fertile agricultural land with irrigation facilities and good access roads"
  },

  // Legal Information
  legal: {
    ownershipStatus: "Individual Owner",        // Individual, Joint, Corporate, etc.
    legalStatus: "Registered",                  // Registered, Pending, Contested, etc.
    noPendency: true,                           // Boolean - no legal disputes
    noEncumbrance: true,                        // Boolean - no liens/mortgages
    mortgageStatus: "Clear"
  },

  // Document Storage
  documents: [
    {
      documentId: "DOC-001",
      type: "Title Deed",                       // Document type
      fileName: "Title_Deed_Original.pdf",
      fileUrl: "s3://bucket/path/to/file.pdf",
      uploadDate: ISODate("2024-04-15T10:30:00Z"),
      fileSize: 2400000,                        // in bytes
      status: "Verified",                       // Uploaded, Verified, Rejected
      ocrExtracted: true,
      extractedText: "Land information extracted via OCR..."
    },
    {
      documentId: "DOC-002",
      type: "Survey Report",
      fileName: "Survey_Report_2024.pdf",
      fileUrl: "s3://bucket/path/survey.pdf",
      uploadDate: ISODate("2024-04-15T10:35:00Z"),
      fileSize: 1800000,
      status: "Verified",
      ocrExtracted: true,
      extractedText: "Survey details..."
    }
  ],

  // AI Extracted & Processed Data
  aiProcessing: {
    processedDate: ISODate("2024-04-15T11:00:00Z"),
    processingStatus: "Complete",               // Complete, InProgress, Failed
    ocrConfidenceScore: 0.95,                   // 0-1, higher is better
    
    // AI Extracted Information
    extractedData: {
      ownerName: "Sai Kumar",
      landId: "45A/12",
      governmentRecords: "Registered in Sub-Registry, Hyderabad",
      legalStatus: "Legally verified - No disputes",
      boundaries: "North: Road, South: Field, East: Canal, West: Farm",
      soilType: "Black soil - Suitable for sugarcane, cotton",
      waterAvailability: "Bore well, Canal irrigation",
      accessRoads: "Accessible via state highway"
    },

    // AI Generated Summary for Chatbot Context
    aiSummary: `This land property is located in Hyderabad, Telangana. 
    Owner: Sai Kumar
    Area: 5.2 Acres
    Land Type: Agricultural
    Legal Status: Fully Registered with no disputes
    Verification: Verified and approved for sale`,

    // Full Context for Chatbot (All structured data + document extracts)
    chatContext: `LAND DETAILS:
Owner: Sai Kumar
Survey Number: 45A/12
Location: Hyderabad, Telangana
Area: 5.2 Acres
Price: ₹2,500,000
Land Type: Agricultural

LEGAL INFORMATION:
Ownership: Registered
Status: No legal disputes
Encumbrance: Clear

EXTRACTED DOCUMENT DATA:
[Title Deed]: Land is registered under Sai Kumar...
[Survey]: Boundaries are clearly defined...
[Government Records]: No ownership conflicts...`,

    // Risk Assessment
    riskAssessment: {
      riskLevel: "Low",                         // Low, Medium, High
      riskScore: 0.15,                          // 0-1, lower is safer
      alerts: [],                               // Empty = no alerts
      findings: [
        "✓ Ownership clearly established",
        "✓ All documents verified",
        "✓ No legal disputes found",
        "✓ GPS coordinates confirmed"
      ]
    }
  },

  // Image Gallery with GPS Tags
  imageGallery: [
    {
      imageId: "IMG-001",
      fileName: "Land_North_Entry.jpg",
      imageUrl: "s3://bucket/images/north.jpg",
      uploadDate: ISODate("2024-04-15T09:00:00Z"),
      description: "North entry view",
      gpsTag: {
        latitude: 28.6139,
        longitude: 77.2090,
        timestamp: ISODate("2024-04-15T09:00:00Z")
      },
      imageMetadata: {
        resolution: "1920x1440",
        quality: "HD",
        cameraInfo: "iPhone 13"
      }
    },
    {
      imageId: "IMG-002",
      fileName: "Land_West_Boundary.jpg",
      imageUrl: "s3://bucket/images/west.jpg",
      uploadDate: ISODate("2024-04-15T09:15:00Z"),
      description: "West boundary view",
      gpsTag: {
        latitude: 28.6140,
        longitude: 77.2089,
        timestamp: ISODate("2024-04-15T09:15:00Z")
      }
    }
  ],

  // Verification Status Tracking
  verification: {
    overallStatus: "Approved",                  // Pending, Approved, Rejected
    verifiedDate: ISODate("2024-04-15T11:30:00Z"),
    verifiedBy: "AI System + Human Review",
    
    verificationSteps: [
      {
        step: "Ownership & ID Verification",
        status: "Complete",
        progress: 100,
        details: "Title deed and government ID verified"
      },
      {
        step: "Zoning & Legal Status Check",
        status: "Complete",
        progress: 100,
        details: "No zoning restrictions found"
      },
      {
        step: "Land Boundary Verification",
        status: "Complete",
        progress: 100,
        details: "GPS and survey documents match"
      },
      {
        step: "Environmental Check",
        status: "Complete",
        progress: 100,
        details: "No environmental concerns"
      }
    ]
  },

  // Chat Interaction History
  chatHistory: [
    {
      chatId: "CHAT-001",
      sessionDate: ISODate("2024-04-15T14:00:00Z"),
      userId: "BUYER-123",
      messages: [
        {
          role: "user",
          content: "Is this land legally safe?",
          timestamp: ISODate("2024-04-15T14:00:00Z")
        },
        {
          role: "assistant",
          content: "Yes, based on uploaded documents, this land is registered under Sai Kumar and has no ownership conflicts.",
          timestamp: ISODate("2024-04-15T14:00:05Z")
        }
      ]
    }
  ],

  // Buyer Leads & Offers
  leads: [
    {
      leadId: "LEAD-001",
      buyerName: "John Buyer",
      buyerEmail: "john@email.com",
      leadDate: ISODate("2024-04-15T13:00:00Z"),
      status: "Active",
      offeredPrice: 2400000,
      message: "Interested in this land. Can we negotiate?"
    }
  ],

  // Audit & Activity Log
  auditLog: [
    {
      action: "Land Uploaded",
      user: "Seller",
      timestamp: ISODate("2024-04-15T10:00:00Z"),
      details: "Land registration initiated"
    },
    {
      action: "AI Verification Completed",
      user: "System",
      timestamp: ISODate("2024-04-15T11:00:00Z"),
      details: "All documents processed and verified"
    },
    {
      action: "Land Published",
      user: "System",
      timestamp: ISODate("2024-04-15T11:30:00Z"),
      details: "Land approved and visible to buyers"
    }
  ],

  // Metadata
  createdDate: ISODate("2024-04-15T10:00:00Z"),
  lastModifiedDate: ISODate("2024-04-15T14:00:00Z"),
  isPublished: true,
  isActive: true,
  views: 24,
  likes: 5
});
```

## 🔑 INDEXES FOR PERFORMANCE

```javascript
// Create indexes for fast queries
db.lands.createIndex({ landId: 1 });                    // Unique land lookup
db.lands.createIndex({ surveyNumber: 1 });             // Survey number search
db.lands.createIndex({ "owner.name": 1 });             // Owner search
db.lands.createIndex({ "location.city": 1 });          // Location search
db.lands.createIndex({ verification.overallStatus: 1 }); // Status filtering
db.lands.createIndex({ isPublished: 1, isActive: 1 }); // Published lands
db.lands.createIndex({ createdDate: -1 });             // Recent lands
db.lands.createIndex({ "property.type": 1 });          // Land type filter
```

## 📊 QUERY EXAMPLES

```javascript
// Find a specific land by ID
db.lands.findOne({ landId: "LND-HYD-2024-001" });

// Get all verified lands
db.lands.find({ "verification.overallStatus": "Approved" });

// Find lands by city
db.lands.find({ "location.city": "Hyderabad" });

// Find lands within area range
db.lands.find({ "property.area": { $gte: 5, $lte: 10 } });

// Get all published lands
db.lands.find({ isPublished: true, isActive: true });

// Find by price range
db.lands.find({ "property.price": { $gte: 2000000, $lte: 3000000 } });
```

## 🔄 DATA FLOW IN SYSTEM

```
1. SELLER UPLOADS LAND
   ↓
2. DOCUMENTS STORED IN MONGODB
   ↓
3. AI PROCESSES DOCUMENTS (OCR + Extraction)
   ↓
4. EXTRACTED DATA STORED IN `aiProcessing` FIELD
   ↓
5. AI SUMMARY & CHAT CONTEXT GENERATED
   ↓
6. `chatContext` FIELD POPULATED FOR CHATBOT
   ↓
7. LAND MARKED AS VERIFIED (PENDING REVIEW)
   ↓
8. LAND PUBLISHED TO BUYERS
   ↓
9. BUYER OPENS LAND → CHATBOT LOADS WITH CONTEXT
   ↓
10. CHATBOT USES `chatContext` TO ANSWER QUESTIONS
```

## 📝 SAMPLE CHATBOT CONTEXT

The `chatContext` field contains all information the chatbot needs:

```
LAND INFORMATION:
- Owner: Sai Kumar
- Location: Hyderabad, Telangana
- Survey Number: 45A/12
- Area: 5.2 Acres
- Price: ₹2,500,000

DOCUMENT EXTRACTS:
Title Deed: "The above described property is registered in the name of Sai Kumar..."
Survey Report: "Boundaries: North - State Road, South - Agricultural Field..."
Government Records: "Ownership verified. No pending disputes or claims..."

This ensures chatbot ONLY answers about this specific land.
```
