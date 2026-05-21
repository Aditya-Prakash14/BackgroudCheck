# BGV Platform - Deployment Configuration Guide

## Environment Setup for Deployment

### Frontend (.env.local or .env.production.local)
```
NEXT_PUBLIC_API_URL=https://backgroud-check-tjp2.vercel.app
```

### Backend (.env or .env.production)
```
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require
JWT_SECRET=[secure-secret-key]
PORT=3000
FRONTEND_URL=https://bgv-platform.vercel.app
AADHAAR_API_URL=https://backgroud-check-tjp2.vercel.app/api/mock-api/aadhaar/verify
PAN_API_URL=https://backgroud-check-tjp2.vercel.app/api/mock-api/pan/verify
NODE_ENV=production
```

## Deployment Options

### Option 1: Deploy to Vercel (Recommended)

#### Frontend Only (Current Setup):
1. Connect GitHub repository to Vercel
2. Vercel automatically detects `vercel.json`
3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL`

#### Monorepo (Frontend + Backend):
1. Use `vercel-monorepo.json` as base configuration
2. Deploy both frontend and backend to Vercel
3. Configure environment variables in Vercel settings

### Option 2: Deploy Backend to Railway, Render, or Heroku

1. Push code to Git repository
2. Connect your repository to the platform
3. Set environment variables (DATABASE_URL, JWT_SECRET, etc.)
4. Deploy

### Option 3: Docker Deployment

Build and deploy using Docker containers for both frontend and backend.

## Pre-Deployment Checklist

- [ ] Update `DATABASE_URL` to production database
- [ ] Update `JWT_SECRET` to a strong, unique secret
- [ ] Update `FRONTEND_URL` to production frontend domain
- [ ] Update `NEXT_PUBLIC_API_URL` to production backend domain
- [ ] Set `NODE_ENV=production` in backend
- [ ] Run `npm run build` locally to test builds
- [ ] Test API connectivity between frontend and backend
- [ ] Set up proper CORS headers in backend
- [ ] Enable HTTPS/SSL for all connections
- [ ] Set up database backups
- [ ] Configure error logging (e.g., Sentry)

## Environment Variable Locations

**Vercel Dashboard:**
1. Go to Project Settings → Environment Variables
2. Add variables for different deployment stages:
   - Production
   - Preview
   - Development

**Local Development:**
Use `.env.local` files which are git-ignored

**Production:**
Use `.env.production` files or set via platform dashboard
