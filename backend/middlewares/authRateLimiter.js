const redis = require('../config/redis');

const MAX_ATTEMPTS = 5;
const WINDOW_SECONDS = 15 * 60; // 15 minutes
const BLOCK_SECONDS = 60 * 15; // 15 minutes block window

const getRateLimitKey = (req) => {
  const email = req.body && req.body.email ? req.body.email.trim().toLowerCase() : 'unknown';
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  return `auth:login:${email}:${ip}`;
};

const authRateLimiter = async (req, res, next) => {
  try {
    const key = getRateLimitKey(req);
    const attempts = await redis.get(key);
    const currentAttempts = attempts ? Number(attempts) : 0;

    if (currentAttempts >= MAX_ATTEMPTS) {
      const ttl = await redis.ttl(key);
      return res.status(429).json({
        success: false,
        message: `Too many login attempts. Try again after ${ttl} seconds.`,
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

const recordLoginAttempt = async (req, success) => {
  try {
    const key = req.rateLimitKey || getRateLimitKey(req);
    if (!key) return;

    if (success) {
      await redis.del(key);
      return;
    }

    const currentAttempts = Number(await redis.get(key)) || 0;
    const nextAttempts = currentAttempts + 1;

    if (nextAttempts === 1) {
      await redis.set(key, nextAttempts, { EX: WINDOW_SECONDS });
    } else {
      await redis.incr(key);
    }

    if (nextAttempts >= MAX_ATTEMPTS) {
      await redis.expire(key, BLOCK_SECONDS);
    }
  } catch (error) {
    console.error('Failed to record login attempt:', error);
  }
};

module.exports = { authRateLimiter, recordLoginAttempt };
