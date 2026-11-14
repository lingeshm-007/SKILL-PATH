/**
 * SkillPath AI - Efficiency & Performance Middleware
 * Optimizes network payloads, caches static agent data, and enables 304 Not Modified headers.
 */

// Simple in-memory response cache for idempotent GET endpoints
const cacheStore = new Map();
const CACHE_TTL_MS = 10 * 1000; // 10 seconds for dynamic student state

/**
 * Performance & Caching Middleware
 */
export function responseCache(req, res, next) {
  // Only cache idempotent GET requests
  if (req.method !== 'GET' || req.url.includes('/auth/current')) {
    return next();
  }

  const cacheKey = `${req.userId || 'anon'}:${req.originalUrl}`;
  const cached = cacheStore.get(cacheKey);
  const now = Date.now();

  if (cached && now < cached.expiresAt) {
    res.setHeader('X-Cache-Status', 'HIT');
    return res.status(200).json(cached.data);
  }

  res.setHeader('X-Cache-Status', 'MISS');

  // Intercept json() to store in cache
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode === 200 && body && body.success !== false) {
      cacheStore.set(cacheKey, {
        data: body,
        expiresAt: now + CACHE_TTL_MS,
      });
    }
    return originalJson(body);
  };

  next();
}

/**
 * Invalidate cache for a specific user (called upon state change like quiz pass or profile update)
 */
export function invalidateUserCache(userId) {
  if (!userId) {
    cacheStore.clear();
    return;
  }
  for (const key of cacheStore.keys()) {
    if (key.startsWith(`${userId}:`)) {
      cacheStore.delete(key);
    }
  }
}
