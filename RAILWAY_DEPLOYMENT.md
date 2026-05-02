# 🚀 Railway Deployment Guide

## AI Land Verification Platform on Railway

Deploy both frontend and backend to Railway with MongoDB Atlas.

---

## 📋 Prerequisites

1. **Railway Account** - Sign up at https://railway.app
2. **GitHub Repository** - Push code to GitHub (Railway deploys from git)
3. **MongoDB Atlas** - Cloud MongoDB database (free tier available)
4. **Git CLI** - For pushing code

---

## Step 1: Prepare MongoDB Atlas

### Create a Free MongoDB Atlas Database

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up/Login with your account
3. Create a free cluster:
   - Click "Create" → "Shared" (Free tier)
   - Choose region (closest to your users)
   - Cluster name: `ai-land-verification`
   - Click "Create Cluster"

### Get Connection String

1. Click "Connect" on your cluster
2. Choose "Drivers" → Node.js
3. Copy the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster0.xxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `ai-land-verification`

---

## Step 2: Push Code to GitHub

### Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit - ready for Railway deployment"
```

### Add GitHub Remote

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy on Railway

### Create Railway Project

1. Go to https://railway.app/dashboard
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Connect your GitHub account
5. Select your repository
6. Click "Deploy"

### Configure Backend Service

Railway will auto-detect `Procfile` and start the backend. Configure:

1. **Service Settings**
   - Click on the service
   - Variables tab → Add environment variables:

   ```
   NODE_ENV=production
   PORT=8080
   MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/ai-land-verification
   CORS_ORIGIN=*
   ```

   Replace the MONGO_URI with your connection string from Atlas.

2. **Deployment Settings**
   - Ensure "Procfile" is recognized
   - Start command should be: `cd backend && npm start`
   - Root directory: `/` (project root)

### Get Backend URL

1. Click "Deployments" → Your deployment
2. Copy the Railway domain (looks like `railway-project-xxx.railway.app`)
3. This is your `BACKEND_URL`

---

## Step 4: Update Frontend Environment

The frontend is bundled with the backend, but update for any API calls:

1. Create `.env.railway` in project root:
   ```
   VITE_API_BASE=https://your-railway-app.railway.app
   VITE_AI_SERVER_URL=https://your-railway-app.railway.app
   ```

2. Rebuild frontend:
   ```bash
   npm run build
   git add dist/
   git commit -m "Build for Railway deployment"
   git push
   ```

---

## Step 5: Verify Deployment

### Check Backend Health

```bash
curl https://your-railway-app.railway.app/api/health
```

Expected response:
```json
{
  "status": "OK",
  "mongo": true,
  "timestamp": "2026-05-02T..."
}
```

### Access Frontend

Open: `https://your-railway-app.railway.app`

You should see:
- Landing page or Dashboard
- Fully functional app
- All pages loading without errors

---

## Troubleshooting

### Build Fails: "Procfile not found"
- Ensure `Procfile` is in project root (not backend/)
- Check file doesn't have `.txt` extension

### MongoDB Connection Error
- Verify connection string in MONGO_URI
- Ensure MongoDB Atlas IP whitelist includes Railway IPs
  - Atlas → Security → Network Access
  - Add IP: `0.0.0.0/0` (for development) or Railway static IPs

### Frontend Shows Blank
- Check browser console for errors
- Verify backend is running: `curl https://your-app.railway.app/api/health`
- Clear cache and reload

### API 404 Errors
- Verify BACKEND_URL in environment
- Check API routes are prefixed with `/api`
- Rebuild frontend if changed API URL

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **Deployment stuck** | Check build logs: Railway Dashboard → Logs |
| **Port conflicts** | Use PORT=8080 (Railway assigns dynamically) |
| **Static files not serving** | Ensure dist/ is committed to git |
| **Cannot connect to MongoDB** | Whitelist 0.0.0.0/0 in MongoDB Atlas Network Access |
| **Environment variables not loading** | Restart deployment after adding variables |

---

## Performance Tips

1. **Enable Database Indexing**
   ```javascript
   // MongoDB Atlas automatically indexes common fields
   // Verify in Atlas: Collections → Indexes
   ```

2. **Set Up Caching**
   - Add response headers for static files
   - Cache API responses when appropriate

3. **Monitor Performance**
   - Railway Dashboard → Metrics
   - Check CPU, memory, network usage

4. **Optimize Build**
   - The build warning about large chunks is normal
   - Vite tree-shakes unused code automatically

---

## Update Deployment

To deploy updates:

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push origin main

# Railway automatically redeploys on push
# Check Railway Dashboard for build progress
```

---

## Environment Variables Reference

| Variable | Value | Example |
|----------|-------|---------|
| `NODE_ENV` | production | production |
| `PORT` | 8080 (Railway assigns) | 8080 |
| `MONGO_URI` | MongoDB connection | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `CORS_ORIGIN` | Allowed origins | `*` or `https://yourdomain.com` |

---

## Next Steps

1. **Custom Domain**
   - Railway → Project Settings → Domains
   - Add custom domain (CNAME record required)

2. **Auto-deploy**
   - Railway auto-deploys on `main` branch push
   - Disable in Railway → Deploy settings if needed

3. **Monitoring & Alerts**
   - Set up monitoring: Railway → Monitoring
   - Get alerts for crashes or errors

4. **Backup Database**
   - MongoDB Atlas → Backup
   - Enable automated daily backups

---

## Support Resources

- [Railway Documentation](https://docs.railway.app)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com)
- [Express Deployment Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

---

**Status:** Ready for Railway deployment ✅

Follow these steps to go live in minutes!
