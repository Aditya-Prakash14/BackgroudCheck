# BGV Platform - Vercel Deployment Guide

Complete guide for deploying the BGV Platform to Vercel with PostgreSQL database integration.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup Overview](#setup-overview)
- [Step 1: Prepare Your Repository](#step-1-prepare-your-repository)
- [Step 2: Database Setup](#step-2-database-setup)
- [Step 3: Vercel Configuration](#step-3-vercel-configuration)
- [Step 4: Deploy to Vercel](#step-4-deploy-to-vercel)
- [Step 5: Environment Variables](#step-5-environment-variables)
- [Monitoring & Troubleshooting](#monitoring--troubleshooting)
- [Custom Domain](#custom-domain)
- [Rollback](#rollback)

## Prerequisites

### Required Accounts
- ✅ GitHub account with repository access
- ✅ Vercel account (free tier available)
- ✅ PostgreSQL database (options below)

### Database Options

#### Option A: Vercel Postgres (Recommended)
- Free tier available
- Integrated with Vercel
- No additional setup

#### Option B: External PostgreSQL
- AWS RDS
- Heroku Postgres
- DigitalOcean
- PlanetScale
- Any PostgreSQL provider

## Setup Overview

```
┌─────────────────────────────────────────┐
│  Push Code to GitHub                    │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│  Connect GitHub to Vercel               │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│  Set Up PostgreSQL Database             │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│  Configure Environment Variables        │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│  Deploy & Run Migrations                │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│  ✅ Live on Vercel!                     │
└─────────────────────────────────────────┘
```

## Step 1: Prepare Your Repository

### 1.1 Ensure Files Are Committed

```bash
# Make sure all code is committed to GitHub
git status

# If changes exist, commit them
git add .
git commit -m "chore: prepare for Vercel deployment"
git push origin main
```

### 1.2 Verify Project Structure

Ensure your repository has:
- ✅ `frontend/` directory with Next.js app
- ✅ `backend/` directory with Express app
- ✅ `vercel.json` (configuration file)
- ✅ `.vercelignore` (ignore patterns)
- ✅ Both `package.json` files properly configured

```bash
# Check structure
ls -la
# Should show: frontend/, backend/, vercel.json, .vercelignore, README.md, etc.
```

## Step 2: Database Setup

### Option A: Vercel Postgres Integration

#### Create Vercel Postgres Database

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Select your project (or create new)

2. **Add Postgres Database**
   - Go to **Storage** tab
   - Click **Create Database**
   - Select **Postgres**
   - Choose region (closest to users)
   - Click **Create**

3. **Copy Connection String**
   - Click on the database
   - Copy the `POSTGRES_URL` or `PRISMA_DATABASE_URL`
   - Save it for Step 5

#### Initialize Database Schema

```bash
# Locally, update .env with Vercel Postgres URL
DATABASE_URL="postgresql://..."  # Paste the URL here

# Run migrations
cd backend
npm install
npm run prisma:migrate

# Optional: Seed with sample data
npm run prisma:seed
```

### Option B: External PostgreSQL Database

If using external database (AWS RDS, Heroku, etc.):

1. **Create Database**
   - Follow your provider's setup instructions
   - Get connection string in format: `postgresql://user:password@host:port/dbname`

2. **Test Connection Locally**
   ```bash
   cd backend
   echo "DATABASE_URL='postgresql://...'" > .env
   npm run prisma:migrate
   ```

3. **Note the Connection String**
   - Save for Step 5 (Environment Variables)

## Step 3: Vercel Configuration

### 3.1 Review Configuration Files

#### `vercel.json` - Already configured for:
- ✅ Frontend (Next.js) build
- ✅ Backend (Express/Node) build
- ✅ API routing (`/api/*` → backend)
- ✅ Static routes → frontend

#### `.vercelignore` - Excludes:
- ✅ Node modules
- ✅ Test files
- ✅ Environment files
- ✅ Development files

No changes needed to these files!

## Step 4: Deploy to Vercel

### 4.1 Connect GitHub Repository

1. **Visit Vercel Dashboard**
   - Go to https://vercel.com

2. **Create New Project**
   - Click **Add New...** → **Project**
   - Authorize GitHub if prompted
   - Select your repository
   - Click **Import**

3. **Project Settings**
   - Framework Preset: **Next.js**
   - Root Directory: **frontend**
   - Build Command: (leave default, vercel.json overrides)
   - Output Directory: **.next**
   - Click **Deploy**

### 4.2 Wait for Initial Build

- ⏳ First deployment takes 3-5 minutes
- 📊 Monitor build progress in dashboard
- ❌ May fail due to missing environment variables (expected)

## Step 5: Environment Variables

### 5.1 Add Variables in Vercel Dashboard

1. **Go to Project Settings**
   - Vercel Dashboard → Select Project
   - **Settings** tab → **Environment Variables**

2. **Add Backend Variables**

   **Production Environment** (for deployed app):
   
   ```
   DATABASE_URL = postgresql://user:password@host:port/db
   JWT_SECRET = your-super-secret-random-string-min-32-chars
   AADHAAR_API_URL = https://api.example.com/aadhaar
   PAN_API_URL = https://api.example.com/pan
   FRONTEND_URL = https://your-domain.vercel.app
   NODE_ENV = production
   ```

   **Preview Environment** (for PR previews):
   
   Same as production (or use separate test database)

   **Development Environment** (local, if needed):
   
   Same values as above

3. **Add Frontend Variables**

   ```
   NEXT_PUBLIC_API_URL = https://your-domain.vercel.app/api
   NEXT_PUBLIC_DEBUG = false
   ```

4. **Save & Redeploy**
   - After adding variables, click **Redeploy** on dashboard
   - Or push new commit to trigger redeploy

### 5.2 Generate Secure JWT_SECRET

```bash
# Generate a secure random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copy the output and use as JWT_SECRET
```

### 5.3 Verify Variables Are Set

```bash
# After deployment, check logs:
# Vercel Dashboard → Deployments → Select latest → Function Logs
# Should show environment variables are loaded
```

## Step 6: Deploy & Run Migrations

### 6.1 Run Database Migrations

After environment variables are set:

#### Option 1: Via Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Run migration in production
vercel env pull  # Gets env vars
cd backend
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

#### Option 2: Via Node Script

Create `backend/scripts/migrate.js`:
```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Running migrations...');
  // Prisma handles migrations automatically
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
```

### 6.2 Seed Sample Data (Optional)

```bash
cd backend
vercel env pull
npx ts-node prisma/seed.ts
```

### 6.3 Verify Deployment

1. **Check Vercel Dashboard**
   - Status should show ✅ **Ready**
   - No errors in logs

2. **Test API Endpoints**
   ```bash
   # Get your Vercel domain from dashboard
   curl https://your-domain.vercel.app/api/health
   ```

3. **Access Frontend**
   - Open https://your-domain.vercel.app
   - Should load Next.js app

## Monitoring & Troubleshooting

### Common Issues & Solutions

#### ❌ Build Fails with "DATABASE_URL not found"

**Solution:**
1. Go to Vercel Project Settings → Environment Variables
2. Verify DATABASE_URL is added
3. Ensure it's set for Production environment
4. Redeploy

```bash
# Redeploy
git commit --allow-empty -m "chore: redeploy"
git push origin main
```

#### ❌ API Returns 500 Errors

**Check Logs:**
```bash
# Via Vercel CLI
vercel logs
```

**Common Causes:**
- Database connection failed → Check DATABASE_URL
- JWT_SECRET not set → Add to environment variables
- Prisma migrations not run → Run `npm run prisma:migrate`

#### ❌ Frontend Can't Connect to API

**Check in Browser Console:**
```
Error: fetch to /api/... failed
```

**Solution:**
- Verify `NEXT_PUBLIC_API_URL` in frontend environment variables
- Check CORS settings in backend (`app.ts`)
- Ensure backend is deployed and responding

```bash
# Test from command line
curl -X GET https://your-domain.vercel.app/api/health
```

#### ❌ Database Migration Errors

**Check current migrations:**
```bash
cd backend
npx prisma migrate status
```

**Resolve conflicts:**
```bash
# Reset database (warning: deletes all data)
npx prisma migrate reset

# Or manually run migration
npx prisma migrate deploy
```

### View Logs

**Vercel Dashboard:**
- Select Project → **Deployments** tab
- Click latest deployment
- View **Function Logs** and **Build Logs**

**Via Vercel CLI:**
```bash
vercel logs --follow
```

### Performance Monitoring

1. **Check Analytics**
   - Vercel Dashboard → **Analytics** tab
   - View response times, edge cache hit rate

2. **Database Metrics**
   - Via your database provider dashboard
   - Monitor connection count, query performance

3. **Error Tracking**
   - Integration with Sentry (optional)
   - Vercel error notifications

## Custom Domain

### 1. Purchase Domain

Use any domain registrar:
- Vercel Domains
- GoDaddy
- Namecheap
- etc.

### 2. Add to Vercel

1. **Vercel Dashboard → Project Settings → Domains**
2. **Enter your domain name**
3. **Choose DNS approach:**

   **Option A: Vercel DNS (Easier)**
   - Vercel creates DNS records
   - Update nameservers at registrar
   - Takes 10-48 hours

   **Option B: CNAME**
   - Add CNAME record at registrar
   - Points to `<project>.vercel.app`
   - Faster propagation

### 3. Verify DNS

```bash
# Check DNS propagation
nslookup your-domain.com
# Should resolve to Vercel's IP

# Or use Vercel command
vercel domains verify your-domain.com
```

### 4. Update Environment Variables

```
FRONTEND_URL = https://your-domain.com
NEXT_PUBLIC_API_URL = https://your-domain.com/api
```

Then redeploy.

## Rollback

### Revert to Previous Deployment

1. **Via Vercel Dashboard**
   - Go to **Deployments** tab
   - Find the deployment you want
   - Click **...** → **Promote to Production**

2. **Via Git**
   ```bash
   # Revert last commit
   git revert HEAD
   git push origin main
   
   # Vercel automatically redeploys
   ```

### Database Rollback

```bash
# View migration history
cd backend
npx prisma migrate status

# Rollback last migration (be careful!)
npx prisma migrate resolve --rolled-back migration_name
```

## Performance Optimization

### Caching

**Frontend (Next.js):**
- Automatic static optimization
- ISR (Incremental Static Regeneration)

**Backend:**
```typescript
// In Express controllers
res.set('Cache-Control', 'public, max-age=3600'); // 1 hour
res.json(data);
```

### Database Optimization

```prisma
// In schema.prisma
model Candidate {
  @@index([email])  // Index frequently searched fields
}
```

### CDN & Edge Functions

Vercel automatically:
- Caches static assets globally
- Serves from nearest edge location
- Compresses responses

## Security Checklist

- ✅ JWT_SECRET is strong and unique
- ✅ DATABASE_URL not exposed in logs
- ✅ HTTPS enforced (automatic on Vercel)
- ✅ CORS properly configured
- ✅ Rate limiting enabled
- ✅ Sensitive data not logged
- ✅ Environment variables for secrets
- ✅ Regular security updates

## Maintenance

### Regular Tasks

**Weekly:**
- Monitor error rates in Vercel dashboard
- Check database connection health

**Monthly:**
- Review and update dependencies: `npm update`
- Check for security vulnerabilities: `npm audit`
- Review logs for unusual activity

**Quarterly:**
- Performance audit (Lighthouse)
- Database optimization and cleanup
- Cost review

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update all
npm update

# Update specific package
npm install package@latest

# Commit and push
git add package.json package-lock.json
git commit -m "chore: update dependencies"
git push origin main
```

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **GitHub Issues**: Report bugs in repository

---

**Deployment Status**: ✅ Ready  
**Last Updated**: May 2026
