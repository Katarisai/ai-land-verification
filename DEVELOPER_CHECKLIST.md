# 🚀 DEVELOPER CHECKLIST - AI Land Verification System

## Phase 1: Project Setup ✅

### Backend Infrastructure
- [ ] Clone repository and install dependencies
  ```bash
  cd backend && npm install
  ```
  
- [ ] Create `.env` file with all required variables:
  ```
  MONGODB_URI=
  OPENAI_API_KEY=
  AWS_ACCESS_KEY_ID=
  AWS_SECRET_ACCESS_KEY=
  S3_BUCKET_NAME=
  PORT=5000
  JWT_SECRET=
  ```

- [ ] Setup MongoDB connection
  - [ ] Create MongoDB Atlas account
  - [ ] Create cluster
  - [ ] Get connection string
  - [ ] Test connection with `npm run test:db`

- [ ] Setup OpenAI API
  - [ ] Create account at https://platform.openai.com
  - [ ] Generate API key
  - [ ] Test with `npm run test:ai`

- [ ] Setup AWS S3
  - [ ] Create S3 bucket
  - [ ] Get access keys
  - [ ] Configure CORS
  - [ ] Test upload with `npm run test:s3`

- [ ] Create directory structure
  ```bash
  mkdir -p backend/src/{models,routes,controllers,services,middleware}
  ```

---

## Phase 2: Database Layer 📊

### MongoDB Schema Implementation
- [ ] Copy provided `Land.js` model to `backend/src/models/Land.js`
- [ ] Review MONGODB_SCHEMA.md for complete documentation
- [ ] Create database indexes:
  ```bash
  npm run setup:db
  ```
- [ ] Seed sample data for testing:
  ```bash
  npm run seed:data
  ```

### Database Validation
- [ ] Test Land model creation:
  ```javascript
  const land = await Land.create({
    landId: "TEST-001",
    surveyNumber: "45A/12",
    owner: { name: "Test Owner", email: "test@example.com" }
  });
  ```
- [ ] Test all instance methods:
  - [ ] `land.getChatContext()`
  - [ ] `land.addChatMessage()`
  - [ ] `land.addLead()`
  - [ ] `land.getVerificationProgress()`
  - [ ] `land.logAction()`

- [ ] Test all static methods:
  - [ ] `Land.findVerified()`
  - [ ] `Land.findByLocation()`
  - [ ] `Land.findByPriceRange()`

---

## Phase 3: API Endpoints - Land Management 🏠

### Seller Endpoints (Use API_ENDPOINTS.md as reference)

#### POST /api/lands/upload (Create New Land)
- [ ] Implement endpoint handler
- [ ] Validate request:
  - [ ] Owner details present
  - [ ] Land information complete
  - [ ] GPS coordinates valid
- [ ] Create Land document in MongoDB
- [ ] Generate unique landId
- [ ] Trigger AI verification async job
- [ ] Return created land with landId
- [ ] Test endpoint:
  ```bash
  curl -X POST http://localhost:5000/api/lands/upload \
    -H "Content-Type: application/json" \
    -d @test-files/land-sample.json
  ```

#### GET /api/lands/:landId (Retrieve Single Land)
- [ ] Implement endpoint
- [ ] Fetch from MongoDB by landId
- [ ] Include full context (documents, images, chat history)
- [ ] Test: `curl http://localhost:5000/api/lands/TEST-001`

#### PUT /api/lands/:landId (Update Land)
- [ ] Implement endpoint with JWT auth
- [ ] Validate seller ownership
- [ ] Update allowed fields (not landId or timestamps)
- [ ] Test update functionality

#### DELETE /api/lands/:landId (Delete/Archive Land)
- [ ] Implement endpoint with JWT auth
- [ ] Soft delete (archive) instead of hard delete
- [ ] Keep historical data for audit
- [ ] Test deletion

#### GET /api/lands (List Seller's Lands)
- [ ] JWT authentication
- [ ] Filter by seller
- [ ] Pagination support (limit, skip)
- [ ] Sort by createdDate descending
- [ ] Test: `curl "http://localhost:5000/api/lands?limit=10&skip=0"`

---

## Phase 4: API Endpoints - AI Verification 🤖

### AI Processing Endpoints

#### POST /api/ai/verify-documents (Document Processing)
- [ ] Implement OCR pipeline:
  - [ ] Accept document URLs or files
  - [ ] Extract text using Tesseract.js
  - [ ] Send extracted text to OpenAI
  - [ ] Get structured data back
