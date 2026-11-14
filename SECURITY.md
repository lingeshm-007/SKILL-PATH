# Security Policy & Architecture

## Security Overview
**SkillPath AI** is architected following the **OWASP Top 10** secure coding standards. It incorporates multi-layered defense-in-depth protections across its frontend, backend micro-services, and autonomous multi-agent swarm.

---

## 🛡️ Implemented Security Controls

### 1. HTTP Security Headers
- **Content-Security-Policy (CSP)**: Enforces restricted origins for scripts, fonts, images, and WebSocket connections to mitigate Cross-Site Scripting (XSS).
- **X-Content-Type-Options: `nosniff`**: Prevents MIME-type sniffing attacks.
- **X-Frame-Options: `DENY`**: Completely eliminates UI redress / clickjacking vectors.
- **Strict-Transport-Security (HSTS)**: Mandates secure HTTPS transport with `includeSubDomains; preload`.
- **Referrer-Policy**: Set to `strict-origin-when-cross-origin` to protect sensitive user referrer tokens.
- **Permissions-Policy**: Restricts access to sensitive browser device features (camera, microphone, geolocation).

### 2. DDoS & Brute-Force Rate Limiting
- Built-in **Sliding Window Rate Limiter** (`backend/src/middleware/security.js`) enforcing:
  - Max 300 requests per 15-minute window per IP.
  - Automatically emits standard RFC rate-limiting headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `Retry-After`.
  - HTTP 429 status response when thresholds are exceeded.

### 3. Deep Input Sanitization & Anti-Injection
- All payload inputs (`req.body` and `req.query`) pass through a recursive sanitizer:
  - Strips HTML `<script>` tags, inline event attributes (`onclick`, `onerror`), and `javascript:` URIs.
  - Blocks prototype pollution by stripping reserved object keys (`__proto__`, `constructor`, `prototype`).
  - Limits JSON payload sizes to `2MB` to thwart memory exhaustion and body parser DoS attacks.

### 4. Data Isolation & Multi-Student Privacy
- Student databases use isolated key partitions (`user-[id]`).
- All agent interactions and quiz histories are scoped strictly to the authenticated student context.
- Dedicated Google OAuth and student email authentication ensures zero public credential or account exposure.

### 5. Safe Error Handling
- The server employs a centralized secure error handler:
  - Internal server stack traces, database file system paths, and raw runtime details are never leaked to the client.
  - Generates secure, sanitized JSON error responses with standardized error codes.

---

## 🔍 Reporting a Vulnerability
If you discover a security vulnerability in SkillPath AI, please disclose it responsibly:
- **Email**: `security@skillpath-ai.org` or open a private advisory on GitHub.
- We acknowledge all vulnerability reports within 24 hours and issue patches swiftly.
