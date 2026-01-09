import os
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
import openai

# Load environment variables from a local .env file if present
load_dotenv()

# Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "").strip()
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "").strip() or None
SERVER_PORT = int(os.getenv("AI_SERVER_PORT", os.getenv("PORT", "5000")))

if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY is required. Set it in backend/python_ai_assistant/.env or environment.")

# Initialize OpenAI client
client_kwargs = {"api_key": OPENAI_API_KEY}
if OPENAI_BASE_URL:
    client_kwargs["base_url"] = OPENAI_BASE_URL
client = openai.OpenAI(**client_kwargs)

app = FastAPI(title="AI Assistant Backend (Python)", version="1.0.0")

# CORS: allow local dev frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:3000",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class HistoryMessage(BaseModel):
    role: str = Field(..., pattern="^(user|assistant|system)$")
    content: str

    @validator("content")
    def content_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("content cannot be empty")
        return v


class ChatRequest(BaseModel):
    message: str
    conversationHistory: Optional[List[HistoryMessage]] = Field(default_factory=list)

    @validator("message")
    def message_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("message cannot be empty")
        return v


class ChatResponse(BaseModel):
    reply: str
    usage: Optional[dict] = None


SYSTEM_PROMPT = (
    "You are an AI Land Survey Assistant for CM Platform.\n"
    "Help with land verification, documentation, construction feasibility, compliance, and risk analysis.\n"
    "Be concise, professional, and clear."
)


@app.get("/api/health")
def health():
    return {
        "status": "OK",
        "port": SERVER_PORT,
        "openai_base_url": OPENAI_BASE_URL or "https://api.openai.com",
    }


@app.post("/api/chat", response_model=ChatResponse)
def chat(body: ChatRequest):
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        *[m.dict() for m in body.conversationHistory or []],
        {"role": "user", "content": body.message.strip()},
    ]

    try:
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.7,
            max_tokens=500,
        )
    except Exception as exc:  # pragma: no cover
        raise HTTPException(status_code=500, detail=str(exc))

    choice = completion.choices[0]
    reply = choice.message.content if choice and choice.message else ""
    if not reply:
        raise HTTPException(status_code=500, detail="Empty response from model")

    return ChatResponse(reply=reply, usage=completion.usage.model_dump() if completion.usage else {})


# To run locally: `uvicorn main:app --host 0.0.0.0 --port 5000 --reload`
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=SERVER_PORT, reload=True)
