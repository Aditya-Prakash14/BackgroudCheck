# BGV Platform - Full Stack Background Verification System

A comprehensive, production-ready Background Verification (BGV) platform with a modern Next.js frontend and robust Node.js/Express backend. Designed for seamless deployment on Vercel with integrated database, authentication, and verification services.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)

## 🎯 Overview

BGV Platform is a full-stack background verification system that streamlines the process of conducting background checks on candidates. It features a responsive web interface built with Next.js and a powerful API backend built with Express and Prisma, providing secure authentication, candidate management, and verification workflows.

**Live Demo**: [Deployed on Vercel](https://bgv-platform.vercel.app)  
**GitHub**: [Aditya-Prakash14/BackgroudCheck](https://github.com/Aditya-Prakash14/BackgroudCheck)

## ✨ Features

- **Authentication & Authorization**: JWT-based authentication with secure password hashing using bcryptjs
- **Candidate Management**: Create, read, update, and manage candidate information
- **Verification Services**: Aadhaar and PAN verification integration
- **Dashboard Analytics**: Real-time dashboard with statistics and metrics
- **Report Generation**: Generate and retrieve background verification reports
- **Rate Limiting**: API rate limiting for security
- **CORS Support**: Configured CORS for frontend integration
- **Error Handling**: Comprehensive error handling and validation
- **Security**: Helmet.js for HTTP headers security
- **Testing**: Jest with Supertest for unit and integration tests

## 📦 Prerequisites

- Node.js >= 16.x
- npm or yarn
- PostgreSQL (for database)
- Git

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:Aditya-Prakash14/BackgroudCheck.git
   cd BackgroudCheck/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Set up the database**
   ```bash
   npm run prisma:migrate
   npm run prisma:seed
   ```

5. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```

## ⚙️ Configuration

Create a `.env` file in the root directory with the following environment variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/bgv_db"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# API URLs
AADHAAR_API_URL="http://localhost:5000/mock-api/aadhaar/verify"
PAN_API_URL="http://localhost:5000/mock-api/pan/verify"

# Frontend URL
FRONTEND_URL="http://localhost:3000"

# Server Configuration
PORT=5000
NODE_ENV="development"
```

### Environment Variables Explanation

- **DATABASE_URL**: PostgreSQL connection string (required)
- **JWT_SECRET**: Secret key for signing JWT tokens (required)
- **AADHAAR_API_URL**: External API endpoint for Aadhaar verification
- **PAN_API_URL**: External API endpoint for PAN verification
- **FRONTEND_URL**: Frontend application URL for CORS
- **PORT**: Server port (default: 5000)
- **NODE_ENV**: Application environment (development/production)

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.ts                 # Express app configuration
│   ├── server.ts              # Server entry point
│   ├── config/
│   │   └── env.ts             # Environment configuration
│   ├── controllers/           # Route controllers
│   │   ├── auth.controller.ts
│   │   ├── candidate.controller.ts
│   │   ├── dashboard.controller.ts
│   │   ├── report.controller.ts
│   │   └── verification.controller.ts
│   ├── routes/                # API routes
│   │   ├── auth.routes.ts
│   │   ├── candidate.routes.ts
│   │   ├── dashboard.routes.ts
│   │   ├── report.routes.ts
│   │   └── verification.routes.ts
│   ├── services/              # Business logic services
│   │   ├── auth.service.ts
│   │   ├── candidate.service.ts
│   │   ├── report.service.ts
│   │   └── verification.service.ts
│   ├── middleware/            # Express middleware
│   │   ├── auth.middleware.ts
│   │   └── error.handler.ts
│   ├── prisma/
│   │   └── client.ts          # Prisma client initialization
│   ├── utils/
│   │   └── mask.ts            # Utility functions
│   └── __tests__/             # Test files
│       ├── auth.test.ts
│       ├── candidates.test.ts
│       └── verification.test.ts
├── prisma/
│   ├── schema.prisma          # Prisma data model
│   ├── seed.ts                # Database seeding script
│   └── migrations/            # Database migrations
├── .gitignore                 # Git ignore rules
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── jest.config.ts             # Jest testing configuration
└── README.md                  # This file
```

## 🔌 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| GET | `/api/auth/profile` | Get user profile | Yes |

### Candidate Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/candidates` | Get all candidates | Yes |
| POST | `/api/candidates` | Create new candidate | Yes |
| GET | `/api/candidates/:id` | Get candidate details | Yes |
| PUT | `/api/candidates/:id` | Update candidate | Yes |
| DELETE | `/api/candidates/:id` | Delete candidate | Yes |

### Verification Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/verification/aadhaar` | Verify Aadhaar | Yes |
| POST | `/api/verification/pan` | Verify PAN | Yes |
| GET | `/api/verification/:id` | Get verification status | Yes |

### Dashboard Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/dashboard/stats` | Get dashboard statistics | Yes |
| GET | `/api/dashboard/recent` | Get recent candidates | Yes |

### Report Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/reports/generate` | Generate BGV report | Yes |
| GET | `/api/reports/:id` | Get report details | Yes |
| GET | `/api/reports` | List all reports | Yes |

## 🛠 Tech Stack

### Frontend
- **Next.js 16** - React framework for production
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Performant form library
- **Zod** - TypeScript-first schema validation
- **Zustand** - State management
- **Recharts** - Composable charting library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **Prisma ORM** - Type-safe database client
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **Jest** - Testing framework

### Infrastructure
- **Vercel** - Frontend & API deployment
- **PostgreSQL** - Managed database
- **GitHub** - Version control

## 📁 Project Structure

```
bgv-platform/
├── frontend/                  # Next.js frontend application
│   ├── src/
│   │   ├── app/              # Next.js app directory
│   │   ├── components/       # Reusable React components
│   │   ├── services/         # API client services
│   │   ├── store/            # Zustand state management
│   │   └── validations/      # Zod schema validation
│   ├── package.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── README.md
│
├── backend/                   # Express.js API backend
│   ├── src/
│   │   ├── app.ts            # Express app configuration
│   │   ├── server.ts         # Server entry point
│   │   ├── config/           # Configuration files
│   │   ├── controllers/      # Route handlers
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── middleware/       # Express middleware
│   │   ├── prisma/           # Prisma client
│   │   ├── utils/            # Utility functions
│   │   └── __tests__/        # Test files
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   ├── seed.ts           # Seed script
│   │   └── migrations/       # Database migrations
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.ts
│   └── README.md
│
├── vercel.json                # Vercel configuration
├── .vercelignore             # Files to ignore in Vercel build
├── .gitignore                # Git ignore rules
└── README.md                 # This file
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

The project is optimized for Vercel deployment with zero-config setup.

#### Prerequisites
- GitHub account with the repository
- Vercel account (free tier available)
- PostgreSQL database (Vercel Postgres or external)

#### Step-by-Step Deployment

1. **Push code to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**
   - In Vercel Dashboard → Project Settings → Environment Variables
   - Add the following:
     ```
     DATABASE_URL=postgresql://...
     JWT_SECRET=your-secret-key
     AADHAAR_API_URL=your-api-url
     PAN_API_URL=your-api-url
     FRONTEND_URL=https://your-domain.vercel.app
     NODE_ENV=production
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build and deployment to complete
   - Your app is live!

#### Auto-Deployment
Every push to `main` branch automatically triggers a new deployment.

#### Custom Domain
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Local Development

#### Prerequisites
- Node.js 16+
- PostgreSQL running locally or via Docker
- Git

#### Setup

```bash
# Clone repository
git clone git@github.com:Aditya-Prakash14/BackgroudCheck.git
cd BackgroudCheck

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

#### Environment Setup

**Backend (.env)**
```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials
```

**Frontend (.env.local)**
```bash
cd frontend
cp .env.example .env.local
# Edit with your API endpoint (usually http://localhost:5000)
```

#### Run Locally

**Terminal 1 - Backend**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend**
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

#### Database Setup
```bash
cd backend

# Run migrations
npm run prisma:migrate

# Seed sample data
npm run prisma:seed

# Open Prisma Studio GUI
npx prisma studio
```

#### Run Tests
```bash
cd backend
npm test                      # Run all tests
npm test -- --coverage       # With coverage report
```

## 🔌 API Documentation

Complete API documentation is available in [backend/README.md](backend/README.md#-api-endpoints)

### Quick API Test
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get candidates (with JWT token)
curl -X GET http://localhost:5000/api/candidates \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🏃 Available Commands

### Frontend
```bash
cd frontend
npm run dev       # Start development server
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run ESLint
```

### Backend
```bash
cd backend
npm run dev              # Start development with hot-reload
npm run build           # Build TypeScript
npm start               # Start production server
npm test                # Run tests
npm run prisma:migrate  # Run database migrations
npm run prisma:seed     # Seed database
```

## 📚 Documentation

- [Backend Documentation](backend/README.md) - API endpoints, setup, architecture
- [Frontend Documentation](frontend/README.md) - UI components, setup
- [Deployment Guide](DEPLOYMENT.md) - Detailed deployment instructions

## 🛡️ Security

- JWT-based authentication
- Password hashing with bcryptjs
- CORS protection
- Rate limiting
- Helmet.js for HTTP headers
- Environment variables for sensitive data
- SQL injection prevention via Prisma
- HTTPS enforced in production

## 🤝 Contributing

1. Create a feature branch
   ```bash
   git checkout -b feature/your-feature
   ```

2. Commit your changes
   ```bash
   git commit -m "feat: add your feature"
   ```

3. Push to GitHub
   ```bash
   git push origin feature/your-feature
   ```

4. Create a Pull Request

### Commit Message Convention
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation
- `test:` - Tests
- `refactor:` - Code refactoring
- `chore:` - Maintenance

## 📝 License

ISC

## 👤 Author

Aditya Prakash

## 📞 Support

- 🐛 [Report a bug](https://github.com/Aditya-Prakash14/BackgroudCheck/issues)
- 💡 [Request a feature](https://github.com/Aditya-Prakash14/BackgroudCheck/issues)
- 📧 Contact via GitHub

---

**Last Updated**: May 2026  
**Status**: ✅ Production Ready for Vercel Deployment
