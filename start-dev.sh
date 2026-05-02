#!/bin/bash

echo "========================================"
echo "AI Land Verification Platform"
echo "Development Startup"
echo "========================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js not found. Please install Node.js first."
    exit 1
fi

# Install dependencies if needed
echo "Installing dependencies..."
npm install --silent --legacy-peer-deps 2>/dev/null

echo "Starting Backend API on port 7000..."
cd backend
npm install --silent --legacy-peer-deps 2>/dev/null
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend
sleep 3

echo ""
echo "Starting Frontend on port 5173..."
npm run dev &
FRONTEND_PID=$!

# Wait for all processes
echo ""
echo "========================================"
echo "Backend:   http://localhost:7000"
echo "Frontend:  http://localhost:5173"
echo "========================================"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

wait
