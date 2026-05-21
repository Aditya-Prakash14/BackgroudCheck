import dotenv from 'dotenv';
import path from 'path';

// Load environmental variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  jwtSecret: process.env.JWT_SECRET || 'default_super_secret_for_signing_bgv_tokens',
  databaseUrl: process.env.DATABASE_URL || '',
  aadhaarApiUrl: process.env.AADHAAR_API_URL || 'http://localhost:5001/mock-api/aadhaar/verify',
  panApiUrl: process.env.PAN_API_URL || 'http://localhost:5001/mock-api/pan/verify',
  frontendUrl: process.env.FRONTEND_URL || 'https://bgv-platform.vercel.app',
  port: Number(process.env.PORT) || 5001,
  nodeEnv: process.env.NODE_ENV || 'development'
};

export const validateEnv = (): void => {
  const missing: string[] = [];
  if (!process.env.DATABASE_URL) missing.push('DATABASE_URL');
  if (!process.env.JWT_SECRET) missing.push('JWT_SECRET');

  if (missing.length > 0) {
    throw new Error(`CRITICAL STARTUP ERROR: Missing required env vars: ${missing.join(', ')}`);
  }
};
