import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.routes';
import candidateRoutes from './routes/candidate.routes';
import verificationRoutes from './routes/verification.routes';
import reportRoutes from './routes/report.routes';
import dashboardRoutes from './routes/dashboard.routes';

import { errorHandler } from './middleware/error.handler';
import { config } from './config/env';

const app = express();

// Security middlewares
app.use(helmet());

// CORS configuration - Allow all Vercel preview and production URLs
const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    // Always allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow all Vercel URLs, localhost, and configured frontend URL
    const allowedOrigins = [
      'backgroud-check.vercel.app',
      'backgroud-check-tjp2.vercel.app',
      'backgroud-check-frontend1.vercel.app',
      'backgroud-check-frontend.vercel.app',
      'bgv-platform.vercel.app',
      'localhost',
      '127.0.0.1',
      config.frontendUrl,
    ];

    const isAllowed = allowedOrigins.some(allowed => 
      origin === `https://${allowed}` || 
      origin === `http://${allowed}` ||
      origin.includes(allowed)
    );

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
});
app.use('/api/', limiter);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'BGV Platform API',
    version: '1.0.0',
    status: 'running',
    docs: 'See /api/health and /api/* endpoints',
    endpoints: {
      auth: '/api/auth',
      candidates: '/api/candidates',
      verifications: '/api/verifications',
      reports: '/api/reports',
      dashboard: '/api/dashboard',
      health: '/api/health'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Mount APIs
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/verifications', verificationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ── Built-in Mock Verification APIs ───────────────────
// These mock APIs simulate a Government database verify check.
app.post('/mock-api/aadhaar/verify', (req, res) => {
  const { aadhaarNumber } = req.body;

  if (!aadhaarNumber) {
    return res.status(400).json({ status: 'failed', message: 'Aadhaar number is required' });
  }

  const cleanNum = String(aadhaarNumber).replace(/\s/g, '');
  const isValidFormat = /^\d{12}$/.test(cleanNum);

  // For simulation purposes:
  // If number starts with "0", let's fail it to demonstrate verification failures.
  if (isValidFormat && !cleanNum.startsWith('0')) {
    return res.status(200).json({
      status: 'verified',
      nameMatch: true,
      dobMatch: true,
      genderMatch: true,
      message: 'Aadhaar KYC verified successfully via UIDAI'
    });
  } else {
    return res.status(200).json({
      status: 'failed',
      message: 'Aadhaar card details do not match or format is invalid'
    });
  }
});

app.post('/mock-api/pan/verify', (req, res) => {
  const { panNumber } = req.body;

  if (!panNumber) {
    return res.status(400).json({ status: 'failed', message: 'PAN number is required' });
  }

  const cleanPan = String(panNumber).trim().toUpperCase();
  const isValidFormat = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleanPan);

  // If PAN starts with "Z", let's fail it to show failures.
  if (isValidFormat && !cleanPan.startsWith('Z')) {
    return res.status(200).json({
      status: 'verified',
      panStatus: 'active',
      nameMatch: true,
      message: 'PAN status matches Income Tax Department record'
    });
  } else {
    return res.status(200).json({
      status: 'failed',
      message: 'PAN number is invalid or inactive'
    });
  }
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    code: 'NOT_FOUND',
    message: `Route ${req.method} ${req.path} not found`,
    path: req.path,
  });
});

// Global error handler
app.use(errorHandler);

export default app;
