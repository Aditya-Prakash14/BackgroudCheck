# Netlify Deployment Guide

This guide covers deploying the BGV Platform (full-stack) to Netlify.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Setup Steps](#setup-steps)
4. [Environment Variables](#environment-variables)
5. [Deployment](#deployment)
6. [Monitoring & Logs](#monitoring--logs)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Netlify account (free: https://netlify.com)
- GitHub repository connected to Netlify
- Node.js 18+ installed locally
- All environment variables configured

---

## Project Structure

```
bgv-platform/
├── backend/              # Express.js API server
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   └── dist/            # Built output (Netlify Functions)
├── frontend/            # Next.js frontend
│   ├── src/
│   ├── package.json
│   └── .next/          # Next.js build output
└── netlify.toml         # Netlify configuration
```

---

## Setup Steps

### 1. Connect Repository to Netlify

1. Go to https://app.netlify.com
2. Click **New site from Git**
3. Select **GitHub** and authorize
4. Select repository: `Aditya-Prakash14/BackgroudCheck`
5. Click **Deploy site**

### 2. Configure Build Settings

Netlify will auto-detect settings from `netlify.toml`:

- **Base directory**: (empty - root)
- **Build command**: `npm ci && npm run build:all`
- **Publish directory**: `frontend/.next`
- **Functions directory**: `backend/dist`

✅ These are already configured in `netlify.toml`

### 3. Set Environment Variables

In Netlify dashboard:

1. Go to **Site settings** → **Build & deploy** → **Environment**
2. Click **Edit variables**
3. Add the following variables:

| Key | Value | Notes |
|-----|-------|-------|
| `DATABASE_URL` | PostgreSQL connection string | Production database |
| `JWT_SECRET` | Your JWT secret | 32+ character random string |
| `PORT` | `8080` | Netlify default port |
| `NODE_ENV` | `production` | Always `production` |
| `AADHAAR_API_URL` | Your API URL | Third-party API endpoint |
| `PAN_API_URL` | Your API URL | Third-party API endpoint |
| `FRONTEND_URL` | `https://your-domain.netlify.app` | Your frontend URL |

4. Click **Save**

---

## Environment Variables

### Development (.env)
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/bgv_dev
JWT_SECRET=your-dev-secret-key
PORT=3001
NODE_ENV=development
AADHAAR_API_URL=https://api.example.com/aadhaar
PAN_API_URL=https://api.example.com/pan
FRONTEND_URL=http://localhost:3000
```

### Production (Netlify Dashboard)
```
DATABASE_URL=postgresql://user:password@prod-db:5432/bgv_prod
JWT_SECRET=your-prod-secret-key-min-32-chars
PORT=8080
NODE_ENV=production
AADHAAR_API_URL=https://api.example.com/aadhaar
PAN_API_URL=https://api.example.com/pan
FRONTEND_URL=https://your-domain.netlify.app
```

---

## Deployment

### Automatic Deployment

Every push to `main` branch triggers automatic deployment:

1. Push to GitHub: `git push origin main`
2. Netlify automatically builds and deploys
3. View deployment progress in Netlify dashboard
4. Check **Deployments** tab for status

### Manual Deployment

If you need to redeploy:

1. Go to Netlify dashboard
2. Click **Deployments**
3. Find the deployment you want
4. Click **...** menu → **Redeploy**

Or redeploy the latest:
```bash
git commit --allow-empty -m "trigger deployment"
git push origin main
```

### Deploy Preview

Every pull request automatically creates a preview deployment:

1. Create PR on GitHub
2. Netlify builds preview site
3. Link appears in PR comment
4. Review changes before merging

---

## Monitoring & Logs

### View Build Logs

1. Go to **Deployments** tab
2. Click on a deployment
3. Click **Deploy log** to see full build output

### Check Function Logs

1. Go to **Functions** tab
2. Select a function
3. View invocation logs in real-time

### Check Analytics

1. Go to **Analytics** section
2. View deployment statistics
3. Monitor bandwidth and requests

---

## Troubleshooting

### Build Fails: "npm run build:all not found"

**Cause**: Backend `package.json` doesn't have `build:all` script

**Fix**:
```json
// backend/package.json
"scripts": {
  "build:all": "npm run build && cd ../frontend && npm run build"
}
```

### Build Fails: "DATABASE_URL not set"

**Cause**: Environment variable not configured in Netlify

**Fix**:
1. Go to **Site settings** → **Environment**
2. Add `DATABASE_URL` variable
3. Redeploy

### Frontend 404 Errors

**Cause**: Next.js routing not configured properly

**Fix**: Ensure `netlify.toml` has:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### API Calls Fail (404)

**Cause**: API routes not accessible through Netlify Functions

**Fix**: Ensure backend `netlify.toml` has:
```toml
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/server:path"
  status = 200
```

### Prisma Migration Fails

**Cause**: DATABASE_URL not available during build

**Fix**:
1. Ensure DATABASE_URL is set in Netlify environment variables
2. Run migrations manually after deployment:
   ```bash
   DATABASE_URL=your-url npx prisma migrate deploy
   ```

### Slow Build Times

**Optimize**:
1. Clear build cache: **Deployments** → **Clear cache and redeploy**
2. Optimize dependencies in `package.json`
3. Use `.vercelignore` to exclude unnecessary files
4. Enable build cache in Netlify settings

---

## Custom Domain

1. Go to **Site settings** → **Domain management**
2. Click **Add domain**
3. Enter your domain (e.g., `bgv-platform.com`)
4. Follow DNS configuration steps
5. Update `FRONTEND_URL` in environment variables

---

## Rollback to Previous Deployment

1. Go to **Deployments**
2. Click on previous deployment
3. Click **...** → **Redeploy this**

---

## Security Checklist

- [ ] All environment variables configured
- [ ] `NODE_ENV=production` set
- [ ] Database backups enabled
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] JWT secret is strong (32+ characters)
- [ ] HTTPS enforced
- [ ] Custom domain configured
- [ ] Error logging enabled

---

## Performance Optimization

### Frontend
- Enable Next.js image optimization
- Use code splitting
- Enable compression in Netlify
- Set proper cache headers

### Backend
- Use connection pooling for database
- Enable response compression
- Implement caching headers
- Use Redis for session storage

### Database
- Use read replicas for scaling
- Enable query logging
- Monitor slow queries
- Regular backups

---

## Useful Links

- [Netlify Documentation](https://docs.netlify.com)
- [Netlify Functions Guide](https://docs.netlify.com/functions/overview)
- [Next.js on Netlify](https://docs.netlify.com/integrations/frameworks/next-js)
- [Environment Variables](https://docs.netlify.com/environment-variables/overview)
- [Custom Domains](https://docs.netlify.com/domains-https/custom-domains)

---

## Support

For issues:
1. Check build logs in Netlify dashboard
2. Review this troubleshooting section
3. Check [Netlify Community](https://answers.netlify.com)
4. Contact Netlify support
