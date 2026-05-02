import os
from typing import List, Optional
import requests

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator

# Load environment variables from a local .env file if present
load_dotenv()

# Configuration - Google Gemini API
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "").strip()
SERVER_PORT = int(os.getenv("AI_SERVER_PORT", os.getenv("PORT", "5000")))

if not GOOGLE_API_KEY:
    raise RuntimeError("GOOGLE_API_KEY is required. Set it in backend/python_ai_assistant/.env or environment.\n"
                       "Get free API key at: https://makersuite.google.com/app/apikey")

app = FastAPI(title="AI Assistant Backend (Python) - Google Gemini", version="1.0.0")

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
        "provider": "Google Gemini API",
        "model": "gemini-pro",
    }


@app.post("/api/chat", response_model=ChatResponse)
def chat(body: ChatRequest):
    # Format messages for Gemini API
    system_prompt = SYSTEM_PROMPT
    
    # Convert history to Gemini format
    contents = [
        {"role": "user", "parts": [{"text": system_prompt}]},
    ]
    
    # Add conversation history
    for msg in body.conversationHistory or []:
        role = "model" if msg.role == "assistant" else "user"
        contents.append({
            "role": role,
            "parts": [{"text": msg.content}]
        })
    
    # Add current message
    contents.append({
        "role": "user",
        "parts": [{"text": body.message.strip()}]
    })

    try:
        # Call Google Gemini API
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GOOGLE_API_KEY}"
        payload = {
            "contents": contents,
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 500,
                "topP": 1,
                "topK": 40,
            },
            "safetySettings": [
                {
                    "category": "HARM_CATEGORY_HARASSMENT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_HATE_SPEECH",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                }
            ],
        }
        
        response = requests.post(url, json=payload, timeout=30)
        response.raise_for_status()
        data = response.json()
        
        # Extract reply from Gemini response
        if not data.get("candidates") or len(data["candidates"]) == 0:
            raise HTTPException(status_code=500, detail="No candidates in Gemini response")
        
        reply = data["candidates"][0].get("content", {}).get("parts", [{}])[0].get("text", "")
        if not reply:
            raise HTTPException(status_code=500, detail="Empty response from Gemini")
        
        # Extract usage info
        usage = {}
        if "usageMetadata" in data:
            usage = {
                "prompt_tokens": data["usageMetadata"].get("promptTokenCount", 0),
                "completion_tokens": data["usageMetadata"].get("candidatesTokenCount", 0),
                "total_tokens": data["usageMetadata"].get("totalTokenCount", 0),
            }
        
        return ChatResponse(reply=reply, usage=usage)
        
    except requests.exceptions.RequestException as e:
        if hasattr(e, 'response') and e.response is not None:
            error_detail = f"Gemini API error ({e.response.status_code}): {str(e)}"
        else:
            error_detail = f"Gemini API request failed: {str(e)}"
        raise HTTPException(status_code=500, detail=error_detail)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Error: {str(exc)}")


# To run locally: `uvicorn main:app --host 0.0.0.0 --port 5000 --reload`
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=SERVER_PORT, reload=True)
