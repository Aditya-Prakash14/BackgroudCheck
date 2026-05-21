import axios from 'axios';
import { prisma } from '../prisma/client';
import { config } from '../config/env';

// URLs are read lazily at call-time so that test environments can override
// process.env.AADHAAR_API_URL / process.env.PAN_API_URL before invoking the service.
const getAadhaarApiUrl = () => {
  const url = process.env.AADHAAR_API_URL ||
    config.aadhaarApiUrl ||
    'http://localhost:5001/mock-api/aadhaar/verify';
  
  // If URL is relative (starts with /), construct full URL using backend URL
  if (url.startsWith('/')) {
    const backendUrl = process.env.NODE_ENV === 'production' 
      ? `https://${process.env.VERCEL_URL || 'backgroud-check-tjp2.vercel.app'}`
      : 'http://localhost:5001';
    return `${backendUrl}${url}`;
  }
  
  return url;
};

const getPanApiUrl = () => {
  const url = process.env.PAN_API_URL ||
    config.panApiUrl ||
    'http://localhost:5001/mock-api/pan/verify';
  
  // If URL is relative (starts with /), construct full URL using backend URL
  if (url.startsWith('/')) {
    const backendUrl = process.env.NODE_ENV === 'production' 
      ? `https://${process.env.VERCEL_URL || 'backgroud-check-tjp2.vercel.app'}`
      : 'http://localhost:5001';
    return `${backendUrl}${url}`;
  }
  
  return url;
};

const verifyAadhaarApi = async (aadhaarNumber: string) => {
  try {
    const url = getAadhaarApiUrl();
    console.log(`[Verification] Calling Aadhaar API: ${url}`);
    const { data } = await axios.post(url, { aadhaarNumber });
    return data;
  } catch (err: any) {
    console.error('[Verification] Aadhaar API error:', err.message);
    return { status: 'failed', message: 'Connection to Aadhaar service failed' };
  }
};

const verifyPanApi = async (panNumber: string) => {
  try {
    const url = getPanApiUrl();
    console.log(`[Verification] Calling PAN API: ${url}`);
    const { data } = await axios.post(url, { panNumber });
    return data;
  } catch (err: any) {
    console.error('[Verification] PAN API error:', err.message);
    return { status: 'failed', message: 'Connection to PAN service failed' };
  }
};

export const runVerification = async (candidateId: string, userId: string) => {
  const candidate = await prisma.candidate.findFirst({
    where: { id: candidateId, createdById: userId },
  });

  if (!candidate) {
    const error = new Error('Candidate not found') as any;
    error.status = 404;
    throw error;
  }

  // Run in parallel
  const [aadhaarResult, panResult] = await Promise.all([
    verifyAadhaarApi(candidate.aadhaarNumber),
    verifyPanApi(candidate.panNumber),
  ]);

  // Insert verification logs in database (avoid raw sensitive Aadhaar data in request log)
  const maskedAadhaarReq = `XXXX-XXXX-${candidate.aadhaarNumber.slice(-4)}`;

  await prisma.verificationLog.createMany({
    data: [
      {
        candidateId,
        verificationType: 'AADHAAR',
        requestPayload: { aadhaarNumber: maskedAadhaarReq },
        responsePayload: aadhaarResult,
        verificationStatus: aadhaarResult.status, // 'verified' or 'failed'
      },
      {
        candidateId,
        verificationType: 'PAN',
        requestPayload: { panNumber: candidate.panNumber },
        responsePayload: panResult,
        verificationStatus: panResult.status, // 'verified' or 'failed'
      },
    ],
  });

  // Calculate overall status
  const aadhaarOk = aadhaarResult.status === 'verified';
  const panOk = panResult.status === 'verified';

  let overallStatus = 'PENDING';
  if (aadhaarOk && panOk) {
    overallStatus = 'VERIFIED';
  } else if (!aadhaarOk && !panOk) {
    overallStatus = 'FAILED';
  } else {
    overallStatus = 'PARTIAL';
  }

  // Update candidate status
  const updatedCandidate = await prisma.candidate.update({
    where: { id: candidateId },
    data: { status: overallStatus },
  });

  return {
    candidateId,
    overallStatus,
    aadhaarResult,
    panResult,
  };
};