- [ ] Update Land.documents array:
  ```javascript
  land.documents.push({
    type: "Title Deed",
    fileUrl: "...",
    status: "Verified",
    extractedText: "OCR result from Tesseract"
  });
  ```
- [ ] Store extraction results
- [ ] Calculate verification score
- [ ] Test with sample document

#### POST /api/ai/check-duplicate (Duplicate Detection)
- [ ] Implement duplicate checking logic:
  - [ ] Search by survey number
  - [ ] Search by owner name + location
  - [ ] Calculate similarity scores
- [ ] Return list of potentially duplicate lands
- [ ] Mark with "Duplicate Alert" if found
- [ ] Test: `curl -X POST http://localhost:5000/api/ai/check-duplicate`

#### POST /api/ai/generate-context (Create Chatbot Context)
- [ ] Extract all relevant land data
- [ ] Format comprehensive context string:
  ```
  LAND INFORMATION:
  Location: Hyderabad, Telangana
  Owner: Sai Kumar
  Survey Number: 45A/12
  Area: 5.2 Acres
  Price: ₹25,00,000
  Legal Status: Clear
  Verified: Yes
  Risk Level: Low
  
  [Full extracted details...]
  ```
- [ ] Store in MongoDB `chatContext` field
- [ ] Test context generation & retrieval

---

## Phase 5: API Endpoints - Chatbot 💬

### Chat Endpoints

#### POST /api/chat (Send Message)
- [ ] Validate landId exists
- [ ] Load land context from MongoDB
- [ ] Get conversation history (if exists)
- [ ] Call OpenAI with:
  ```javascript
  {
    system: "You are a land verification assistant. Answer ONLY based on provided land data...",
    context: land.chatContext,
    history: previousMessages,
    userMessage: req.body.message
  }
  ```
- [ ] Get response from OpenAI
- [ ] Save message & response to MongoDB:
  ```javascript
  land.chatHistory[userId].messages.push({
    role: "user",
    content: userMessage,
    timestamp: Date.now()
  });
  land.chatHistory[userId].messages.push({
    role: "assistant",
    content: aiResponse,
    timestamp: Date.now()
  });
  ```
- [ ] Return response to client
- [ ] Test with sample questions:
  - "Is this land safe to buy?"
  - "What's the legal status?"
  - "What documents are verified?"

#### GET /api/chat/history/:landId/:userId (Get Conversation)
- [ ] Retrieve chat history from MongoDB
- [ ] Return formatted messages
- [ ] Test retrieval

---

## Phase 6: API Endpoints - Search & Discovery 🔍

### Search Endpoints

#### GET /api/lands/search?q=:query (Full Text Search)
- [ ] Implement search across fields:
  - [ ] Survey number
  - [ ] Owner name
  - [ ] Location (city/district)
  - [ ] Description
- [ ] Use MongoDB text indexes
- [ ] Return paginated results
- [ ] Test: `curl "http://localhost:5000/api/lands/search?q=hyderabad"`

#### GET /api/lands?verified=true&city=XXX (Filters)
- [ ] Implement query parameter filtering:
  - [ ] `?verified=true|false` - Verification status
  - [ ] `?city=Hyderabad` - Location filter
  - [ ] `?risk=low|medium|high` - Risk level
  - [ ] `?price_min=1000000&price_max=5000000` - Price range
  - [ ] `?type=Agricultural|Residential|Commercial` - Land type
- [ ] Combine multiple filters
- [ ] Test all filter combinations

---

## Phase 7: API Endpoints - Buyer Interactions 👤

### Lead Management

#### POST /api/leads/create (Submit Buyer Interest)
- [ ] Create lead document:
  ```javascript
  {
    landId: "LND-001",
    buyerName: "Buyer Name",
    buyerEmail: "buyer@email.com",
    offeredPrice: 2400000,
    status: "New",
    message: "Interested in this land"
  }
  ```
- [ ] Add to Land.leads array
- [ ] Send notification to seller
- [ ] Return lead confirmation
- [ ] Test lead creation

#### GET /api/lands/:landId/leads (Get Buyer Leads)
- [ ] JWT auth with seller verification
- [ ] Return all leads for seller's land
- [ ] Sort by date (recent first)
- [ ] Show buyer details & offers
- [ ] Test: `curl "http://localhost:5000/api/lands/LND-001/leads"`

---

## Phase 8: API Endpoints - Analytics 📈

### Analytics Endpoints

