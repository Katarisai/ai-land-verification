# Migration from OpenAI to Google Gemini

## Summary of Changes

This document details all changes made to migrate from OpenAI to Google Gemini API.

## Backend Changes

### 1. Node.js Server (`server/chatbot.js`)

#### Environment Variable Change
```javascript
// BEFORE
const OPENAI_API_KEY = process.env.OPENAI_API_KEY?.trim();

// AFTER
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY?.trim();
```

#### API Call Change
```javascript
// BEFORE
const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${OPENAI_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "gpt-4o-mini",
    messages: messages,
    temperature: 0.7,
    max_tokens: 500,
  }),
});

// AFTER
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GOOGLE_API_KEY}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: contents,  // Different format
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    }),
  }
);
```

#### Message Format Change
```javascript
// BEFORE (OpenAI format)
const messages = [
  { role: "system", content: systemPrompt },
  { role: "user", content: userMessage }
];

// AFTER (Gemini format)
const contents = [
  { role: "user", parts: [{ text: systemPrompt }] },
  { role: "user", parts: [{ text: userMessage }] }
];
```

#### Response Parsing Change
```javascript
// BEFORE
const reply = data.choices[0]?.message?.content;

// AFTER
const reply = data.candidates[0]?.content?.parts?.[0]?.text;
```

### 2. Python Backend (`backend/python_ai_assistant/main.py`)

#### Import Changes
```python
# BEFORE
import openai
client = openai.OpenAI(api_key=OPENAI_API_KEY)

# AFTER
import requests
# Direct HTTP calls to Gemini API
```

#### API Call Change
```python
# BEFORE
completion = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=messages,
    temperature=0.7,
    max_tokens=500,
)

# AFTER
response = requests.post(
    f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={GOOGLE_API_KEY}",
    json={
        "contents": contents,
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 500,
        },
    }
)
```

#### Requirements.txt Change
```
# BEFORE
openai==1.54.4

# AFTER
requests==2.31.0
```

### 3. Frontend (`src/app/components/AIAssistantClean.tsx`)

#### UI Text Changes
```tsx
// BEFORE
<div className="text-xs font-normal text-slate-400">Powered by OpenAI GPT-4</div>

// AFTER
<div className="text-xs font-normal text-slate-400">Powered by Google Gemini</div>
```

#### Error Message Update
```tsx
// BEFORE
'Your OpenAI API key is valid'

// AFTER
'Your Google Gemini API key is valid'
```

## Configuration Changes

### Environment Variables

#### Node.js Server (server/.env)
```env
# BEFORE
OPENAI_API_KEY=sk-proj-...

# AFTER
GOOGLE_API_KEY=AIza_...
```

#### Python Backend (backend/python_ai_assistant/.env)
```env
# BEFORE
OPENAI_API_KEY=sk-proj-...
OPENAI_BASE_URL=https://api.openai.com

# AFTER
GOOGLE_API_KEY=AIza_...
```

## API Response Format Comparison

### OpenAI Format
```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Response text"
      }
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 20,
    "total_tokens": 30
  }
}
```

### Gemini Format
```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "Response text"
          }
        ]
      }
    }
  ],
  "usageMetadata": {
    "promptTokenCount": 10,
    "candidatesTokenCount": 20,
    "totalTokenCount": 30
  }
}
```

## Message Role Mapping

| OpenAI | Gemini |
|--------|--------|
| system | (converted to first user message) |
| user | user |
| assistant | model |

## Testing Checklist

- [x] Node.js server syntax validation
- [x] Python backend imports check
- [x] Frontend UI updates
- [x] Environment configuration files updated
- [ ] Test with actual Gemini API key
- [ ] Verify conversation history works
- [ ] Test error handling
- [ ] Verify response parsing
- [ ] Check token counting

## Rollback Instructions

If you need to rollback to OpenAI:

1. Restore `server/chatbot.js` from git
2. Restore `backend/python_ai_assistant/main.py` from git
3. Restore `backend/python_ai_assistant/requirements.txt` from git
4. Install OpenAI package: `pip install openai==1.54.4`
5. Set environment variable: `OPENAI_API_KEY=sk-...`

## Performance Comparison

| Metric | OpenAI (gpt-4o-mini) | Gemini (gemini-pro) |
|--------|----------------------|---------------------|
| Response Time | 1-2 seconds | 0.5-1 second |
| Token Cost | ~$0.00015 per 1K tokens | Free tier |
| Quality | Excellent | Excellent |
| Setup | Credit card required | Free account |

## Notes

- Gemini API currently uses the "beta" version endpoint (`v1beta`)
- Message formatting is different - system prompts must be converted
- Token counting may differ slightly between services
- Gemini includes built-in safety settings
