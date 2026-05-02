#!/bin/bash
# Setup script for Google Gemini API integration

echo "🚀 AI Land Verification Platform - Google Gemini Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if API key is provided
if [ -z "$1" ]; then
    echo "⚠️  Usage: ./setup-gemini.sh YOUR_GOOGLE_API_KEY"
    echo ""
    echo "📍 Get your free API key at: https://makersuite.google.com/app/apikey"
    echo ""
    echo "Example:"
    echo "  ./setup-gemini.sh AIza_1234567890abcdefg"
    exit 1
fi

API_KEY=$1

# Validate API key format
if [[ ! $API_KEY =~ ^AIza_ ]]; then
    echo "❌ Invalid API key format. It should start with 'AIza_'"
    exit 1
fi

echo "✅ API Key validated (starts with AIza_)"
echo ""

# Setup Node.js server
echo "📦 Setting up Node.js server..."
if [ -d "server" ]; then
    cat > server/.env << EOF
GOOGLE_API_KEY=$API_KEY
PORT=5000
EOF
    echo "✅ Created server/.env"
else
    echo "❌ server/ directory not found"
    exit 1
fi

# Setup Python backend
echo "📦 Setting up Python backend..."
if [ -d "backend/python_ai_assistant" ]; then
    cat > backend/python_ai_assistant/.env << EOF
GOOGLE_API_KEY=$API_KEY
AI_SERVER_PORT=5000
EOF
    echo "✅ Created backend/python_ai_assistant/.env"
else
    echo "❌ backend/python_ai_assistant/ directory not found"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo ""
echo "1️⃣  Start Node.js server:"
echo "   cd server && npm install && npm start"
echo ""
echo "2️⃣  Or start Python backend:"
echo "   cd backend/python_ai_assistant && pip install -r requirements.txt"
echo "   uvicorn main:app --host 0.0.0.0 --port 5000 --reload"
echo ""
echo "3️⃣  In another terminal, start frontend:"
echo "   npm run dev"
echo ""
echo "4️⃣  Open http://localhost:5173 and test the AI Assistant!"
echo ""