#### GET /api/lands/:landId/analytics (Land Statistics)
- [ ] Calculate and return:
  - [ ] View count
  - [ ] Inquiry count
  - [ ] Chat message count
  - [ ] Verification progress (%)
  - [ ] Risk assessment details
  - [ ] Document verification status
- [ ] Format for dashboard display
- [ ] Test daily analytics update

#### GET /api/lands/:landId/verification-status (Verification Progress)
- [ ] Return step-by-step verification status:
  ```javascript
  {
    overallProgress: 75,
    steps: [
      { step: "Document Upload", status: "complete", progress: 100 },
      { step: "OCR Processing", status: "complete", progress: 100 },
      { step: "AI Verification", status: "in_progress", progress: 60 },
      { step: "Risk Assessment", status: "pending", progress: 0 },
      { step: "Final Review", status: "pending", progress: 0 }
    ]
  }
  ```
- [ ] Test progress calculation

---

## Phase 9: Document Management 📄

### Document Endpoints

#### POST /api/lands/:landId/documents/upload (Upload Document)
- [ ] Validate file:
  - [ ] Allowed types: PDF, JPG, PNG
  - [ ] Max size: 10MB
  - [ ] Scan for malware
- [ ] Upload to S3
- [ ] Extract text with Tesseract
- [ ] Save to Land.documents array
- [ ] Test document upload

#### GET /api/lands/:landId/documents (Get Documents)
- [ ] Return all documents for land
- [ ] Include:
  - [ ] File URLs
  - [ ] Extracted text
  - [ ] Verification status
  - [ ] Upload date
- [ ] Test retrieval

---

## Phase 10: Image Management 📸

### Image Endpoints

#### POST /api/lands/:landId/images/upload (Upload Images)
- [ ] Accept multiple image files
- [ ] Compress images before upload
- [ ] Extract EXIF GPS data if available
- [ ] Upload to S3
- [ ] Save to Land.imageGallery array
- [ ] Test image upload

#### GET /api/lands/:landId/images (Get Image Gallery)
- [ ] Return all images for land
- [ ] Include GPS metadata
- [ ] Format URLs for CDN delivery
- [ ] Test retrieval

---

## Phase 11: Authentication & Security 🔐

