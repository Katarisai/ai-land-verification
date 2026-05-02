# ✅ Railway Deployment Checklist

## Pre-Deployment Setup (One Time)

- [ ] Create GitHub repository and push code
- [ ] Create MongoDB Atlas account and database
- [ ] Get MongoDB connection string
- [ ] Create Railway account at railway.app
- [ ] Connect Railway to GitHub

---

## Deployment Steps

### 1. Frontend Build ✅
```bash
npm run build
# ✓ 1711 modules transformed
# ✓ dist/ folder ready
```

**Status:** Frontend built and ready (Latest: 503 KB JS, 126 KB CSS)

### 2. Backend Configuration ✅
**File:** `backend/server.cjs`
- ✅ Serves static files from `/dist`
- ✅ SPA fallback for React routing
- ✅ API routes at `/api/*`

### 3. Railway Configuration Files ✅
- ✅ `Procfile` - Tells Railway how to start
- ✅ `railway.json` - Build configuration
- ✅ `.railwayignore` - Files to exclude
- ✅ `package.json` - Build scripts updated

### 4. Environment Variables

Add these in Railway Dashboard → Variables:

```
NODE_ENV=production
PORT=8080
MONGO_URI=mongodb+srv://user:password@cluster0.xxx.mongodb.net/ai-land-verification
CORS_ORIGIN=*
```

---

## Deployment Process

### Step 1: Prepare MongoDB
- [ ] Create MongoDB Atlas account
- [ ] Create shared cluster (free)
- [ ] Get connection string
- [ ] Whitelist IP: `0.0.0.0/0`

### Step 2: Push to GitHub
```bash
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

### Step 3: Deploy on Railway
1. [ ] Go to https://railway.app/dashboard
2. [ ] Click "New Project"
3. [ ] Select "Deploy from GitHub"
4. [ ] Connect GitHub account
5. [ ] Select repository
6. [ ] Click "Deploy"

### Step 4: Configure Variables
1. [ ] Open Railway project
2. [ ] Click Variables tab
3. [ ] Add `MONGO_URI` with your connection string
4. [ ] Add `CORS_ORIGIN=*`
5. [ ] Redeploy if needed

### Step 5: Verify Deployment
```bash
# Check backend health
curl https://your-railway-app.railway.app/api/health

# Should return:
# {"status":"OK","mongo":true,"timestamp":"..."}
```

---

## Post-Deployment

- [ ] Test landing page
- [ ] Test login functionality
- [ ] Test save listing feature
- [ ] Test all navigation
- [ ] Check browser console for errors
- [ ] Verify API calls working

---

## Files Modified for Railway

| File | Changes |
|------|---------|
| `backend/server.cjs` | Serves frontend static files |
| `package.json` | Added `build:full` script |
| `Procfile` | Tells Railway to start backend |
| `railway.json` | Railway build config |
| `.railwayignore` | Files to exclude from deploy |

---

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| **Build fails** | Check build logs in Railway dashboard |
| **MongoDB error** | Verify connection string & whitelist IPs |
| **Frontend blank** | Check browser console, verify API working |
| **API 404** | Ensure backend is running, check routes |

---

## Support Docs

- Full Guide: [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)
- Build Details: [DEPLOYMENT_COMPLETE.md](./DEPLOYMENT_COMPLETE.md)
- Local Setup: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## Current Status

✅ **Ready for Railway Deployment**

All files configured and tested locally. Follow the deployment steps above to go live!

**Estimated Deployment Time:** 5-10 minutes

---

**Generated:** May 2, 2026
**Platform Version:** 1.0.0
