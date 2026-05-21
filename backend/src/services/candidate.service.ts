import { prisma } from '../prisma/client';
import { maskAadhaar } from '../utils/mask';

export interface CreateCandidateInput {
  fullName: string;
  email: string;
  phone: string;
  aadhaarNumber: string;
  panNumber: string;
  dob: string;
  address: string;
}

export const createCandidate = async (data: CreateCandidateInput, userId: string) => {
  return prisma.candidate.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      aadhaarNumber: data.aadhaarNumber,
      panNumber: data.panNumber.toUpperCase(),
      dob: new Date(data.dob),
      address: data.address,
      status: 'PENDING',
      createdById: userId,
    },
  });
};

export const getCandidates = async (
  userId: string,
  page = 1,
  limit = 10,
  search = ''
) => {
  const skip = (page - 1) * limit;
  
  const where = {
    createdById: userId,
    ...(search && {
      OR: [
        { fullName: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
  };

  const [candidates, total] = await Promise.all([
    prisma.candidate.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.candidate.count({ where }),
  ]);

  return {
    candidates: candidates.map((c) => ({
      ...c,
      aadhaarNumber: maskAadhaar(c.aadhaarNumber),
    })),
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

export const getCandidateById = async (id: string, userId: string) => {
  const c = await prisma.candidate.findFirst({
    where: { id, createdById: userId },
    include: {
      verificationLogs: {
        orderBy: { verifiedAt: 'desc' },
      },
    },
  });

  if (!c) {
    const error = new Error('Candidate not found') as any;
    error.status = 404;
    throw error;
  }

  return {
    ...c,
    aadhaarNumber: maskAadhaar(c.aadhaarNumber),
  };
};

export const updateCandidate = async (id: string, data: Partial<CreateCandidateInput>, userId: string) => {
  // Check ownership
  const existing = await prisma.candidate.findFirst({
    where: { id, createdById: userId },
  });

  if (!existing) {
    const error = new Error('Candidate not found') as any;
    error.status = 404;
    throw error;
  }

  // Prep payload
  const updateData: any = { ...data };
  if (data.dob) updateData.dob = new Date(data.dob);
  if (data.panNumber) updateData.panNumber = data.panNumber.toUpperCase();

  const updated = await prisma.candidate.update({
    where: { id },
    data: updateData,
  });

  return {
    ...updated,
    aadhaarNumber: maskAadhaar(updated.aadhaarNumber),
  };
};

export const deleteCandidate = async (id: string, userId: string) => {
  const existing = await prisma.candidate.findFirst({
    where: { id, createdById: userId },
  });

  if (!existing) {
    const error = new Error('Candidate not found') as any;
    error.status = 404;
    throw error;
  }

  // Delete logs manually to enforce cascading relation
  await prisma.verificationLog.deleteMany({ where: { candidateId: id } });
  await prisma.candidate.delete({ where: { id } });
};
