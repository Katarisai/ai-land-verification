# Python AI Assistant Backend

FastAPI service for the AI assistant using OpenAI.

## Setup

1) Install dependencies (use a venv):
```bash
pip install -r requirements.txt
```

2) Create `.env` in this folder:
```
OPENAI_API_KEY=sk-your-key
# Optional
OPENAI_BASE_URL=https://api.openai.com
AI_SERVER_PORT=5000
```

3) Run the server:
```bash
uvicorn main:app --host 0.0.0.0 --port 5000 --reload
```

## Endpoints
- `GET /api/health`
- `POST /api/chat`
  - body: `{ "message": "...", "conversationHistory": [{"role":"user","content":"..."}] }`
  - response: `{ "reply": "...", "usage": { ... } }`

## Frontend
Set `VITE_AI_SERVER_URL=http://localhost:5000` (or your host) so the UI uses this backend.
