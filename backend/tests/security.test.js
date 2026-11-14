import { describe, it } from 'node:test';
import assert from 'node:assert';
import { sanitizeInputs, secureErrorHandler } from '../src/middleware/security.js';

describe('🛡️ Security & Hardening Middleware Unit Tests', () => {

  describe('Input Sanitization & Anti-Injection', () => {
    it('should strip malicious script tags and inline handlers from request body', () => {
      const mockReq = {
        body: {
          name: '<script>alert("xss")</script>John Doe',
          role: 'Admin" onmouseover="malicious()',
          nested: {
            bio: '<iframe src="evil.com"></iframe>Developer',
          },
        },
        query: {
          search: '"><script>document.cookie</script>',
        },
      };

      const mockRes = {};
      let nextCalled = false;
      const mockNext = () => { nextCalled = true; };

      sanitizeInputs(mockReq, mockRes, mockNext);

      assert.strictEqual(nextCalled, true, 'next() must be called');
      assert.strictEqual(mockReq.body.name, 'alert(xss)John Doe', 'Script tags and quotes must be neutralized');
      assert.strictEqual(mockReq.body.role, 'Admin', 'Inline event handler attribute and quotes must be stripped');
      assert.strictEqual(mockReq.body.nested.bio, 'Developer', 'Iframe tags must be stripped');
      assert.strictEqual(mockReq.query.search, 'document.cookie', 'Query script tags must be stripped');
    });

    it('should prevent prototype pollution in request objects', () => {
      const mockReq = {
        body: JSON.parse('{"__proto__": {"polluted": true}, "name": "Safe User"}'),
      };
      const mockRes = {};
      sanitizeInputs(mockReq, mockRes, () => {});

      assert.strictEqual(mockReq.body.__proto__.polluted, undefined, 'Prototype pollution must be blocked');
      assert.strictEqual(mockReq.body.name, 'Safe User');
    });
  });

  describe('Secure Error Handling', () => {
    it('should mask internal stack traces and server file paths from 500 error responses', () => {
      const mockErr = new Error('Database disk failure at /var/data/internal.db');
      mockErr.stack = 'Error: Database disk failure\n    at internalFunction (/var/data/secret.js:42:10)';

      let statusCode = null;
      let jsonPayload = null;

      const mockRes = {
        status: (code) => {
          statusCode = code;
          return {
            json: (payload) => { jsonPayload = payload; },
          };
        },
      };

      const mockReq = { method: 'GET', url: '/api/test' };

      secureErrorHandler(mockErr, mockReq, mockRes, () => {});

      assert.strictEqual(statusCode, 500, 'Status should be 500');
      assert.strictEqual(jsonPayload.success, false);
      assert.ok(!JSON.stringify(jsonPayload).includes('/var/data/'), 'Must not leak file system paths');
      assert.ok(!JSON.stringify(jsonPayload).includes('secret.js'), 'Must not leak internal stack traces');
      assert.strictEqual(jsonPayload.message, 'An unexpected error occurred. The incident has been safely logged.');
    });
  });

});
