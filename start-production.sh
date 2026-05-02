#!/bin/bash

echo "========================================"
echo "AI Land Verification Platform"
echo "Production Startup"
echo "========================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js not found. Please install Node.js first."
    exit 1
fi

# Start Backend
echo "Starting Backend API on port 7000..."
cd backend
npm install --silent --legacy-peer-deps 2>/dev/null
echo "Launching backend server..."
npm start &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 3

# Navigate back
cd ..

# Show info
echo ""
echo "========================================"
echo "Backend:  http://localhost:7000"
echo "Health:   http://localhost:7000/api/health"
echo "Frontend: http://localhost:7000"
echo "========================================"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Wait for all processes
wait
