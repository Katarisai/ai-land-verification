# AI Chatbot Server

OpenAI-powered chatbot backend for CM Platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file and add your OpenAI API key:
```
OPENAI_API_KEY=your_actual_api_key_here
PORT=5000
```

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
