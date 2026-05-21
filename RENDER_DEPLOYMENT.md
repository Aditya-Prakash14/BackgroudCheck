# BGV Platform - Render Deployment Guide

Complete guide for deploying the BGV Platform to Render with PostgreSQL database integration.

## Prerequisites

- GitHub account with repository access
- Render account (free tier available at render.com)
- PostgreSQL database (Render Postgres or external)

## Deployment Strategy

Since Render doesn't support monorepos with multiple services via a single YAML file easily, we'll deploy:
1. **Backend** - Node.js/Express API service
2. **Frontend** - Next.js web service
3. **Database** - PostgreSQL (Render Postgres)

## Step 1: Set Up PostgreSQL Database

### Option A: Render Postgres (Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +"
3. Select "PostgreSQL"
4. Fill in:
   - **Name**: `bgv-postgres`
   - **Database**: `bgv_db`
   - **User**: `bgv_user`
   - **Region**: Choose your region
5. Click "Create Database"
6. Copy the connection string (you'll need this)

### Option B: External PostgreSQL
- Use your existing Neon PostgreSQL connection string
- Ensure it's accessible from Render

## Step 2: Deploy Backend Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Fill in:
   - **Name**: `bgv-platform-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=<your-postgres-connection-string>
   JWT_SECRET=<your-secret-key>
   FRONTEND_URL=<your-frontend-render-url>
   AADHAAR_API_URL=<optional>
   PAN_API_URL=<optional>
   ```
6. Click "Deploy"
7. Wait for deployment to complete
8. Note the backend URL (e.g., `https://bgv-platform-backend.onrender.com`)

## Step 3: Deploy Frontend Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Fill in:
   - **Name**: `bgv-platform-frontend`
   - **Root Directory**: `frontend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=<backend-url>
   ```
   (e.g., `https://bgv-platform-backend.onrender.com`)
6. Click "Deploy"
7. Wait for deployment to complete
8. Your frontend will be live at the provided Render URL

## Step 4: Update Frontend API Configuration

Create or update `frontend/.env.production`:
```env
NEXT_PUBLIC_API_URL=https://bgv-platform-backend.onrender.com
```

Update `frontend/src/services/api.ts` to use this:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
```

## Step 5: Configure CORS in Backend

Ensure backend CORS is configured for your frontend domain:
```typescript
// In backend/src/app.ts
cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
})
```

## Environment Variables Summary

### Backend (.env or Render Environment Variables)
```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
FRONTEND_URL=https://bgv-platform-frontend.onrender.com
AADHAAR_API_URL= (optional, leave empty for production)
PAN_API_URL= (optional, leave empty for production)
```

### Frontend (.env.production or Render Environment Variables)
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://bgv-platform-backend.onrender.com
```

## Deployment Checklist

- [ ] PostgreSQL database created and connection string copied
- [ ] Backend service deployed with all env vars set
- [ ] Frontend service deployed with API URL configured
- [ ] Both services show "Live" status on Render Dashboard
- [ ] Test login at frontend URL
- [ ] Test API endpoints from browser console
- [ ] Check logs for any errors

## Monitoring & Logs

1. Go to Render Dashboard
2. Click on each service
3. View "Logs" tab for real-time logs
4. Check "Events" tab for deployment history

## Troubleshooting

### Backend won't start
- Check `npm start` is correct in `backend/package.json`
- Verify `DATABASE_URL` is set and valid
- Check logs for TypeScript compilation errors

### Frontend won't connect to backend
- Verify `NEXT_PUBLIC_API_URL` is set in frontend env vars
- Check CORS configuration in backend
- Test API directly from browser: `https://backend-url/api/health`

### Database connection failing
- Verify connection string format
- Check PostgreSQL is running and accessible
- Run migrations: Backend will auto-run on startup via Prisma

## Post-Deployment

1. **Run Database Migrations** (automatic via Prisma)
2. **Seed Database** (if needed):
   ```bash
   cd backend
   npm run prisma:seed
   ```
3. **Test Registration**: Create new user at frontend URL
4. **Test API**: Use browser network tab to verify API calls
5. **Monitor Performance**: Check Render dashboard for resource usage

## Custom Domain (Optional)

1. Go to your service on Render Dashboard
2. Settings → Custom Domain
3. Add your domain and follow DNS instructions

---

**Your app is now ready for production on Render!** 🚀
