import request from 'supertest';
import app from '../app';
import { prisma } from '../prisma/client';

describe('Auth Integration Tests', () => {
  const testEmail = `test_${Date.now()}@bgv.com`;
  const testPassword = 'Password@123';

  afterAll(async () => {
    // Cleanup the database user we created
    await prisma.user.deleteMany({
      where: {
        email: testEmail,
      },
    });
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test Recruiter',
          email: testEmail,
          password: testPassword,
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message');
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.email).toBe(testEmail);
      expect(res.body.data).not.toHaveProperty('passwordHash');
    });

    it('should fail to register a user with duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Another Name',
          email: testEmail,
          password: testPassword,
        });

      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login and return a JWT token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: testPassword,
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe(testEmail);
    });

    it('should fail with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'WrongPassword@123',
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });
});
