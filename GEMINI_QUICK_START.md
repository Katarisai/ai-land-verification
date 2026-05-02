# 🚀 Google Gemini - Quick Start Guide

## ⚡ Get Started in 3 Steps

### Step 1: Get Free API Key (2 minutes)
🔗 **https://makersuite.google.com/app/apikey**
- Sign in with Google
- Click "Create API key"
- Copy the key (starts with `AIza_`)

### Step 2: Run Setup Script (30 seconds)

**Windows:**
```powershell
.\setup-gemini.ps1 -ApiKey "AIza_YOUR_KEY_HERE"
```

**Mac/Linux:**
```bash
chmod +x setup-gemini.sh
./setup-gemini.sh AIza_YOUR_KEY_HERE
```

### Step 3: Start Server & Frontend (1 minute)

**Node.js Server:**
```bash
cd server
npm install
npm start
```

**Or Python Backend:**
```bash
cd backend/python_ai_assistant
pip install -r requirements.txt
uvicorn main:app --port 5000 --reload
```

**Frontend:**
```bash
npm run dev
```

✅ Done! Open http://localhost:5173

---

## 📋 Manual Setup

### Create Environment Files

**server/.env:**
```env
GOOGLE_API_KEY=AIza_your_key_here
PORT=5000
```

**backend/python_ai_assistant/.env:**
```env
GOOGLE_API_KEY=AIza_your_key_here
AI_SERVER_PORT=5000
```

---

## 🧪 Test Your Setup

```bash
# Health check
curl http://localhost:5000/api/health

# Test chat
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What documents do I need?","conversationHistory":[]}'
```

---

## 🎁 Free Tier Benefits

| Feature | Limit |
|---------|-------|
| Requests/minute | 60 |
| Requests/day | Unlimited |
| Tokens/minute | 4,000 |
| Cost | **FREE** 💯 |

---

## 🔧 Common Issues

| Problem | Solution |
|---------|----------|
| "Invalid API key" | Check key starts with `AIza_` |
| "Port already in use" | Change PORT in `.env` to 5001 |
| "Module not found" | Run `npm install` or `pip install -r requirements.txt` |
| No AI response | Check server logs, restart server |

---

## 📚 Full Documentation

- **Setup Guide**: [GEMINI_SETUP_GUIDE.md](GEMINI_SETUP_GUIDE.md)
- **Migration Details**: [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)
- **Implementation**: [GEMINI_IMPLEMENTATION_COMPLETE.md](GEMINI_IMPLEMENTATION_COMPLETE.md)

---

## 💡 What Was Changed?

✅ Node.js server (`server/chatbot.js`)
✅ Python backend (`backend/python_ai_assistant/main.py`)
✅ Frontend UI (`src/app/components/AIAssistantClean.tsx`)
✅ Environment configs (`.env.example` files)
✅ Documentation (all README files)

---

**Need help?** Check the guides or visit https://ai.google.dev/
