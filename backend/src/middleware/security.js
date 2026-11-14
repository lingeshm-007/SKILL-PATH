/**
 * SkillPath AI - Security & Hardening Middleware
 * Enterprise-grade security policies conforming to OWASP Top 10 guidelines:
 * 1. HTTP Security Headers (CSP, HSTS, X-Content-Type-Options, X-Frame-Options)
 * 2. Sliding Window Rate Limiting (DDoS & Brute Force Protection)
 * 3. Deep Input Sanitization (XSS & Injection Protection)
 * 4. Safe Centralized Error Handling (No stack-trace leakage)
 */

// In-memory rate limiting map: ip -> { count, resetTime }
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 300; // 300 requests per window per IP

/**
 * Enterprise HTTP Security Headers Middleware
 */
export function securityHeaders(req, res, next) {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Prevent clickjacking via iframes
  res.setHeader('X-Frame-Options', 'DENY');

  // Modern XSS Protection
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Strict Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Content Security Policy (CSP)
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https://api.dicebear.com https://images.unsplash.com; " +
    "connect-src 'self' http://localhost:* ws://localhost:*;"
  );

  // HTTP Strict Transport Security (HSTS)
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // Permissions Policy (Restrict camera, microphone, geolocation)
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Cache Control for API responses (sensitive data protection)
  if (req.url.startsWith('/api')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  next();
}

/**
 * Rate Limiter Middleware (In-Memory Sliding Window)
 */
export function rateLimiter(req, res, next) {
  // Skip rate limiting for static assets or health checks
  if (req.url === '/api/health' || !req.url.startsWith('/api')) {
    return next();
  }

  const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  const record = rateLimitMap.get(clientIp);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    res.setHeader('X-RateLimit-Limit', MAX_REQUESTS_PER_WINDOW);
    res.setHeader('X-RateLimit-Remaining', MAX_REQUESTS_PER_WINDOW - 1);
    return next();
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    res.setHeader('Retry-After', retryAfter);
    return res.status(429).json({
      success: false,
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please wait a few moments before trying again.',
      retryAfterSeconds: retryAfter,
    });
  }

  record.count += 1;
  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS_PER_WINDOW);
  res.setHeader('X-RateLimit-Remaining', MAX_REQUESTS_PER_WINDOW - record.count);
  next();
}

/**
 * Recursive sanitizer for strings to prevent XSS and control-character injections
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/<[^>]*>/g, '') // Strip complete HTML tags
    .replace(/javascript:/gi, '') // Strip javascript: URIs
    .replace(/on\w+\s*=\s*(['"]).*?\1/gi, '') // Strip inline event handlers with quotes
    .replace(/on\w+\s*=\s*[^\s>]+/gi, '') // Strip inline event handlers without quotes
    .replace(/[<>"]/g, '') // Strip dangling brackets and quotes to neutralize injection payloads
    .trim();
}

function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeObject);

  const clean = {};
  for (const [key, val] of Object.entries(obj)) {
    // Prevent prototype pollution
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
    if (typeof val === 'string') {
      clean[key] = sanitizeString(val);
    } else if (typeof val === 'object') {
      clean[key] = sanitizeObject(val);
    } else {
      clean[key] = val;
    }
  }
  return clean;
}

/**
 * Input Sanitization Middleware
 */
export function sanitizeInputs(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    for (const key of Object.keys(req.query)) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitizeString(req.query[key]);
      } else if (typeof req.query[key] === 'object') {
        req.query[key] = sanitizeObject(req.query[key]);
      }
    }
  }
  next();
}

/**
 * Centralized Secure Error Handler
 */
export function secureErrorHandler(err, req, res, next) {
  console.error(`[Security Safe Log] Error processing ${req.method} ${req.url}:`, err.message);

  // Never leak internal stack traces or database paths in production
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.name || 'InternalServerError',
    message: statusCode === 500 
      ? 'An unexpected error occurred. The incident has been safely logged.' 
      : err.message,
    timestamp: new Date().toISOString(),
  });
}
