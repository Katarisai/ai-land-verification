# Google Gemini API Setup Guide

This project has been successfully updated to use **Google Gemini API** instead of OpenAI! 🎉

## Why Google Gemini?

✅ **Free API** - Generous free tier, no credit card required
✅ **Fast** - Quick response times  
✅ **Reliable** - Production-ready quality
✅ **Simple** - Easy to set up and use
✅ **No Vendor Lock-in** - Open and flexible

## Quick Start (5 minutes)

### Step 1: Get Your Free API Key

1. Visit: **https://makersuite.google.com/app/apikey**
2. Sign in with your Google account (create one if needed - it's free!)
3. Click **"Create API key"** button
4. Copy your new API key

### Step 2: Set Up Environment Variables

#### For Node.js Server:
```bash
cd server
echo "GOOGLE_API_KEY=AIza_YOUR_KEY_HERE" > .env
echo "PORT=5000" >> .env
```

Replace `AIza_YOUR_KEY_HERE` with your actual key from Step 1.

#### For Python Backend:
```bash
cd backend/python_ai_assistant
echo "GOOGLE_API_KEY=AIza_YOUR_KEY_HERE" > .env
echo "AI_SERVER_PORT=5000" >> .env
```

### Step 3: Install Dependencies

#### Node.js Server:
```bash
cd server
npm install
npm start
```

#### Python Backend:
```bash
cd backend/python_ai_assistant
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 5000 --reload
```

### Step 4: Start Frontend
```bash
npm run dev
```

## Files Modified

### ✅ Node.js Server
- **File**: `server/chatbot.js`
- **Changes**: 
  - Replaced OpenAI API calls with Google Gemini API
  - Updated error handling for Gemini responses
  - Changed environment variable: `OPENAI_API_KEY` → `GOOGLE_API_KEY`

### ✅ Python Backend
- **File**: `backend/python_ai_assistant/main.py`
- **Changes**:
  - Replaced OpenAI client with HTTP requests to Gemini API
  - Updated message formatting for Gemini
  - Changed environment variable: `OPENAI_API_KEY` → `GOOGLE_API_KEY`

- **File**: `backend/python_ai_assistant/requirements.txt`
- **Changes**: 
  - Removed `openai==1.54.4`
  - Added `requests==2.31.0`

### ✅ Frontend
- **File**: `src/app/components/AIAssistantClean.tsx`
- **Changes**:
  - Updated error messages to reference Gemini
  - Changed UI text: "Powered by OpenAI GPT-4" → "Powered by Google Gemini"

### ✅ Configuration Files
- **File**: `server/.env.example` - Updated with Gemini setup
- **File**: `server/README.md` - Updated with Gemini instructions
- **File**: `backend/python_ai_assistant/README.md` - Updated with Gemini instructions

## API Keys Comparison

| Feature | OpenAI | Google Gemini |
|---------|--------|---------------|
| **Cost** | Paid (starts $0.01) | Free tier available |
| **Setup** | Requires credit card | No credit card needed |
| **Ease** | Moderate | Very Easy |
| **Speed** | Standard | Very Fast |
| **Quality** | Excellent | Excellent |

## Testing Your Setup

### Test Node.js Server:
```bash
cd server
npm start
# In another terminal:
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What is land verification?","conversationHistory":[]}'
```

### Test Python Backend:
```bash
cd backend/python_ai_assistant
uvicorn main:app --host 0.0.0.0 --port 5000
# In another terminal:
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What is land verification?","conversationHistory":[]}'
```

## Troubleshooting

### Issue: "GOOGLE_API_KEY is missing"
**Solution**: 
1. Make sure you created the `.env` file in the correct directory
2. Verify the key starts with `AIza_`
3. Check there are no extra spaces or quotes around the key

### Issue: "Invalid API key"
**Solution**:
1. Go to https://makersuite.google.com/app/apikey
2. Delete the old key and create a new one
3. Update your `.env` file with the new key

### Issue: "Rate limited"
**Solution**: Google Gemini has a free tier rate limit. Wait a few minutes and try again. For production, you can enable billing in Google Cloud Console.

### Issue: Empty responses from AI
**Solution**:
1. Check your internet connection
2. Verify the API key is correct
3. Check server logs for errors
4. Try restarting the server

## Free Tier Limits

- **Requests per minute**: 60
- **Requests per day**: Unlimited
- **Tokens per minute**: 4,000
- **Model**: gemini-pro

Perfect for development and testing! Upgrade to paid plan if you need higher limits.

## Next Steps

1. ✅ Set up your Gemini API key
2. ✅ Start the Node.js or Python server
3. ✅ Start the frontend
4. ✅ Test the AI Assistant in your app
5. ✅ Deploy with confidence!

## Need Help?

- **Gemini Documentation**: https://ai.google.dev/
- **API Reference**: https://ai.google.dev/api
- **Pricing**: https://ai.google.dev/pricing

---

Happy building! 🚀
