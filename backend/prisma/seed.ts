import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Admin
  const email = 'admin@bgv.com';
  const passwordHash = await bcrypt.hash('Admin@123', 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: 'Admin User',
      email,
      passwordHash,
      role: 'admin',
    },
  });

  console.log('Admin user created:', admin.email);

  // Clean candidates if any exist (optional, let's just insert)
  await prisma.verificationLog.deleteMany({});
  await prisma.candidate.deleteMany({});

  // 2. Create Candidates
  // Candidate 1: VERIFIED
  const c1 = await prisma.candidate.create({
    data: {
      fullName: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '9876543210',
      aadhaarNumber: '123456789012',
      panNumber: 'ABCDE1234F',
      dob: new Date('1990-05-15'),
      address: '123, Park Street, Connaught Place, New Delhi, 110001',
      status: 'VERIFIED',
      createdById: admin.id,
    },
  });

  // Candidate 2: FAILED (Use numbers starting with 0 / Z to trigger mocks, or set failed manually)
  const c2 = await prisma.candidate.create({
    data: {
      fullName: 'Priya Patel',
      email: 'priya.patel@example.com',
      phone: '9812345678',
      aadhaarNumber: '098765432109', // Starts with 0 -> fails mock
      panNumber: 'ZBCDE9876A', // Starts with Z -> fails mock
      dob: new Date('1993-11-22'),
      address: 'Flat 402, Sunshine Heights, Juhu, Mumbai, 400049',
      status: 'FAILED',
      createdById: admin.id,
    },
  });

  // Candidate 3: PENDING
  const c3 = await prisma.candidate.create({
    data: {
      fullName: 'Amit Kumar',
      email: 'amit.kumar@example.com',
      phone: '7011223344',
      aadhaarNumber: '556677889900',
      panNumber: 'PTYUI9081Q',
      dob: new Date('1995-08-01'),
      address: 'House No 12, Sector 15, Gurgaon, Haryana, 122001',
      status: 'PENDING',
      createdById: admin.id,
    },
  });

  console.log('Sample candidates created.');

  // 3. Create Verification Logs
  // Logs for Rahul (VERIFIED)
  await prisma.verificationLog.createMany({
    data: [
      {
        candidateId: c1.id,
        verificationType: 'AADHAAR',
        requestPayload: { aadhaarNumber: 'XXXX-XXXX-9012' },
        responsePayload: {
          status: 'verified',
          nameMatch: true,
          dobMatch: true,
          genderMatch: true,
          message: 'Aadhaar KYC verified successfully via UIDAI',
        },
        verificationStatus: 'verified',
        verifiedAt: new Date(),
      },
      {
        candidateId: c1.id,
        verificationType: 'PAN',
        requestPayload: { panNumber: 'ABCDE1234F' },
        responsePayload: {
          status: 'verified',
          panStatus: 'active',
          nameMatch: true,
          message: 'PAN status matches Income Tax Department record',
        },
        verificationStatus: 'verified',
        verifiedAt: new Date(),
      },
    ],
  });

  // Logs for Priya (FAILED)
  await prisma.verificationLog.createMany({
    data: [
      {
        candidateId: c2.id,
        verificationType: 'AADHAAR',
        requestPayload: { aadhaarNumber: 'XXXX-XXXX-2109' },
        responsePayload: {
          status: 'failed',
          message: 'Aadhaar card details do not match or format is invalid',
        },
        verificationStatus: 'failed',
        verifiedAt: new Date(),
      },
      {
        candidateId: c2.id,
        verificationType: 'PAN',
        requestPayload: { panNumber: 'ZBCDE9876A' },
        responsePayload: {
          status: 'failed',
          message: 'PAN number is invalid or inactive',
        },
        verificationStatus: 'failed',
        verifiedAt: new Date(),
      },
    ],
  });

  console.log('Sample verification logs added.');
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
