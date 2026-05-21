import axios from 'axios';
import { prisma } from '../prisma/client';
import { config } from '../config/env';

// URLs are read lazily at call-time so that test environments can override
// process.env.AADHAAR_API_URL / process.env.PAN_API_URL before invoking the service.
const getAadhaarApiUrl = () =>
  process.env.AADHAAR_API_URL ||
  config.aadhaarApiUrl ||
  'http://localhost:5000/mock-api/aadhaar/verify';

const getPanApiUrl = () =>
  process.env.PAN_API_URL ||
  config.panApiUrl ||
  'http://localhost:5000/mock-api/pan/verify';

const verifyAadhaarApi = async (aadhaarNumber: string) => {
  try {
    const { data } = await axios.post(getAadhaarApiUrl(), { aadhaarNumber });
    return data;
  } catch (err: any) {
    return { status: 'failed', message: 'Connection to Aadhaar service failed' };
  }
};

const verifyPanApi = async (panNumber: string) => {
  try {
    const { data } = await axios.post(getPanApiUrl(), { panNumber });
    return data;
  } catch (err: any) {
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
