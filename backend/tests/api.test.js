import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import app from '../src/server.js';

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    // Start server on an ephemeral port for testing
    server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

after(async () => {
  await new Promise((resolve) => {
    if (server) {
      server.close(resolve);
    } else {
      resolve();
    }
  });
});

describe('🌐 SkillPath AI Backend API & Integration Tests', () => {

  describe('1. Health & Diagnostics (/api/health)', () => {
    it('should return 200 OK with all 6 multi-agents registered and active', async () => {
      const res = await fetch(`${baseUrl}/api/health`);
      assert.strictEqual(res.status, 200);

      const data = await res.json();
      assert.strictEqual(data.status, 'ok');
      assert.ok(Array.isArray(data.agents), 'Should report agents array');
      assert.strictEqual(data.agents.length, 6, 'Must list all 6 collaborative agents');
      assert.ok(data.security, 'Security posture should be reported');
    });
  });

  describe('2. Authentication & Data Isolation (/api/auth)', () => {
    it('should fetch list of registered demo students (/api/auth/users)', async () => {
      const res = await fetch(`${baseUrl}/api/auth/users`);
      assert.strictEqual(res.status, 200);

      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.ok(Array.isArray(data.students), 'Should return students array');
      assert.ok(data.students.length >= 1, 'Should contain at least default demo students');
    });

    it('should authenticate student by registered email (/api/auth/login)', async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'lingesh@gmail.com' }),
      });

      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.ok(data.userId, 'Must return student userId');
      assert.strictEqual(data.profile.email, 'lingesh@gmail.com');
    });

    it('should support 1-click Google OAuth / Student Provisioning (/api/auth/google-login)', async () => {
      const uniqueEmail = `test.student.${Date.now()}@gmail.com`;
      const res = await fetch(`${baseUrl}/api/auth/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: uniqueEmail,
          name: 'Integration Test Learner',
          targetCareer: 'Full Stack Developer',
          currentSkills: ['Python', 'SQL', 'HTML'],
        }),
      });

      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.ok(data.userId, 'Must provision distinct student userId');
      assert.strictEqual(data.profile.email, uniqueEmail);
    });

    it('should successfully handle student sign-out (/api/auth/logout)', async () => {
      const res = await fetch(`${baseUrl}/api/auth/logout`, { method: 'POST' });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
    });
  });

  describe('3. Student Dashboard & Roadmap (/api/dashboard)', () => {
    it('should return personalized dashboard data matching problem statement metrics', async () => {
      const res = await fetch(`${baseUrl}/api/dashboard?userId=user-lingesh-1`);
      assert.strictEqual(res.status, 200);

      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.ok(data.profile, 'Must include student profile');
      assert.ok(data.matching, 'Must include career matching calculation');
      assert.ok(Array.isArray(data.roadmap), 'Must include personalized roadmap');
      assert.ok(data.stats, 'Must include progress stats');
      assert.strictEqual(typeof data.matching.matchPercentage, 'number');
    });
  });

  describe('4. Assessment Engine (/api/quiz)', () => {
    it('should generate a 3-question MCQ assessment on demand', async () => {
      const res = await fetch(`${baseUrl}/api/quiz/JavaScript?userId=user-lingesh-1`);
      assert.strictEqual(res.status, 200);

      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.quiz.skill, 'JavaScript');
      assert.strictEqual(data.quiz.questions.length, 3);
    });
  });

  describe('5. ATS Resume Architect (/api/resume/generate)', () => {
    it('should generate an ATS-friendly resume tailored to target role', async () => {
      const res = await fetch(`${baseUrl}/api/resume/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole: 'Full Stack Developer',
          experienceLevel: 'Entry-Level / Fresher',
          userId: 'user-lingesh-1',
        }),
      });

      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.ok(data.resume.summary, 'Must include generated resume summary');
      assert.ok(data.resume.atsScore >= 70, 'ATS score must be >= 70');
    });
  });

  describe('6. Conversational AI Mentor (/api/mentor/chat)', () => {
    it('should reply with educational guidance from Flash Pro', async () => {
      const res = await fetch(`${baseUrl}/api/mentor/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'What are the main concepts in Express.js?',
          userId: 'user-lingesh-1',
        }),
      });

      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.ok(data.message || data.reply, 'Should return reply string');
    });
  });

  describe('7. Enterprise Security Suite Verification', () => {
    it('should emit OWASP-recommended HTTP security headers', async () => {
      const res = await fetch(`${baseUrl}/api/health`);
      
      assert.strictEqual(res.headers.get('x-content-type-options'), 'nosniff');
      assert.strictEqual(res.headers.get('x-frame-options'), 'DENY');
      assert.strictEqual(res.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
      assert.ok(res.headers.get('content-security-policy'), 'CSP header must be present');
      assert.ok(res.headers.get('strict-transport-security'), 'HSTS header must be present');
    });

    it('should attach rate limit headers on API requests', async () => {
      const res = await fetch(`${baseUrl}/api/dashboard?userId=user-lingesh-1`);
      assert.ok(res.headers.has('x-ratelimit-limit'), 'Should have X-RateLimit-Limit');
      assert.ok(res.headers.has('x-ratelimit-remaining'), 'Should have X-RateLimit-Remaining');
    });
  });

});
