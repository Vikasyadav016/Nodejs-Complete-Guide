const { createClient } = require('redis');

const redis = createClient({
  socket: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
  },
});

redis.on('error', (error) => {
  console.error('Redis Client Error:', error);
});

redis.connect().catch((error) => {
  console.error('Redis connection failed:', error);
});

module.exports = redis;
