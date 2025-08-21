import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheService {
  private readonly redis: Redis;
  private readonly logger = new Logger(CacheService.name);

  constructor(private readonly configService: ConfigService) {
    const redisUrl = this.configService.get<string>('redis.url') || 'redis://redis:6379';
    this.redis = new Redis(redisUrl);

    this.redis.on('connect', () => this.logger.log('Connected to Redis'));
    this.redis.on('error', (err) => this.logger.error('Redis error', err));
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    if (!data) return null;

    try {
      return JSON.parse(data) as T;
    } catch (e) {
      this.logger.error(`Failed to parse Redis key ${key}`, e);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number) {
    const val = JSON.stringify(value);

    if (ttlSeconds) {
      await this.redis.set(key, val, 'EX', ttlSeconds);
    } else {
      await this.redis.set(key, val);
    }
  }

  async del(key: string) {
    await this.redis.del(key);
  }
}
