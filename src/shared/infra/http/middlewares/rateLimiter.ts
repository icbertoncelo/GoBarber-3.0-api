import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import redis from 'redis';

import cacheConfig from '@config/cache';
import AppError from '@shared/errors/AppError';

const redisClient = redis.createClient({
  host: cacheConfig.config.redis.host,
  port: cacheConfig.config.redis.port,
  password: cacheConfig.config.redis.password,
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'middleware',
  points: 5,
  duration: 1,
});

export default async function dateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await limiter.consume(request.ip);

    return next();
  } catch (error) {
    throw new AppError('Too Many Requests', 429);
  }
}
