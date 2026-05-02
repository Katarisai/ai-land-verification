# Deployment Guide - AI Land Verification Platform

## Quick Start Deployment

### Prerequisites
- **Node.js** 16+ installed
- **MongoDB** running locally or connection string available
- **Port 7000** available for backend
- **Port 3000** available for frontend (optional)

---

## Step 1: Frontend Build ✓ (Already Done)

The frontend has been built successfully to the `dist/` folder:
- `dist/index.html` - Main app
- `dist/assets/` - CSS and JavaScript bundles

### Build again if needed:
```bash
npm run build
```

---

## Step 2: Backend Setup

### Install Backend Dependencies
```bash
cd backend
npm install
```

### Configure Backend Environment

Create or update `backend/.env.production`:
```
NODE_ENV=production
PORT=7000
MONGO_URI=mongodb://localhost:27017/ai-land-verification
CORS_ORIGIN=*
```

Or use the existing default:
```bash
# Backend will use .env if present, otherwise defaults to localhost:27017
```

---

## Step 3: Start the Application

### Option A: Development Mode (Local Testing)

**Terminal 1 - Start Backend:**
```bash
cd backend
npm start
# Backend running at http://localhost:7000
```

**Terminal 2 - Start Frontend:**
```bash
npm run dev
# Frontend running at http://localhost:5173
```

Then open: `http://localhost:5173`

---

### Option B: Production Mode (Served Together)

**Setup Backend to Serve Frontend:**

Update `backend/server.cjs` to add this before other routes:

```javascript
// Serve static frontend files from dist/
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// All other routes serve index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});
```

Then start only the backend:
```bash
cd backend
npm start
# Both frontend and API available at http://localhost:7000
```

---

## Step 4: Verify Deployment

### Check Backend Health
```bash
curl http://localhost:7000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "mongo": true,
  "timestamp": "2024-..."
}
```

### Check Frontend
Open browser: `http://localhost:7000` (or `http://localhost:5173` if dev mode)

You should see:
- Landing page (if not logged in)
- Dashboard (if logged in with dev auto-login enabled)

---

## MongoDB Setup

### Local MongoDB
```bash
# Install MongoDB Community Edition
# Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/

# Start MongoDB
mongod

# Or as service (Windows):
# MongoDB should auto-start if installed as service
```

### MongoDB Atlas (Cloud)
If using MongoDB Atlas instead:

1. Create a free account: https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string (looks like `mongodb+srv://user:pass@cluster.mongodb.net/dbname`)
4. Update `backend/.env.production` or environment variable:
   ```
   MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/ai-land-verification
   ```

---

## Environment Variables Summary

### Backend (`backend/.env` or `.env.production`)
| Variable | Value | Purpose |
|----------|-------|---------|
| `NODE_ENV` | `production` | Production mode |
| `PORT` | `7000` | API server port |
| `MONGO_URI` | `mongodb://localhost:27017/...` | Database connection |
| `CORS_ORIGIN` | `*` | Allow all origins (restrict in production) |

### Frontend (`.env.production`)
| Variable | Value | Purpose |
|----------|-------|---------|
| `VITE_API_BASE` | `http://localhost:7000` | Backend API URL |
| `VITE_AI_SERVER_URL` | `http://localhost:5000` | AI service URL (optional) |

---

## Troubleshooting

### Port Already in Use
```bash
# Check what's using port 7000
netstat -ano | findstr :7000

# Kill the process
taskkill /PID <PID> /F
```

### MongoDB Connection Failed
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- For Atlas: ensure IP whitelist includes your IP

### Frontend Shows Blank
- Check browser console for errors
- Ensure backend is running: `curl http://localhost:7000/api/health`
- Clear browser cache and reload

### API Calls Return 404
- Verify backend is running on correct port
- Check `VITE_API_BASE` matches backend URL
- Rebuild frontend after changing env vars

---

## Production Checklist

- [ ] Backend `.env` configured with production values
- [ ] MongoDB running and accessible
- [ ] Frontend built: `npm run build`
- [ ] Backend dependencies installed: `cd backend && npm install`
- [ ] CORS properly configured (restrict origins in production)
- [ ] Environment variables not hardcoded
- [ ] Database backups configured
- [ ] Error logging set up
- [ ] HTTPS/SSL certificate configured (for production domains)

---

## Next Steps

1. **Deploy Backend:**
   - Consider Docker containerization
   - Use process manager (PM2) for restart on crash
   - Deploy to cloud (AWS, Heroku, DigitalOcean, Render)

2. **Deploy Frontend:**
   - Option 1: Let backend serve static files (recommended)
   - Option 2: Deploy to CDN (Vercel, Netlify, AWS S3 + CloudFront)

3. **Database:**
   - Use MongoDB Atlas for managed hosting
   - Configure automatic backups
   - Monitor performance

4. **Monitoring:**
   - Set up health checks
   - Configure error tracking (Sentry)
   - Monitor API performance

---

## Additional Resources

- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [Express Production Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Deployment Checklist](https://docs.mongodb.com/manual/administration/production-checklist/)

---

**Current Status:** ✅ Build complete, ready for backend startup and serving

