# 📋 RAILWAY DEPLOYMENT QUICK REFERENCE

## ✅ What We've Done

- [x] Built frontend to `/dist` (503 KB JS, 126 KB CSS)
- [x] Modified backend to serve frontend static files
- [x] Created `Procfile` for Railway startup
- [x] Created `railway.json` build configuration
- [x] Created `.railwayignore` to exclude unnecessary files
- [x] Updated `package.json` with deployment scripts
- [x] Created comprehensive deployment guides
- [x] Tested locally (backend running, health check passing)

---

## 🎯 Your Next Steps

### Step 1: Create MongoDB Database
```
Visit: https://www.mongodb.com/cloud/atlas
→ Sign up/Login
→ Create free cluster
→ Get connection string: mongodb+srv://...
```

### Step 2: Push Code to GitHub
```bash
git add .
git commit -m "Railway deployment configuration"
git push origin main
```

### Step 3: Deploy on Railway
```
1. Visit: https://railway.app/dashboard
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Select your repository
5. Click "Deploy"
```

### Step 4: Add Environment Variables
In Railway Dashboard → Variables tab, add:
```
NODE_ENV=production
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/ai-land-verification
CORS_ORIGIN=*
```

### Step 5: Verify It Works
```bash
curl https://your-railway-app.railway.app/api/health
# Should return: {"status":"OK","mongo":true,...}

# Open in browser:
https://your-railway-app.railway.app
```

---

## 📁 Key Files for Railway

| File | Purpose |
|------|---------|
| `Procfile` | How to start (Railway reads this) |
| `railway.json` | Build settings |
| `.railwayignore` | What to exclude |
| `backend/server.cjs` | App entry point (serves frontend too) |
| `dist/` | Built frontend (auto-served) |
| `package.json` | Dependencies & scripts |

---

## 🌐 Expected Result After Deployment

```
User visits: https://your-railway-app.railway.app

↓

Single Node.js server running:
  • Frontend: HTML/CSS/JS from /dist
  • Backend: Express API at /api/*
  • Database: Connected to MongoDB Atlas

✅ All-in-one deployment!
```

---

## 🔧 If Something Goes Wrong

| Issue | Fix |
|-------|-----|
| "Build failed" | Check Railway logs → Logs tab |
| "Cannot connect to MongoDB" | Whitelist 0.0.0.0/0 in MongoDB Atlas |
| "Frontend blank" | Clear browser cache, check console errors |
| "API 404 errors" | Verify backend is running, check routes |
| "Port already in use" | Railway assigns port automatically (8080) |

---

## 📚 Documentation

- **Full Setup:** [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)
- **Checklist:** [RAILWAY_CHECKLIST.md](./RAILWAY_CHECKLIST.md)
- **Status:** [RAILWAY_READY.md](./RAILWAY_READY.md)
- **Local Testing:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## ⏱️ Timeline

| Step | Time |
|------|------|
| Create MongoDB | 5 min |
| Push to GitHub | 2 min |
| Deploy to Railway | 3-5 min |
| Configure variables | 2 min |
| Test & verify | 2 min |
| **TOTAL** | **~15 min** |

---

## 💡 Pro Tips

1. **First time?**
   - Follow [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) step by step
   - Don't skip MongoDB setup

2. **Updates?**
   ```bash
   git push origin main  # Railway redeploys automatically
   ```

3. **Monitor?**
   - Railway Dashboard → Metrics tab
   - Check CPU, memory, network

4. **Custom Domain?**
   - Railway → Project → Domains
   - Add your domain name

---

## ✨ Features Deployed

✅ Pre-login landing page
✅ Role-based authentication (buyer, seller, admin, legal)
✅ Dynamic saved listings (starts at 0, user controls)
✅ Clickable KPI cards
✅ Full property browsing & search
✅ Document verification
✅ Appointment scheduling
✅ Inquiry management
✅ AI Reports
✅ Settings page
✅ Responsive design
✅ localStorage persistence

---

## 🚀 Ready?

**Current Status:** ✅ READY FOR DEPLOYMENT

1. Create MongoDB Atlas database
2. `git push origin main`
3. Deploy in Railway dashboard
4. Add environment variables
5. Test the URL

**That's it! You're live! 🎉**

---

## Questions?

- Railway Docs: https://docs.railway.app
- MongoDB Docs: https://docs.atlas.mongodb.com
- Express Guide: https://expressjs.com

**Generated:** May 2, 2026
**Version:** 1.0.0 Deployment Ready
