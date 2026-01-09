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
const OPENAI_API_KEY = process.env.OPENAI_API_KEY?.trim();
console.log(`🔑 API Key status: ${OPENAI_API_KEY ? '✅ Loaded' : '❌ Missing'}`);
if (!OPENAI_API_KEY || OPENAI_API_KEY === "YOUR_OPENAI_API_KEY" || OPENAI_API_KEY.length < 20) {
  console.error("❌ FATAL: OPENAI_API_KEY is missing, invalid, or not configured in .env");
  console.error(`   Current value: ${OPENAI_API_KEY ? `"${OPENAI_API_KEY.substring(0, 10)}..."` : "undefined"}`);
  console.error("   Fix: Add OPENAI_API_KEY=sk-proj-... to server/.env");
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

    // Build message array
    const messages = [
      { role: "system", content: systemPrompt },
      ...(Array.isArray(conversationHistory) ? conversationHistory : []),
      { role: "user", content: message.trim() }
    ];

    console.log(`🔄 Calling OpenAI API with ${messages.length} messages...`);

    // ✅ Call OpenAI API
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
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
    });

    const data = await response.json();

    // ✅ Check response status BEFORE processing
    if (!response.ok) {
      console.error("❌ OpenAI API returned error:");
      console.error(`   Status: ${response.status} ${response.statusText}`);
      console.error(`   Error: ${JSON.stringify(data, null, 2)}`);

      // Handle specific OpenAI errors
      if (data.error?.type === "invalid_request_error") {
        return res.status(400).json({
          error: `Invalid request: ${data.error.message}`,
        });
      }
      if (data.error?.type === "authentication_error") {
        console.error("   💡 Hint: Check your OPENAI_API_KEY in server/.env");
        return res.status(401).json({
          error: "Authentication failed. Invalid API key.",
        });
      }
      if (data.error?.type === "rate_limit_error") {
        return res.status(429).json({
          error: "Rate limited by OpenAI. Please try again in a moment.",
        });
      }
      if (data.error?.type === "server_error") {
        return res.status(503).json({
          error: "OpenAI service temporarily unavailable. Try again soon.",
        });
      }

      throw new Error(`OpenAI API error (${response.status}): ${data.error?.message || "Unknown"}`);
    }

    // ✅ Validate response structure
    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      console.error("❌ Invalid OpenAI response structure:", data);
      throw new Error("OpenAI returned invalid response structure");
    }

    const reply = data.choices[0]?.message?.content;
    if (!reply) {
      console.error("❌ No message content in response:", data.choices[0]);
      throw new Error("OpenAI returned empty response");
    }

    console.log(`✅ OpenAI response received: "${reply.substring(0, 50)}..."`);
    console.log(`   Tokens used - Input: ${data.usage?.prompt_tokens || 0}, Output: ${data.usage?.completion_tokens || 0}`);

    res.json({
      reply: reply,
      usage: data.usage || {},
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
