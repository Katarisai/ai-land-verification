# 🚀 QUICK START - Get Running in 30 Minutes

## Starting Point

Copy these files to your project:

1. ✅ **`src/app/components/LandChatbot.tsx`** - Chatbot component (provided)
2. ✅ **`src/app/components/AppHeader.tsx`** - Header with logout button (NEW)
3. ✅ **`src/app/components/PageLayout.tsx`** - Layout wrapper for all pages (NEW)
4. ✅ **`backend/src/models/Land.js`** - MongoDB model (provided)
5. Refer to **`API_ENDPOINTS.md`** for all endpoint specs
6. Review **`MONGODB_SCHEMA.md`** for data structure
7. Review **`LOGOUT_BUTTON_GUIDE.md`** for logout button implementation

---

## Step 1: Setup Backend (5 min)

### 1.1 Install Dependencies
```bash
cd backend
npm install mongoose openai aws-sdk dotenv cors body-parser
```

### 1.2 Create Environment File
```bash
# backend/.env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/land-db
OPENAI_API_KEY=sk-proj-xxxxx
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
S3_BUCKET_NAME=land-bucket
PORT=5000
JWT_SECRET=your-secret-key
```

### 1.3 Copy Models
```bash
# Copy provided Land.js to:
# backend/src/models/Land.js
```

---

## Step 2: Create Express Server (5 min)

Create **`backend/src/server.js`**:

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB error:', err));

