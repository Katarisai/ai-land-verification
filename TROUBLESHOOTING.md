# Troubleshooting Guide - Google Gemini Integration

## ✅ Status: WORKING

Your Google Gemini API is successfully integrated and working!

---

## Common Issues & Solutions

### Issue 1: "503 - Google Gemini service temporarily unavailable"

**Causes:**
- Temporary Gemini API outage
- Network connectivity issues
- Request format issues
- Safety filters blocking content

**Solutions:**

1. **Check Server Logs** - Look for detailed error messages in the terminal running `npm start`

2. **Verify API Key**
   ```bash
   # Check if the key is correctly set
   cat server/.env
   ```
   Should show: `GOOGLE_API_KEY=AIza...`

3. **Test API Directly**
   ```powershell
   $body = @{message='Hello';conversationHistory=@()} | ConvertTo-Json
   Invoke-RestMethod -Uri 'http://localhost:5000/api/chat' -Method Post -Body $body -ContentType 'application/json'
   ```

4. **Restart Server**
   ```powershell
   taskkill /F /IM node.exe
   cd server
   npm start
   ```

5. **Try a Different Question** - Some content may trigger safety filters

---

### Issue 2: "Failed to fetch" or "Network Error"

**Causes:**
- Server not running
- Wrong port
- CORS issues

**Solutions:**

1. **Check if Server is Running**
   ```powershell
   # Test health endpoint
   curl http://localhost:5000/api/health
   ```

2. **Verify Port**
   - Server should be on port 5000
   - Check `.env` file: `PORT=5000`
   - Look for "Server READY on port XXXX" in terminal

3. **Check Frontend Configuration**
   - File: `.env` in root directory
   - Should have: `VITE_AI_SERVER_URL=http://localhost:5000`

---

### Issue 3: "Invalid API Key" or 401 Error

**Causes:**
- Wrong API key
- API key revoked
- API key not set

**Solutions:**

1. **Get New API Key**
   - Visit: https://makersuite.google.com/app/apikey
   - Click "Create API key"
   - Copy the new key

2. **Update .env Files**
   ```bash
   # In server/.env
   GOOGLE_API_KEY=AIza_YOUR_NEW_KEY

   # In backend/python_ai_assistant/.env (if using Python)
   GOOGLE_API_KEY=AIza_YOUR_NEW_KEY
   ```

3. **Restart Server**

---

### Issue 4: "Content Blocked by Safety Filters"

**Causes:**
- Question contains sensitive topics
- Gemini's safety filters triggered

**Solutions:**

1. **Rephrase Question** - Make it more neutral and specific
2. **Avoid Sensitive Topics** - Don't ask about harmful content
3. **Check Server Logs** - Will show `blockReason` if blocked

---

### Issue 5: "Empty Response" or No Reply

**Causes:**
- Response blocked by safety
- API rate limit exceeded
- Token limit exceeded

**Solutions:**

1. **Check Finish Reason** - Server logs will show why response ended
2. **Shorten Question** - Keep under 1000 tokens
3. **Wait and Retry** - If rate limited, wait 60 seconds

---

## Error Code Reference

| Code | Meaning | Solution |
|------|---------|----------|
| 400 | Bad Request | Check request format, rephrase question |
| 401 | Unauthorized | Verify API key is correct |
| 403 | Forbidden | Check API key permissions |
| 429 | Rate Limited | Wait 60 seconds before retrying |
| 500 | Server Error | Check server logs, restart server |
| 503 | Service Unavailable | Temporary issue, retry in a few moments |

---

## Improved Error Messages

The server now provides detailed error messages:

```javascript
// Before (generic):
"Google Gemini service temporarily unavailable"

// After (specific):
"Google Gemini service error: [actual error from Gemini]"
"Content was blocked: SAFETY - Please rephrase your question"
"Response was blocked by safety filters"
```

---

## Testing Commands

### Quick Health Check
```powershell
Invoke-RestMethod -Uri 'http://localhost:5000/api/health'
```

### Test Chat Endpoint
```powershell
$body = @{
    message = 'What is land verification?'
    conversationHistory = @()
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://localhost:5000/api/chat' `
    -Method Post `
    -Body $body `
    -ContentType 'application/json'
```

### Check Server Logs
Look for these indicators:
- ✅ "API Key status: ✅ Loaded"
- ✅ "Server READY on port 5000"
- ✅ "Google Gemini response received"

### Check Available Models
```powershell
Invoke-RestMethod -Uri "https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_KEY"
```

---

## Prevention Tips

1. **Always Check Logs First** - Most issues show detailed error messages
2. **Keep API Key Secure** - Never commit `.env` files to git
3. **Monitor Rate Limits** - Free tier: 60 requests/minute
4. **Test Incrementally** - Test simple questions before complex ones
5. **Update Regularly** - Check for model updates and changes

---

## Current Configuration

**Model:** `gemini-2.5-flash` (stable, free tier)
**API Version:** `v1beta`
**Rate Limit:** 60 requests/minute (free tier)
**Token Limits:**
- Input: 1M tokens
- Output: 65K tokens

---

## Getting Help

If issues persist:

1. **Check Server Terminal** - Detailed error logs
2. **Check Browser Console (F12)** - Frontend errors
3. **Review Documentation:**
   - [GEMINI_QUICK_START.md](GEMINI_QUICK_START.md)
   - [GEMINI_SETUP_GUIDE.md](GEMINI_SETUP_GUIDE.md)
4. **Google Gemini Docs:** https://ai.google.dev/docs

---

## Recent Fixes Applied

✅ Improved error handling with detailed messages
✅ Better safety filter detection
✅ Fixed conversation history format
✅ Added blockReason and finishReason logging
✅ More descriptive error responses

**Status: All systems operational** ✅
