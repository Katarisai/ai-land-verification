# OpenAI Chatbot Setup Guide

Your chatbot has been successfully updated to use **OpenAI's GPT models** instead of Google Gemini!

## 🚀 Quick Setup

### 1. Get Your OpenAI API Key
- Go to [OpenAI Platform](https://platform.openai.com/api-keys)
- Sign in or create an account
- Click "Create new secret key"
- Copy the key (it starts with `sk-`)

### 2. Update `.env` File
Create or update the `server/.env` file with:

```env
OPENAI_API_KEY=sk-your-api-key-here
PORT=5000
```

Replace `sk-your-api-key-here` with your actual API key.

### 3. Start the Server

```bash
cd server
npm start
```

The server will start on `http://localhost:5000` (or the next available port).

## 📋 What Changed

| Feature | Google Gemini | OpenAI |
|---------|---------------|--------|
| **Model** | Gemini 2.5 Flash | GPT-4o Mini |
| **API Key** | GOOGLE_API_KEY | OPENAI_API_KEY |
| **Package** | Native Fetch | openai SDK |
| **Features** | ✅ Conversational, Safety Filters | ✅ Conversational, Moderation |

## 🔧 API Model Options

The current setup uses **gpt-4o-mini** (fast & cost-effective). Other options:

- `gpt-4o` - Latest powerful model
- `gpt-4` - Previous generation
- `gpt-3.5-turbo` - Faster & cheaper

To change, edit `server/chatbot.js` line ~46:
```javascript
model: "gpt-4o-mini",  // ← Change this
```

## 📊 Available Endpoints

- **Health Check**: `GET /api/health`
- **Chat**: `POST /api/chat`

### Chat Request Format
```json
{
  "message": "What is this land suitable for?",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Tell me about land verification"
    },
    {
      "role": "assistant",
      "content": "Land verification is the process of..."
    }
  ]
}
```

### Chat Response Format
```json
{
  "reply": "The response text here...",
  "usage": {
    "prompt_tokens": 123,
    "completion_tokens": 456,
    "total_tokens": 579
  }
}
```

## 🐛 Troubleshooting

### "OPENAI_API_KEY is missing"
- Check that `server/.env` exists
- Verify the API key starts with `sk-`
- Restart the server after adding the key

### "Authentication failed"
- Your API key is invalid or expired
- Generate a new key from OpenAI Platform
- Check for extra spaces/quotes in `.env`

### "Rate limited"
- You've hit OpenAI's rate limits
- Wait a moment and try again
- Check your usage at OpenAI Platform

### "Empty response"
- The request exceeded max tokens (800)
- Try asking shorter questions
- Or increase `max_tokens` in chatbot.js

## 💰 Pricing

OpenAI is pay-as-you-go:
- **gpt-4o-mini**: ~$0.00015 per 1K input tokens, ~$0.0006 per 1K output tokens
- Check [OpenAI Pricing](https://openai.com/pricing) for current rates

## ✅ Next Steps

1. Add OPENAI_API_KEY to server/.env
2. Run `npm start` to test
3. Send a message to `POST /api/chat`
4. Verify the AI responds correctly

---

**Need help?** Check the [OpenAI Documentation](https://platform.openai.com/docs)
