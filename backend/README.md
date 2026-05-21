# BGV Platform - Backend

A comprehensive Background Verification (BGV) platform backend built with Node.js, TypeScript, Express, and Prisma ORM.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Database](#database)
- [Contributing](#contributing)

## 🎯 Overview

The BGV Platform Backend is a robust API service designed to handle background verification processes. It provides authentication, candidate management, verification workflows, reporting, and dashboard functionality with secure endpoints protected by JWT authentication.

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

## 🏃 Running the Application

### Development

```bash
npm run dev
```

This starts the server with hot-reload using nodemon on `http://localhost:5000`

### Production Build

```bash
npm run build
npm start
```

### API Testing

Once the server is running, you can test endpoints using:

- **cURL**
  ```bash
  curl -X GET http://localhost:5000/api/candidates
  ```

- **Postman**: Import the API endpoints listed above

- **Thunder Client**: VS Code extension for API testing

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

### Test Files

- `src/__tests__/auth.test.ts` - Authentication tests
- `src/__tests__/candidates.test.ts` - Candidate management tests
- `src/__tests__/verification.test.ts` - Verification service tests

## 🗄️ Database

### Prisma Setup

The application uses Prisma ORM for database operations.

#### Generate Prisma Client

```bash
npm run prisma:generate
```

#### Create Database Migrations

```bash
npm run prisma:migrate
```

#### Seed Database

```bash
npm run prisma:seed
```

### Database Schema

View and modify the database schema in `prisma/schema.prisma`. The schema includes models for:

- User (authentication)
- Candidate (BGV applicants)
- Verification (verification records)
- Report (BGV reports)
- And more...

### Prisma Studio (GUI)

```bash
npx prisma studio
```

Opens a visual interface to browse and edit database records at `http://localhost:5555`

## 🛠️ Development Guidelines

### Code Structure

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic and database operations
- **Routes**: Define API endpoints and link to controllers
- **Middleware**: Handle authentication, error handling, logging
- **Utils**: Reusable utility functions

### Making API Requests with JWT

1. Register/Login to get JWT token
2. Include token in Authorization header:
   ```
   Authorization: Bearer <your_jwt_token>
   ```

## 🤝 Contributing

1. Create a feature branch from `main`
   ```bash
   git checkout -b feature/feature-name
   ```

2. Commit your changes
   ```bash
   git commit -m "feat: add feature description"
   ```

3. Push to the branch
   ```bash
   git push origin feature/feature-name
   ```

4. Create a Pull Request to `main`

### Commit Message Convention

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `test:` for testing
- `refactor:` for code refactoring
- `style:` for code style changes
- `chore:` for maintenance tasks

## 📝 License

ISC

## 👤 Author

Aditya Prakash

## 📞 Support

For issues and questions, please create an issue in the repository.

---

**Last Updated**: May 2026
