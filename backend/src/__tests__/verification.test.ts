import request from 'supertest';
import http from 'http';
import net from 'net';
import app from '../app';
import { prisma } from '../prisma/client';

/** Pick a random available port so we never conflict with other test suites. */
function getFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(0, () => {
      const addr = srv.address() as net.AddressInfo;
      srv.close(() => resolve(addr.port));
    });
    srv.on('error', reject);
  });
}

describe('Verification Run Integration Tests', () => {
  let server: http.Server;
  let port: number;
  let token: string;
  let userId: string;
  let candidateId: string;

  const testEmail = `admin_v_${Date.now()}@bgv.com`;
  const candidateEmail = `candidate_v_${Date.now()}@test.com`;

  beforeAll(async () => {
    // 1. Find a free port
    port = await getFreePort();

    // 2. Override env URLs BEFORE the service reads them (lazy getters read process.env each call)
    process.env.AADHAAR_API_URL = `http://localhost:${port}/mock-api/aadhaar/verify`;
    process.env.PAN_API_URL = `http://localhost:${port}/mock-api/pan/verify`;

    // 3. Start a real HTTP server on that port so axios can connect
    await new Promise<void>((resolve, reject) => {
      server = app.listen(port, () => resolve());
      server.on('error', reject);
    });

    // 4. Register
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Verifier Test', email: testEmail, password: 'Password@123' });
    userId = regRes.body.data?.id;

    // 5. Login
    const logRes = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: 'Password@123' });
    token = logRes.body.token;

    // 6. Create candidate with valid formats → mock endpoint will return VERIFIED
    const candRes = await request(app)
      .post('/api/candidates')
      .set('Authorization', `Bearer ${token}`)
      .send({
        fullName: 'John Doe',
        email: candidateEmail,
        phone: '9988776655',
        aadhaarNumber: '112233445566', // does not start with 0 → verified
        panNumber: 'ABCDE1234F',        // does not start with Z → verified
        dob: '1995-10-10',
        address: 'Test address long enough to pass.',
      });
    candidateId = candRes.body.data?.id;
  });

  afterAll(async () => {
    // Clean up DB records created by this suite
    if (userId) {
      await prisma.verificationLog.deleteMany({
        where: { candidate: { createdById: userId } },
      });
      await prisma.candidate.deleteMany({
        where: { createdById: userId },
      });
      await prisma.user.delete({ where: { id: userId } });
    }
    await prisma.$disconnect();

    // Close the real server
    if (server) {
      await new Promise<void>((resolve, reject) =>
        server.close((err) => (err ? reject(err) : resolve()))
      );
    }

    // Restore env
    delete process.env.AADHAAR_API_URL;
    delete process.env.PAN_API_URL;
  });

  describe('POST /api/verifications/:id/start', () => {
    it('should run parallel checks and mark candidate as VERIFIED', async () => {
      expect(candidateId).toBeDefined();

      const res = await request(app)
        .post(`/api/verifications/${candidateId}/start`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('completed');
      expect(res.body.data.overallStatus).toBe('VERIFIED');
      expect(res.body.data.aadhaarResult.status).toBe('verified');
      expect(res.body.data.panResult.status).toBe('verified');

      // Assert DB was updated
      const dbCand = await prisma.candidate.findUnique({ where: { id: candidateId } });
      expect(dbCand?.status).toBe('VERIFIED');

      // Assert two audit logs created (Aadhaar + PAN)
      const logs = await prisma.verificationLog.findMany({ where: { candidateId } });
      expect(logs.length).toBe(2);
    });

    it('should return 404 for an unknown candidate id', async () => {
      const unknownUUID = '00000000-0000-0000-0000-000000000000';
      const res = await request(app)
        .post(`/api/verifications/${unknownUUID}/start`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });
});
