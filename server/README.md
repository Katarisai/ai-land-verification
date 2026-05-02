# AI Chatbot Server

Google Gemini-powered chatbot backend for CM Platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file and add your Google Gemini API key:
```
GOOGLE_API_KEY=your_google_gemini_api_key_here
PORT=5000
```

**How to get a free Google Gemini API key:**
- Visit: https://makersuite.google.com/app/apikey
- Sign in with your Google account
- Click "Create API key"
- Copy the key and add it to `.env`

3. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will run on http://localhost:5000

## API Endpoint

POST `/api/chat`

Request body:
```json
{
  "message": "What documents do I need?",
  "conversationHistory": [
    { "role": "user", "content": "previous message" },
    { "role": "assistant", "content": "previous response" }
  ]
}
```

Response:
```json
{
  "reply": "AI response here...",
  "usage": {
    "prompt_tokens": 100,
    "completion_tokens": 50,
    "total_tokens": 150
  }
}
```

## Why Google Gemini?

- ✅ **Free API** - Generous free tier for development
- ✅ **No Credit Card** - Get started immediately
- ✅ **Fast** - Quick response times
- ✅ **Reliable** - Production-ready quality
- ✅ **Open Source** - No vendor lock-in
