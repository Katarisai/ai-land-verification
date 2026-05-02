import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import OpenAI from "openai";

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
  console.error("   Fix: Add OPENAI_API_KEY=sk-... to server/.env");
  console.error("   Get API key at: https://platform.openai.com/api-keys");
  process.exit(1);
}

// ✅ Initialize OpenAI client
const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const OPENAI_MODEL = process.env.OPENAI_MODEL?.trim() || 'gpt-4o';

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
    const { message, conversationHistory, landContext } = req.body;

    // Validate input
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      console.warn("⚠️  Empty message received");
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    console.log(`📨 Received message: "${message.substring(0, 50)}..."`);
    console.log(`📋 History length: ${conversationHistory?.length || 0} messages`);

    const systemPrompt = `You are an AI Land Verification Assistant for CM Platform.
  You answer questions about:
  - Land ownership and verification
  - Survey numbers and boundaries
  - Property documentation requirements
  - Construction feasibility assessment
  - Legal requirements and compliance
  - Risk analysis and recommendations
  - Historical property analysis

  Provide clear, professional responses in simple language.
  Focus on land verification and construction management topics.
  If landContext is provided, answer strictly using that context and say when details are not available.`;

    // Build message array for OpenAI format
    const messages = [
      {
        role: "system",
        content: systemPrompt
      }
    ];
    
    // Add conversation history if present
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      conversationHistory.forEach(msg => {
        messages.push({
          role: msg.role === "assistant" ? "assistant" : "user",
          content: msg.content
        });
      });
    }

    if (typeof landContext === 'string' && landContext.trim()) {
      messages.push({
        role: "system",
        content: `LAND CONTEXT:\n${landContext.trim()}`
      });
    }
    
    // Add current message
    messages.push({
      role: "user",
      content: message.trim()
    });

    console.log(`🔄 Calling OpenAI API with ${messages.length} messages...`);
    console.log(`📋 Last user message: "${message.substring(0, 80)}..."`);

    // ✅ Call OpenAI Chat API
    const response = await client.chat.completions.create({
      model: OPENAI_MODEL,
      messages: messages,
      temperature: 0.7,
      max_tokens: 800,
      top_p: 0.95
    });

    const reply = response.choices[0]?.message?.content;
    
    if (!reply) {
      console.error("❌ No message content in response:", JSON.stringify(response.choices[0], null, 2));
      return res.status(500).json({
        error: "OpenAI returned empty response"
      });
    }

    console.log(`✅ OpenAI response received: "${reply.substring(0, 50)}..."`);
    const tokenUsage = response.usage;
    if (tokenUsage) {
      console.log(`   Tokens used - Input: ${tokenUsage.prompt_tokens || 0}, Output: ${tokenUsage.completion_tokens || 0}`);
    }

    res.json({
      reply: reply,
      usage: tokenUsage ? {
        prompt_tokens: tokenUsage.prompt_tokens,
        completion_tokens: tokenUsage.completion_tokens,
        total_tokens: tokenUsage.total_tokens,
      } : {},
    });
  } catch (error) {
    console.error("❌ Server error:", error.message);
    console.error(`   Stack: ${error.stack}`);

    // Handle OpenAI specific errors
    if (error.status === 401) {
      return res.status(401).json({
        error: "Authentication failed. Check your OPENAI_API_KEY.",
        message: error.message,
      });
    }
    if (error.status === 429) {
      return res.status(429).json({
        error: "Rate limited by OpenAI. Please try again in a moment.",
      });
    }

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
    console.log("✅ Listening at: http://0.0.0.0:" + port);
    console.log("✅ Access at: http://127.0.0.1:" + port);
    console.log("✅ ========================================\n");
    console.log("📡 Available endpoints:");
    console.log(`   GET  http://127.0.0.1:${port}/api/health`);
    console.log(`   POST http://127.0.0.1:${port}/api/chat`);
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
