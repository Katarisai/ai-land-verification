# Python AI Assistant Backend

FastAPI service for the AI assistant using Google Gemini.

## Setup

1) Install dependencies (use a venv):
```bash
pip install -r requirements.txt
```

2) Create `.env` in this folder:
```
GOOGLE_API_KEY=AIza_your_key_here
AI_SERVER_PORT=5000
```

**How to get a free Google Gemini API key:**
- Visit: https://makersuite.google.com/app/apikey
- Sign in with your Google account
- Click "Create API key"
- Copy the key and add it to `.env`

3) Run the server:
```bash
uvicorn main:app --host 0.0.0.0 --port 5000 --reload
```

## Endpoints
- `GET /api/health` - Health check
- `POST /api/chat` - Chat endpoint
  - body: `{ "message": "...", "conversationHistory": [{"role":"user","content":"..."}] }`
  - response: `{ "reply": "...", "usage": { ... } }`

## Frontend
Set `VITE_AI_SERVER_URL=http://localhost:5000` (or your host) so the UI uses this backend.

## Why Google Gemini?

- ✅ **Free API** - Generous free tier for development
- ✅ **No Credit Card** - Get started immediately
- ✅ **Fast** - Quick response times
- ✅ **Reliable** - Production-ready quality