### JWT Authentication
- [ ] Implement JWT generation on login
- [ ] Create middleware to validate JWT
- [ ] Protect endpoints:
  - [ ] /api/lands/:landId (PUT/DELETE - seller only)
  - [ ] /api/lands (GET - seller's lands only)
  - [ ] /api/leads (GET - seller only)
  - [ ] /api/chat (restrict to authenticated users)
- [ ] Test auth flow

### Security Measures
- [ ] Input validation on all endpoints
- [ ] Rate limiting (e.g., 100 requests/hour)
- [ ] CORS configuration
- [ ] SQL/NoSQL injection prevention
- [ ] File upload validation
- [ ] HTTPS enforcement (production)

---

## Phase 12: Frontend Integration 🎨

### React Components
- [ ] Copy `LandChatbot.tsx` to `src/app/components/`
- [ ] Create SellerDashboard integration:
  - [ ] Add land upload form (SellerDashboard)
  - [ ] Connect to POST /api/lands/upload
  - [ ] Show upload progress
  - [ ] Display verification status updates
  
- [ ] Create BuyerLandView page:
  - [ ] Display land details
  - [ ] Show image gallery
  - [ ] Integrate LandChatbot component
  - [ ] Show verification badge
  - [ ] Display risk level
  
- [ ] Create LandSearch page:
  - [ ] Search input
  - [ ] Filter options
  - [ ] Results grid/list
  - [ ] Pagination
  
- [ ] Create MyLeads page (seller):
  - [ ] List all buyer inquiries
  - [ ] Show offers and messages
  - [ ] Respond to leads

### API Integration
- [ ] Create API client hooks:
  ```javascript
  // hooks/useLand.ts
  export function useLand(landId) {
    const [land, setLand] = useState(null);
    useEffect(() => {
      fetch(`/api/lands/${landId}`)
        .then(r => r.json())
        .then(d => setLand(d.land));
    }, [landId]);
    return land;
  }
  
  // hooks/useChat.ts
  export function useChat(landId) {
    const [messages, setMessages] = useState([]);
    const sendMessage = async (message) => {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message, landId, messages })
      });
      return res.json();
    };
    return { messages, sendMessage };
  }
  ```

- [ ] Test all API calls
- [ ] Add error handling
- [ ] Add loading states
- [ ] Add success notifications

---

## Phase 13: Testing 🧪

### Unit Tests
- [ ] Test Land model methods
- [ ] Test utility functions
- [ ] Test data validation

### Integration Tests
- [ ] Test API endpoints:
  ```bash
  npm run test:api
  ```
- [ ] Test complete workflows:
  - [ ] Seller uploads land
  - [ ] AI verifies documents
  - [ ] Buyer searches and views
  - [ ] Chatbot responds with context
  - [ ] Buyer creates lead

### Load Testing
- [ ] Test with 100+ concurrent users
- [ ] Monitor response times
- [ ] Check database performance

### Manual Testing (QA Checklist)
- [ ] Seller can upload land
- [ ] Documents are processed correctly
- [ ] Chatbot responds accurately
- [ ] Buyer can search lands
- [ ] Buyer can view details
- [ ] Buyer can ask chatbot questions
- [ ] Buyer can create leads
- [ ] Seller can see leads
- [ ] Mobile responsive design
- [ ] Error messages are clear
- [ ] Loading states work
- [ ] Pagination works
- [ ] Filters work correctly

---

## Phase 14: Deployment 🚀

### Pre-Deployment Checklist
- [ ] All tests passing
- [ ] Environment variables set in production
- [ ] Database indexes created
- [ ] S3 bucket configured
- [ ] OpenAI API working
- [ ] Error logging configured
- [ ] Security headers set
- [ ] Rate limiting enabled
- [ ] HTTPS enabled
- [ ] Backup strategy in place

### Deploy Backend
```bash
# Using Heroku
heroku create land-api
heroku config:set MONGODB_URI=<production-uri>
heroku config:set OPENAI_API_KEY=<key>
git push heroku main
```

### Deploy Frontend
```bash
# Vercel or similar
npm run build
vercel
```

### Post-Deployment
- [ ] Test all endpoints in production
- [ ] Monitor error logs
- [ ] Check database performance
- [ ] Monitor API usage
- [ ] Verify SSL certificate
- [ ] Test from different devices

---

## Phase 15: Documentation & Handoff 📚

- [ ] Update README with setup instructions
- [ ] Document API changes
- [ ] Create developer guide
- [ ] Record demo video
- [ ] Create troubleshooting guide
- [ ] Set up monitoring dashboard
- [ ] Create runbook for common issues

---

## QUICK REFERENCE

### Running Development Server
```bash
cd backend
npm install
npm run dev
```

### Environment Setup
```bash
# Copy .env.example to .env
cp .env.example .env

# Fill in required variables
MONGODB_URI=mongodb+srv://...
OPENAI_API_KEY=sk-proj-...
AWS_ACCESS_KEY_ID=...
```

### Testing Endpoints
```bash
# All tests
npm run test

# Specific test file
npm run test -- auth.test.js

# Watch mode
npm run test -- --watch
```

### Database Commands
```bash
# Setup indexes
npm run setup:db

# Seed sample data
npm run seed:data

# Clear database (dev only!)
npm run db:reset
```

---

## 📊 PROGRESS TRACKING

| Phase | Task | Status | Started | Completed |
|-------|------|--------|---------|-----------|
| 1 | Backend Setup | ⬜ | - | - |
| 2 | Database Layer | ⬜ | - | - |
| 3 | Land Management Endpoints | ⬜ | - | - |
| 4 | AI Verification Endpoints | ⬜ | - | - |
| 5 | Chatbot Endpoints | ⬜ | - | - |
| 6 | Search Endpoints | ⬜ | - | - |
| 7 | Buyer Interactions | ⬜ | - | - |
| 8 | Analytics Endpoints | ⬜ | - | - |
| 9 | Document Management | ⬜ | - | - |
| 10 | Image Management | ⬜ | - | - |
| 11 | Authentication | ⬜ | - | - |
| 12 | Frontend Integration | ⬜ | - | - |
| 13 | Testing | ⬜ | - | - |
| 14 | Deployment | ⬜ | - | - |
| 15 | Documentation | ⬜ | - | - |

---

**Legend:** ⬜ Not Started | 🔄 In Progress | ✅ Complete | ⚠️ Blocked

**Estimated Timeline:** 4-6 weeks for complete implementation

**Support:** Refer to IMPLEMENTATION_GUIDE.md, API_ENDPOINTS.md, and SYSTEM_WORKFLOW.md

Good luck! 🚀
