const MAX_ATTEMPTS = 5;
const WINDOW_SECONDS = 15 * 60; // 15 minutes
const BLOCK_SECONDS = 60 * 15; // 15 minutes block window

// In-memory store for rate limiting
const attemptStore = new Map();

const getRateLimitKey = (req) => {
  const email = req.body && req.body.email ? req.body.email.trim().toLowerCase() : 'unknown';
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  return `auth:login:${email}:${ip}`;
};

const cleanExpiredEntries = () => {
  const now = Date.now();
  for (const [key, entry] of attemptStore.entries()) {
    if (entry.expiresAt < now) {
      attemptStore.delete(key);
    }
  }
};

const authRateLimiter = (req, res, next) => {
  try {
    cleanExpiredEntries();
    const key = getRateLimitKey(req);
    const entry = attemptStore.get(key);
    const currentAttempts = entry ? entry.attempts : 0;

    if (currentAttempts >= MAX_ATTEMPTS) {
      const remainingSeconds = entry ? Math.ceil((entry.expiresAt - Date.now()) / 1000) : BLOCK_SECONDS;
      return res.status(429).json({
        success: false,
        message: `Too many login attempts. Try again after ${remainingSeconds} seconds.`,
      });
    }

    req.rateLimitKey = key;
    req.rateLimitAttempts = currentAttempts;

    next();
  } catch (error) {
    console.error('Rate limiter failed:', error);
    next();
  }
};

const recordLoginAttempt = (req, success) => {
  try {
    const key = req.rateLimitKey || getRateLimitKey(req);
    if (!key) return;

    if (success) {
      attemptStore.delete(key);
      return;
    }

    const entry = attemptStore.get(key);
    const currentAttempts = entry ? entry.attempts : 0;
    const nextAttempts = currentAttempts + 1;
    const now = Date.now();
    const expiresAt = nextAttempts >= MAX_ATTEMPTS 
      ? now + (BLOCK_SECONDS * 1000)
      : now + (WINDOW_SECONDS * 1000);

    attemptStore.set(key, {
      attempts: nextAttempts,
      expiresAt,
    });
  } catch (error) {
    console.error('Failed to record login attempt:', error);
  }
};

module.exports = { authRateLimiter, recordLoginAttempt };
