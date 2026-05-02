# 🔧 ADVANCED TROUBLESHOOTING - AI Land Verification System

## Database Issues 🗄️

### Issue 1: MongoDB Connection Failed
```
Error: MongoTimeoutError: Server selection timed out after 30000 ms
Connection refused at 127.0.0.1:27017
```

**Causes:**
- MongoDB not running
- Incorrect connection string
- Network firewall blocking
- Wrong credentials

**Solutions:**

1. **If using MongoDB Atlas (Cloud):**
```bash
# Check connection string format
# Should be: mongodb+srv://user:password@cluster.mongodb.net/dbname
# NOT: mongodb://localhost:27017

# Verify credentials in .env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name
```

2. **If using local MongoDB:**
```bash
# Start MongoDB service
# On Windows:
mongod --dbpath "C:\data\db"

# On Mac:
brew services start mongodb-community

# On Linux:
sudo systemctl start mongod
```

3. **Test connection:**
```bash
# Use MongoDB Shell
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/test"
```

4. **Check firewall:**
- Whitelist IP address in MongoDB Atlas
- Allow port 27017 in local firewall

---

### Issue 2: Database Authentication Failed
```
Error: auth failed
MongoAuthenticationError: authentication failed
```

**Solutions:**
```bash
# Verify credentials
echo $MONGODB_URI

# Check if password has special characters that need URL encoding
# Example: password "p@ssw0rd!" becomes "p%40ssw0rd%21"

# Update .env with properly encoded credentials
MONGODB_URI=mongodb+srv://user:p%40ssw0rd%21@cluster.mongodb.net/dbname
```

---

### Issue 3: Duplicate Key Error
```
MongoError: E11000 duplicate key error
Cannot insert document with duplicate landId
```