// Routes
app.use('/api/lands', require('./routes/lands'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/ai', require('./routes/ai'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

---

## Step 3: Create First Endpoint (10 min)

### 3.1 Create Routes Directory
```bash
mkdir -p backend/src/routes
mkdir -p backend/src/controllers
```

### 3.2 Create Lands Routes

Create **`backend/src/routes/lands.js`**:

```javascript
const express = require('express');
const router = express.Router();
const Land = require('../models/Land');

// GET /api/lands/:landId
router.get('/:landId', async (req, res) => {
  try {
    const land = await Land.findOne({ landId: req.params.landId });
    if (!land) {
      return res.status(404).json({ error: 'Land not found' });
    }
    res.json({ land });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/lands/upload
router.post('/upload', async (req, res) => {
  try {
    const { owner, property, location, legal } = req.body;
    
    // Generate unique landId
    const landId = `LND-${Date.now()}`;
    
    // Create land document
    const land = new Land({
      landId,
      owner,
      property,
      location,
      legal,
      createdAt: new Date(),
      verification: {
        overallStatus: 'Pending',
        verificationSteps: [
          { step: 'Document Upload', status: 'complete', progress: 100 },
          { step: 'OCR Processing', status: 'pending', progress: 0 },
          { step: 'AI Verification', status: 'pending', progress: 0 },
          { step: 'Risk Assessment', status: 'pending', progress: 0 },
          { step: 'Final Review', status: 'pending', progress: 0 }
        ]
      }
    });
    
    await land.save();
    
    res.status(201).json({
      message: 'Land uploaded successfully',
      land,
      landId
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/lands (search with filters)
router.get('/', async (req, res) => {
  try {
    const { city, verified, risk, limit = 10, skip = 0 } = req.query;
    
    let query = {};
    if (city) query['location.city'] = city;
    if (verified) query['verification.overallStatus'] = verified ? 'Approved' : 'Pending';
    if (risk) query['aiProcessing.riskAssessment.level'] = risk;
    
    const lands = await Land.find(query)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ createdAt: -1 });
    
    const total = await Land.countDocuments(query);
    
    res.json({ lands, total, limit, skip });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

### 3.3 Test Endpoint
```bash
# Start server
npm start

# In another terminal, test:
curl http://localhost:5000/health
# Should return: { "status": "ok", ... }
```

---

## Step 4: Create Chatbot Endpoint (8 min)

Create **`backend/src/routes/chat.js`**:

```javascript
const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const Land = require('../models/Land');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// POST /api/chat
router.post('/', async (req, res) => {
  try {
    const { message, landId, conversationHistory = [] } = req.body;
    
    if (!landId) {
      return res.status(400).json({ error: 'landId required' });
    }
    
    // Get land data
    const land = await Land.findOne({ landId });
    if (!land) {
      return res.status(404).json({ error: 'Land not found' });
    }
    
    // Get or create chat context
    let chatContext = land.aiProcessing?.chatContext;
    if (!chatContext) {
      // Create basic context
      chatContext = `
LAND INFORMATION:
Owner: ${land.owner.name}
Location: ${land.location.city}, ${land.location.state}
Survey Number: ${land.surveyNumber}
Area: ${land.property.area} ${land.property.areaUnit}
Price: ₹${land.property.price}
Type: ${land.property.type}
Legal Status: ${land.legal.legalStatus}
      `.trim();
    }
    
    // Prepare messages for OpenAI
    const messages = [
      {
        role: 'system',
        content: `You are a helpful land verification assistant. Answer questions ONLY based on the provided land information. If information is not available, say "This information is not available in this land record." Be concise and helpful.
        
LAND DATA:
${chatContext}`
      },
      // Include conversation history
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      // Add current user message
      {
        role: 'user',
        content: message
      }
    ];
    
    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500
    });
    
    const assistantMessage = response.choices[0].message.content;
    
    // Save to chat history
    await land.addChatMessage(req.user?.id || 'anonymous', 'user', message);
    await land.addChatMessage(req.user?.id || 'anonymous', 'assistant', assistantMessage);
    
    res.json({
      reply: assistantMessage,
      landId,
      verified: land.verification.overallStatus === 'Approved'
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

### Test Chat:
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Is this land safe?",
    "landId": "LND-123456789",
    "conversationHistory": []
  }'
```

---

## Step 5: Frontend Integration (2 min)

### 5.1 Copy Component
```bash
# Copy provided LandChatbot.tsx to:
# src/app/components/LandChatbot.tsx
```

### 5.2 Use in Page
Create **`src/app/pages/BuyerLandView.tsx`**:

```typescript
import React, { useState, useEffect } from 'react';
import LandChatbot from '../components/LandChatbot';

interface Land {
  landId: string;
  owner: { name: string };
  property: { area: number; price: number };
  location: { city: string; state: string };
  verification: { overallStatus: string };
  aiProcessing?: { riskAssessment?: { level: string } };
}

export default function BuyerLandView({ landId }: { landId: string }) {
  const [land, setLand] = useState<Land | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLand = async () => {
      try {
        const response = await fetch(`/api/lands/${landId}`);
        const data = await response.json();
        setLand(data.land);
      } catch (error) {
        console.error('Error fetching land:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLand();
  }, [landId]);

  if (loading) return <div>Loading...</div>;
  if (!land) return <div>Land not found</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Land Details */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold mb-4">
            {land.property.area} {land.property.areaUnit} in {land.location.city}
          </h1>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Price</p>
              <p className="text-2xl font-bold">₹{land.property.price}</p>
            </div>
            <div>
              <p className="text-gray-600">Owner</p>
              <p className="text-lg">{land.owner.name}</p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded">
            <p className="text-sm">
              Status: <span className="font-bold">{land.verification.overallStatus}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Chatbot Sidebar */}
      <div>
        {land && (
          <LandChatbot
            land={land}
            onMessage={(msg) => console.log('Message sent:', msg)}
          />
        )}
      </div>
    </div>
  );
}
```

---

## 📊 Test Data (for initial testing)

### Create test-land.json:
```json
{
  "owner": {
    "name": "Sai Kumar",
    "email": "sai@example.com",
    "phone": "9876543210",
    "governmentId": "AADHAR123456"
  },
  "property": {
    "type": "Agricultural",
    "area": 5.2,
    "areaUnit": "Acres",
    "price": 2500000,
    "description": "Fertile agricultural land with good irrigation"
  },
  "location": {
    "city": "Hyderabad",
    "state": "Telangana",
    "gps": {
      "latitude": 28.6139,
      "longitude": 77.2090
    }
  },
  "legal": {
    "ownershipStatus": "Full",
    "legalStatus": "Clear",
    "noPendency": true,
    "noEncumbrance": true
  }
}
```

### Test Upload:
```bash
curl -X POST http://localhost:5000/api/lands/upload \
  -H "Content-Type: application/json" \
  -d @test-land.json
```

---

## 🎯 Next Steps

1. ✅ **Now:** Test endpoints with curl/Postman
2. ✅ **Then:** Add document upload endpoint
3. ✅ **Then:** Add AI verification endpoint
4. ✅ **Then:** Build frontend pages
5. ✅ **Then:** Deploy to production

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
❌ MongoDB error: connect ECONNREFUSED
```
**Fix:** Check MongoDB URI in `.env`
```bash
# Test connection:
mongo "mongodb+srv://user:pass@cluster.mongodb.net/test"
```

### OpenAI API Error
```
❌ 401 Unauthorized
```
**Fix:** Verify API key in `.env`
```bash
echo $OPENAI_API_KEY  # Should show your key
```

### Port Already in Use
```
❌ Error: listen EADDRINUSE: address already in use :::5000
```
**Fix:**
```bash
# Change port in .env
PORT=5001
```

---

## 📚 Full Feature Checklist

After Step 5, you have:
- ✅ Backend server running
- ✅ Land upload working
- ✅ Land search working
- ✅ Chatbot working with context
- ✅ Frontend integration ready

**Next:** Follow `DEVELOPER_CHECKLIST.md` for remaining features:
- Document verification
- Image management
- Risk assessment
- Search filters
- Analytics

---

## 💡 Pro Tips

1. **Keep API key safe** - Never commit `.env` to git
2. **Test chatbot** - Ask questions about the land data
3. **Monitor logs** - `console.log()` or use logging service
4. **Use Postman** - For testing endpoints before frontend
5. **Start simple** - Get basic flow working before bells & whistles

---

**Time estimate:** 30 minutes to get all 5 steps working!

Ready? Start with Step 1! 🚀
