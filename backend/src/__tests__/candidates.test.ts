import request from 'supertest';
import app from '../app';
import { prisma } from '../prisma/client';

describe('Candidates CRUD Integration Tests', () => {
  let token: string;
  let userId: string;
  let candidateId: string;

  const testEmail = `admin_${Date.now()}@bgv.com`;
  const candidateEmail = `candidate_${Date.now()}@test.com`;

  beforeAll(async () => {
    // 1. Create a user and login to get the JWT
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Admin Test',
        email: testEmail,
        password: 'Password@123',
      });
    userId = regRes.body.data.id;

    const logRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: 'Password@123',
      });
    token = logRes.body.token;
  });

  afterAll(async () => {
    // Clean up
    await prisma.verificationLog.deleteMany({
      where: {
        candidate: {
          createdById: userId,
        },
      },
    });
    await prisma.candidate.deleteMany({
      where: {
        createdById: userId,
      },
    });
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    await prisma.$disconnect();
  });

  describe('POST /api/candidates', () => {
    it('should block creation without token', async () => {
      const res = await request(app)
        .post('/api/candidates')
        .send({
          fullName: 'Test Candidate',
          email: candidateEmail,
          phone: '9988776655',
          aadhaarNumber: '112233445566',
          panNumber: 'ABCDE1234F',
          dob: '1995-10-10',
          address: 'Test address long enough to pass.',
        });

      expect(res.status).toBe(401);
    });

    it('should fail if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/candidates')
        .set('Authorization', `Bearer ${token}`)
        .send({
          fullName: 'Test Candidate',
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should create candidate successfully when valid details are sent', async () => {
      const res = await request(app)
        .post('/api/candidates')
        .set('Authorization', `Bearer ${token}`)
        .send({
          fullName: 'Test Candidate',
          email: candidateEmail,
          phone: '9988776655',
          aadhaarNumber: '112233445566',
          panNumber: 'ABCDE1234F',
          dob: '1995-10-10',
          address: 'Test address long enough to pass.',
        });

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty('id');
      candidateId = res.body.data.id;
    });
  });

  describe('GET /api/candidates', () => {
    it('should retrieve a paginated list of candidates', async () => {
      const res = await request(app)
        .get('/api/candidates?page=1&limit=10')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('candidates');
      expect(res.body.data.candidates.length).toBeGreaterThan(0);
    });

    it('should respect searching keywords', async () => {
      const res = await request(app)
        .get('/api/candidates?search=Test')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.candidates[0].fullName).toContain('Test');
    });
  });

  describe('GET /api/candidates/:id', () => {
    it('should return candidate details and mask the Aadhaar', async () => {
      const res = await request(app)
        .get(`/api/candidates/${candidateId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(candidateId);
      expect(res.body.data.aadhaarNumber).toBe('XXXX-XXXX-5566'); // Masked last 4
      expect(res.body.data).toHaveProperty('verificationLogs');
    });

    it('should fail with 404 for unknown candidate id', async () => {
      const uuid = '00000000-0000-0000-0000-000000000000';
      const res = await request(app)
        .get(`/api/candidates/${uuid}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/candidates/:id', () => {
    it('should delete candidate successfully and return success message', async () => {
      const res = await request(app)
        .delete(`/api/candidates/${candidateId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('deleted');
    });
  });
});
