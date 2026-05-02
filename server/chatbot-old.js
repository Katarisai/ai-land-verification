import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = path.resolve(__dirname, '.env');
console.log(`📂 Loading .env from: ${envPath}`);
const envConfig = dotenv.config({ path: envPath });

if (envConfig.error && envConfig.error.code !== 'ENOENT') {
  console.warn('⚠️  .env error (non-fatal):', envConfig.error.message);
}

// ✅ Validate environment
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY?.trim();
console.log(`🔑 API Key status: ${GOOGLE_API_KEY ? '✅ Loaded' : '❌ Missing'}`);
if (!GOOGLE_API_KEY || GOOGLE_API_KEY === "YOUR_GOOGLE_API_KEY" || GOOGLE_API_KEY.length < 20) {
  console.error("❌ FATAL: GOOGLE_API_KEY is missing, invalid, or not configured in .env");
  console.error(`   Current value: ${GOOGLE_API_KEY ? `"${GOOGLE_API_KEY.substring(0, 10)}..."` : "undefined"}`);
  console.error("   Fix: Add GOOGLE_API_KEY=AIza... to server/.env");
  console.error("   Get free API key at: https://makersuite.google.com/app/apikey");
  process.exit(1);
}

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 5000;
console.log(`🔌 Target port: ${DEFAULT_PORT}`);

// ✅ Initialize Express app
const app = express();

// ✅ Middleware with detailed logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "*"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// ✅ Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString(), port: DEFAULT_PORT });
});

// ✅ Main chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    // Validate input
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      console.warn("⚠️  Empty message received");
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    console.log(`📨 Received message: "${message.substring(0, 50)}..."`);
    console.log(`📋 History length: ${conversationHistory?.length || 0} messages`);

    const systemPrompt = `You are an AI Land Survey Assistant for CM Platform.
You help users understand:
- Land ownership and verification
- Survey numbers and boundaries
- Property documentation requirements
- Construction feasibility assessment
- Legal requirements and compliance
- Risk analysis and recommendations
- Historical property analysis

Provide clear, professional responses in simple language.
Focus on land verification and construction management topics.`;

    // Build message array for Gemini format
    // Gemini doesn't support system messages in the same way, so we prepend it to the first user message
    const userMessage = systemPrompt + "\n\nUser question: " + message.trim();
    
    const contents = [];
    
    // Add conversation history if present
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      conversationHistory.forEach(msg => {
        contents.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }]
        });
      });
    }
    
    // Add current message
    contents.push({
      role: "user",
      parts: [{ text: userMessage }]
    });

    console.log(`🔄 Calling Google Gemini API with ${contents.length} messages...`);
    console.log(`📋 First message preview: ${contents[0].parts[0].text.substring(0, 100)}...`);

    // ✅ Call Google Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
            topP: 1,
            topK: 40,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ],
        }),
      }
    );

    const data = await response.json();

    // ✅ Check response status BEFORE processing
    if (!response.ok) {
      console.error("❌ Google Gemini API returned error:");
      console.error(`   Status: ${response.status} ${response.statusText}`);
      console.error(`   Full response: ${JSON.stringify(data, null, 2)}`);

      // Extract actual error message from Gemini
      const errorMessage = data.error?.message || data.message || "Unknown error";
      
      // Handle specific Gemini errors
      if (response.status === 400) {
        return res.status(400).json({
          error: `Invalid request: ${errorMessage}`,
        });
      }
      if (response.status === 401 || response.status === 403) {
        console.error("   💡 Hint: Check your GOOGLE_API_KEY in server/.env");
        return res.status(401).json({
          error: `Authentication failed: ${errorMessage}`,
        });
      }
      if (response.status === 429) {
        return res.status(429).json({
          error: "Rate limited by Google Gemini. Please try again in a moment.",
        });
      }
      if (response.status >= 500) {
        return res.status(503).json({
          error: `Google Gemini service error: ${errorMessage}`,
        });
      }

      return res.status(response.status).json({
        error: `Gemini API error: ${errorMessage}`,
      });
    }

    // ✅ Validate Gemini response structure
    if (!data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0) {
      console.error("❌ No candidates in Gemini response:", JSON.stringify(data, null, 2));
      
      // Check if it was blocked by safety filters
      if (data.promptFeedback?.blockReason) {
        return res.status(400).json({
          error: `Content was blocked: ${data.promptFeedback.blockReason}. Please rephrase your question.`,
        });
      }
      
      return res.status(500).json({
        error: "Google Gemini returned no response. Please try again.",
      });
    }

    const reply = data.candidates[0]?.content?.parts?.[0]?.text;
    if (!reply) {
      console.error("❌ No message content in response:", JSON.stringify(data.candidates[0], null, 2));
      
      // Check finish reason
      const finishReason = data.candidates[0]?.finishReason;
      if (finishReason === "SAFETY") {
        return res.status(400).json({
          error: "Response was blocked by safety filters. Please rephrase your question.",
        });
      }
      
      return res.status(500).json({
        error: `Google Gemini returned empty response (reason: ${finishReason || "unknown"})`,
      });
    }

    console.log(`✅ Google Gemini response received: "${reply.substring(0, 50)}..."`);
    const tokenCount = data.usageMetadata;
    if (tokenCount) {
      console.log(`   Tokens used - Input: ${tokenCount.promptTokenCount || 0}, Output: ${tokenCount.candidatesTokenCount || 0}`);
    }

    res.json({
      reply: reply,
      usage: tokenCount ? {
        prompt_tokens: tokenCount.promptTokenCount,
        completion_tokens: tokenCount.candidatesTokenCount,
        total_tokens: tokenCount.totalTokenCount,
      } : {},
    });
  } catch (error) {
    console.error("❌ Server error:", error.message);
    console.error(`   Stack: ${error.stack}`);

    res.status(500).json({
      error: "Failed to get AI response. Please check server logs.",
      message: error.message,
    });
  }
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found", path: req.path });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err);
  res.status(500).json({ error: "Internal server error", message: err.message });
});

// ✅ Start server with port fallback
function startServer(port, attempt = 0) {
  console.log(`\n🚀 Attempting to start server on port ${port}...`);
  
  const server = app.listen(port, "0.0.0.0", () => {
    console.log("\n✅ ========================================");
    console.log(`✅ AI Chatbot Server READY on port ${port}`);
    console.log("✅ Listening at: http://localhost:" + port);
    console.log("✅ ========================================\n");
    console.log("📡 Available endpoints:");
    console.log(`   GET  http://localhost:${port}/api/health`);
    console.log(`   POST http://localhost:${port}/api/chat`);
    console.log("\n");
  }).on("error", (err) => {
    console.error(`❌ Server error on port ${port}:`, err.code, err.message);
    
    if (err.code === "EADDRINUSE") {
      if (attempt < 10) {
        const nextPort = port + 1;
        console.warn(`⚠️  Port ${port} in use, trying port ${nextPort}...`);
        server.close();
        startServer(nextPort, attempt + 1);
      } else {
        console.error("❌ All ports exhausted (tried 10 ports)");
        process.exit(1);
      }
    } else if (err.code === "EACCES") {
      console.error(`❌ Permission denied on port ${port}. Try a port >= 1024.`);
      process.exit(1);
    } else {
      console.error("❌ Server startup failed:", err);
      process.exit(1);
    }
  });
}

// Handle uncaught errors
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught exception:", error);
  process.exit(1);
});

console.log("\n🎯 Starting AI Chatbot Server...\n");
startServer(DEFAULT_PORT);
