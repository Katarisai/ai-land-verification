# Setup script for Google Gemini API integration (Windows)
# Usage: .\setup-gemini.ps1 -ApiKey "AIza_your_key_here"

param(
    [Parameter(Mandatory=$true)]
    [string]$ApiKey
)

Write-Host "AI Land Verification Platform - Google Gemini Setup" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host ""

# Validate API key format
if (-not $ApiKey.StartsWith("AIza")) {
    Write-Host "[ERROR] Invalid API key format. It should start with 'AIza'" -ForegroundColor Red
    Write-Host ""
    Write-Host "[INFO] Get your free API key at: https://makersuite.google.com/app/apikey" -ForegroundColor Yellow
    exit 1
}

Write-Host "[SUCCESS] API Key validated (starts with AIza)" -ForegroundColor Green
Write-Host ""

# Setup Node.js server
Write-Host "[SETUP] Setting up Node.js server..." -ForegroundColor Yellow

if (Test-Path "server") {
    $serverEnv = @"
GOOGLE_API_KEY=$ApiKey
PORT=5000
"@
    Set-Content -Path "server\.env" -Value $serverEnv
    Write-Host "[SUCCESS] Created server\.env" -ForegroundColor Green
}
else {
    Write-Host "[ERROR] server\ directory not found" -ForegroundColor Red
    exit 1
}

# Setup Python backend
Write-Host "[SETUP] Setting up Python backend..." -ForegroundColor Yellow

if (Test-Path "backend\python_ai_assistant") {
    $pythonEnv = @"
GOOGLE_API_KEY=$ApiKey
AI_SERVER_PORT=5000
"@
    Set-Content -Path "backend\python_ai_assistant\.env" -Value $pythonEnv
    Write-Host "[SUCCESS] Created backend\python_ai_assistant\.env" -ForegroundColor Green
}
else {
    Write-Host "[ERROR] backend\python_ai_assistant\ directory not found" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Start Node.js server:" -ForegroundColor Cyan
Write-Host "   cd server" -ForegroundColor White
Write-Host "   npm install" -ForegroundColor White
Write-Host "   npm start" -ForegroundColor White
Write-Host ""
Write-Host "2. Or start Python backend:" -ForegroundColor Cyan
Write-Host "   cd backend\python_ai_assistant" -ForegroundColor White
Write-Host "   pip install -r requirements.txt" -ForegroundColor White
Write-Host "   uvicorn main:app --host 0.0.0.0 --port 5000 --reload" -ForegroundColor White
Write-Host ""
Write-Host "3. In another terminal, start frontend:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "4. Open http://localhost:5173 and test the AI Assistant!" -ForegroundColor Cyan
Write-Host ""