**Solutions:**
```javascript
// Ensure landId is unique before saving
const landId = `LND-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Or reset collection for testing
db.lands.deleteMany({});
db.lands.dropIndexes();
```

---

### Issue 4: Connection Pool Exhausted
```
Error: getConnection() failed due to connection pool being full
```

**Solutions:**
```javascript
// Increase connection pool size
mongoose.connect(uri, {
  maxPoolSize: 10,  // Default is 10
  minPoolSize: 5,   // Add this
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
```

---

## API Issues 🌐

### Issue 5: 404 Not Found
```
Cannot POST /api/lands/upload
```

**Causes:**
- Route not registered
- Typo in route path
- Server not running

**Solutions:**
```javascript
// In server.js, verify routes are registered
app.use('/api/lands', require('./routes/lands'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/ai', require('./routes/ai'));

// Check for typos
// Correct: /api/lands/upload
// Wrong: /api/land/upload or /api/lands/uploads
```

---

### Issue 6: 500 Internal Server Error
```
Status: 500
Error: Internal server error
```

**Solutions:**

1. **Check server logs:**
```bash
# Should show detailed error message
# Example output:
# Error: Cannot read property 'owner' of undefined
```

2. **Verify request data:**
```bash
# Test with valid data
curl -X POST http://localhost:5000/api/lands/upload \
  -H "Content-Type: application/json" \
  -d '{
    "owner": { "name": "Test", "email": "test@test.com" },
    "property": { "area": 5, "price": 100000 }
  }'
```

3. **Add error handling:**
```javascript
router.post('/upload', async (req, res) => {
  try {
    // Your code
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});
```

---

### Issue 7: CORS Error
```
Access to XMLHttpRequest at 'http://localhost:5000/api/lands' from 
origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solutions:**
```javascript
// In server.js
const cors = require('cors');

// Allow frontend URL
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

Update `.env`:
```
FRONTEND_URL=http://localhost:3000
```

---

### Issue 8: 401 Unauthorized
```
Error: No authorization header
401 Unauthorized
```

**Solutions:**
```javascript
// Add JWT auth middleware
app.use((req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token && req.path !== '/api/public') {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  // Verify token
  if (token) {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }
  
  next();
});

// For testing, skip auth:
// DELETE the auth check OR add public routes
```

---

## OpenAI Issues 🤖

### Issue 9: OpenAI API Key Invalid
```
APIError: Incorrect API key provided
401 Unauthorized
```

**Solutions:**
```bash
# Verify API key format
# Correct: sk-proj-xxxxx...
# Copy from: https://platform.openai.com/api-keys

# Update .env
OPENAI_API_KEY=sk-proj-correct-key-here

# Restart server after changing
npm start
```

---

### Issue 10: OpenAI Rate Limit Exceeded
```
Error: 429 Too Many Requests
RateLimitError: Rate limit exceeded
```

**Solutions:**
```javascript
// Implement retry with exponential backoff
async function chatWithRetry(message, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: message }]
      });
    } catch (error) {
      if (error.status === 429 && attempt < maxRetries - 1) {
        const delay = 1000 * Math.pow(2, attempt);
        console.log(`Rate limited. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}
```

---

### Issue 11: Chatbot Ignoring Land Context
```
Chatbot: "I don't have information about that"
Expected: Context-aware response about the land
```

**Causes:**
- chatContext not generated
- chatContext field is empty
- System prompt not including context
- Wrong role assignment

**Solutions:**
```javascript
// Verify chatContext is stored
const land = await Land.findOne({ landId });
console.log('Chat context:', land.aiProcessing?.chatContext);

// If empty, generate it
if (!land.aiProcessing?.chatContext) {
  const context = `
LAND INFORMATION:
Owner: ${land.owner.name}
Location: ${land.location.city}
Survey: ${land.surveyNumber}
Price: ₹${land.property.price}
Status: ${land.verification.overallStatus}
  `.trim();
  
  land.aiProcessing.chatContext = context;
  await land.save();
}

// Verify system prompt includes context in OpenAI request
const messages = [
  {
    role: 'system',
    content: `You are a land assistant. Use only this land data:\n${land.aiProcessing.chatContext}`
  },
  { role: 'user', content: userMessage }
];
```

---

### Issue 12: Streaming Response Issues
```
Error: getresponseread ECONNRESET
```

**Solutions:**
```javascript
// Add timeout
router.post('/chat', async (req, res) => {
  const timeout = setTimeout(() => {
    res.status(504).json({ error: 'Request timeout' });
  }, 30000);

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages
    });
    clearTimeout(timeout);
    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    clearTimeout(timeout);
    res.status(500).json({ error: error.message });
  }
});
```

---

## Frontend Issues 🎨

### Issue 13: ChatBot Component Not Rendering
```
Cannot find module './LandChatbot'
Module not found error
```

**Solutions:**
```typescript
// Verify file path
// In page: src/app/pages/BuyerLandView.tsx
// Should import from: ../components/LandChatbot

// Correct import:
import LandChatbot from '../components/LandChatbot';

// Check file exists at:
// src/app/components/LandChatbot.tsx

// Not at:
// src/components/LandChatbot.tsx (wrong)
// src/LandChatbot.tsx (wrong)
```

---

### Issue 14: Props Not Passed Correctly
```
TypeError: Cannot read property 'landId' of undefined
```

**Solutions:**
```typescript
// Verify LandChatbot receives land prop
<LandChatbot 
  land={land}          // ← Must be passed
  onMessage={handler}  // ← Optional
/>

// In component, add prop validation
interface LandChatbotProps {
  land: LandData;
  onMessage?: (message: string) => void;
}

export default function LandChatbot({ land, onMessage }: LandChatbotProps) {
  if (!land) return <div>Loading...</div>;  // ← Safety check
  // ...
}
```

---

### Issue 15: API Call Fails from Frontend
```
Failed to fetch: /api/chat
CORS policy error
```

**Solutions:**
```typescript
// Use full URL instead of relative
// Wrong:
fetch('/api/chat')

// Correct:
const API_URL = process.env.VITE_API_URL || 'http://localhost:5000';
fetch(`${API_URL}/api/chat`)

// In .env:
VITE_API_URL=http://localhost:5000
```

---

## File Upload Issues 📤

### Issue 16: File Upload Fails
```
Error: File too large
413 Payload Too Large
```

**Solutions:**
```javascript
// Increase body size limit in server.js
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Validate file size in endpoint
if (req.file.size > 10 * 1024 * 1024) { // 10MB
  return res.status(400).json({ error: 'File too large' });
}
```

---

### Issue 17: S3 Upload Error
```
Error: NoSuchBucket
The specified bucket does not exist
```

**Solutions:**
```bash
# Verify bucket exists in AWS console
# Check bucket name in .env
S3_BUCKET_NAME=correct-bucket-name

# Verify permissions
# In AWS IAM, user should have s3:PutObject permission

# Check AWS credentials
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_REGION=us-east-1
```

---

## Performance Issues ⚡

### Issue 18: Slow API Response
```
Request takes 30+ seconds
Response very slow
```

**Solutions:**

1. **Check database query:**
```javascript
// Add index to frequently searched fields
db.lands.createIndex({ landId: 1 });
db.lands.createIndex({ "location.city": 1 });

// Use projection to limit fields
const land = await Land.findOne({ landId })
  .select('owner property location -document') // Exclude heavy fields
```

2. **Cache responses:**
```javascript
const cache = new Map();

router.get('/lands/:landId', async (req, res) => {
  const cacheKey = `land-${req.params.landId}`;
  
  if (cache.has(cacheKey)) {
    return res.json({ land: cache.get(cacheKey), cached: true });
  }
  
  const land = await Land.findOne({ landId: req.params.landId });
  cache.set(cacheKey, land);
  
  res.json({ land });
});
```

3. **Monitor OpenAI calls:**
```javascript
console.time('openai-call');
const response = await openai.chat.completions.create({ ... });
console.timeEnd('openai-call');
```

---

### Issue 19: High Memory Usage
```
JavaScript heap out of memory
Fatal error: CALL_AND_RETRY_LAST Allocation failed
```

**Solutions:**
```javascript
// Pagination for large result sets
router.get('/lands', async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 10, 100);
  const skip = parseInt(req.query.skip) || 0;
  
  const lands = await Land.find()
    .limit(limit)
    .skip(skip)
    .lean(); // Convert to plain JS objects
});

// Stream large files instead of loading all at once
app.get('/exports/lands', (req, res) => {
  const stream = Land.find().lean().stream();
  
  stream.on('data', (doc) => {
    res.write(JSON.stringify(doc) + '\n');
  });
  
  stream.on('end', () => res.end());
});

// Increase Node.js heap size
# Run with: 
node --max-old-space-size=4096 server.js
```

---

## Testing & Validation Issues 🧪

### Issue 20: Tests Failing
```
FAIL src/tests/api.test.js
● Test suite failed to run
Cannot find module './server'
```

**Solutions:**
```javascript
// setup-tests.js
import mongoose from 'mongoose';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_TEST_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

// In test file
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../server';

describe('Land API', () => {
  it('should upload a land', async () => {
    const response = await request(app)
      .post('/api/lands/upload')
      .send({
        owner: { name: 'Test' },
        property: { area: 5 }
      });
    
    expect(response.status).toBe(201);
    expect(response.body.landId).toBeDefined();
  });
});
```

---

## Deployment Issues 🚀

### Issue 21: Build Fails
```
npm ERR! code ERESOLVE
unable to resolve dependency tree
```

**Solutions:**
```bash
# Force installation
npm install --legacy-peer-deps

# Or update packages
npm update

# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

### Issue 22: Environment Variables Not Working
```
Error: Cannot read property 'MONGODB_URI' of undefined
```

**Solutions:**
```bash
# Verify .env file exists
ls -la .env

# Verify variables are set
echo $MONGODB_URI

# If using Heroku
heroku config:set MONGODB_URI=mongodb+srv://...

# Verify in build logs
heroku logs --tail
```

---

## Quick Diagnostic Checklist ✅

When something breaks, go through this order:

1. **Server running?**
   ```bash
   curl http://localhost:5000/health
   ```

2. **Database connected?**
   ```bash
   # Check server logs for "MongoDB connected"
   ```

3. **Environment variables set?**
   ```bash
   echo $MONGODB_URI
   echo $OPENAI_API_KEY
   ```

4. **API endpoint exists?**
   ```bash
   curl http://localhost:5000/api/lands/123
   ```

5. **Frontend can reach API?**
   ```javascript
   fetch('http://localhost:5000/health')
     .then(r => r.json())
     .then(console.log)
   ```

6. **OpenAI API working?**
   ```bash
   # Test with curl
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer $OPENAI_API_KEY"
   ```

---

## Getting Help 📞

1. **Check logs:**
   ```bash
   # Server stderr/stdout
   npm start  # Run in foreground to see logs
   
   # Frontend browser console
   F12 → Console tab
   ```

2. **Enable debug mode:**
   ```javascript
   // At top of server.js
   const debug = require('debug')('app:*');
   app.use(debug);
   ```

3. **Use Postman:**
   - Test endpoints without frontend
   - Save request collections
   - Share requests with team

4. **Common fixes:**
   - Restart server
   - Clear browser cache (Ctrl+Shift+Del)
   - Restart database
   - Check .env file again

---

**Still stuck?** 
Check the relevant guide files:
- Implementation details → `IMPLEMENTATION_GUIDE.md`
- API specs → `API_ENDPOINTS.md`
- Database schema → `MONGODB_SCHEMA.md`
- System flow → `SYSTEM_WORKFLOW.md`
- Quick start → `QUICK_START.md`

Good luck debugging! 🚀
