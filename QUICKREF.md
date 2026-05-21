# BGV Platform - Quick Reference Guide

## 🚀 Getting Started

### First Time Setup
```bash
bash setup.sh
```

Or manually:
```bash
# Backend
cd backend
npm install
cp .env.example .env
npm run prisma:migrate
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## 📋 Common Commands

### Backend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot-reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm test` | Run all tests |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:seed` | Seed database with sample data |
| `npx prisma studio` | Open Prisma GUI (http://localhost:5555) |
| `npm run prisma:generate` | Generate Prisma client |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (http://localhost:3000) |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

### Git

| Command | Description |
|---------|-------------|
| `git checkout -b feature/name` | Create feature branch |
| `git add .` | Stage changes |
| `git commit -m "feat: description"` | Commit changes |
| `git push origin feature/name` | Push to GitHub |
| `git pull origin main` | Pull latest changes |

## 🔑 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/bgv
JWT_SECRET=your-secret-key
AADHAAR_API_URL=http://localhost:5000/mock-api/aadhaar/verify
PAN_API_URL=http://localhost:5000/mock-api/pan/verify
FRONTEND_URL=http://localhost:3000
PORT=5000
NODE_ENV=development
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_DEBUG=true
```

## 📁 File Locations

| Item | Path |
|------|------|
| Backend code | `backend/src/` |
| Frontend code | `frontend/src/` |
| Database schema | `backend/prisma/schema.prisma` |
| API routes | `backend/src/routes/` |
| Components | `frontend/src/components/` |
| Tests | `backend/src/__tests__/` |

## 🧪 Testing

### Run Tests
```bash
cd backend
npm test                    # Run all tests
npm test -- --watch        # Watch mode
npm test -- --coverage     # With coverage
npm test auth.test.ts      # Specific file
```

### Test Structure
- Authentication: `backend/src/__tests__/auth.test.ts`
- Candidates: `backend/src/__tests__/candidates.test.ts`
- Verification: `backend/src/__tests__/verification.test.ts`

## 🐛 Debugging

### Backend Debugging

**VS Code Launch Configuration** (`.vscode/launch.json`):
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Backend",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/backend/src/server.ts",
      "preLaunchTask": "npm: build",
      "runtimeArgs": ["-r", "ts-node/register"]
    }
  ]
}
```

**console.log() approach:**
```typescript
console.log('Debug:', variableName);
```

### Frontend Debugging

1. Open Chrome DevTools (F12)
2. React DevTools extension
3. Network tab to inspect API calls

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Get profile

### Candidates
- `GET /api/candidates` - List all
- `POST /api/candidates` - Create new
- `GET /api/candidates/:id` - Get details
- `PUT /api/candidates/:id` - Update
- `DELETE /api/candidates/:id` - Delete

### Verification
- `POST /api/verification/aadhaar` - Verify Aadhaar
- `POST /api/verification/pan` - Verify PAN
- `GET /api/verification/:id` - Get status

### Dashboard
- `GET /api/dashboard/stats` - Get statistics
- `GET /api/dashboard/recent` - Recent candidates

### Reports
- `POST /api/reports/generate` - Generate report
- `GET /api/reports` - List reports
- `GET /api/reports/:id` - Get report

## 📊 Database Queries

### Using Prisma Client

```typescript
import prisma from '@/prisma/client';

// Create
await prisma.candidate.create({
  data: { email: 'user@example.com' }
});

// Read
await prisma.candidate.findUnique({
  where: { id: 1 }
});

// Update
await prisma.candidate.update({
  where: { id: 1 },
  data: { status: 'verified' }
});

// Delete
await prisma.candidate.delete({
  where: { id: 1 }
});

// List with filter
await prisma.candidate.findMany({
  where: { status: 'verified' },
  orderBy: { createdAt: 'desc' }
});
```

## 🚀 Deployment Checklist

- [ ] All tests passing: `npm test`
- [ ] Code is committed and pushed to GitHub
- [ ] Environment variables set in Vercel dashboard
- [ ] Database migrations run: `npm run prisma:migrate`
- [ ] No console errors in deployment logs
- [ ] API endpoints responding
- [ ] Frontend loads correctly
- [ ] JWT authentication working

## 🔒 Security Notes

- **Never commit .env file** - Use .env.example
- **Keep JWT_SECRET secure** - Use long random string
- **Validate all inputs** - Server-side validation required
- **Use HTTPS in production** - Vercel handles this
- **Sanitize user data** - Prevent SQL injection
- **Limit API access** - Use rate limiting

## 📚 Documentation

- [Root README](./README.md) - Project overview
- [Backend README](./backend/README.md) - API documentation
- [Frontend README](./frontend/README.md) - UI documentation
- [Deployment Guide](./DEPLOYMENT.md) - Vercel deployment steps

## 🆘 Troubleshooting

### Backend won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check if port 5000 is in use
lsof -i :5000
```

### Database connection error
```bash
# Verify DATABASE_URL is correct
echo $DATABASE_URL

# Test connection
npm run prisma:migrate status
```

### Frontend API calls failing
```bash
# Check NEXT_PUBLIC_API_URL in .env.local
cat frontend/.env.local

# Test backend is running
curl http://localhost:5000/api/health
```

### Port already in use
```bash
# Kill process using port 5000
lsof -ti :5000 | xargs kill -9

# Or use different port
PORT=5001 npm run dev
```

## 📞 Getting Help

1. Check documentation files
2. Review error logs: `vercel logs`
3. Search GitHub issues
4. Create new issue with details

## 📈 Performance Tips

### Frontend
- Use Image optimization: `next/image`
- Lazy load components with `dynamic()`
- Monitor bundle size: `ANALYZE=true npm run build`

### Backend
- Add database indexes on frequently queried fields
- Use caching for repeated queries
- Optimize Prisma queries with `select`

### Database
- Regular vacuum and analyze
- Monitor slow queries
- Backup before major changes

---

**Quick Links:**
- [GitHub Repository](https://github.com/Aditya-Prakash14/BackgroudCheck)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Prisma Studio](#prisma-studio)
- [Local Frontend](http://localhost:3000)
- [Local Backend](http://localhost:5000)
- [Prisma Documentation](https://www.prisma.io/docs)

**Last Updated:** May 2026
