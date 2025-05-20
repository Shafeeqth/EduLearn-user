import { getEnvs, Time } from '@mdshafeeq-repo/edulearn-common';
import { createClient, RedisClientType } from 'redis';
const { REDIS_URL } = getEnvs('REDIS_URL');

export class RedisCacheService {
  private client: RedisClientType;
  private static instance: RedisCacheService;
  private hits = 0;
  private misses = 0;
  private errors = 0;
  public constructor() {
    try {
      // Checks if class already instantiated ??
      if (!RedisCacheService.instance) {
        console.log(REDIS_URL);
        this.client = createClient({
          url: REDIS_URL,
          socket: {
            reconnectStrategy: (retry) => {
              if (retry > 5) {
                console.error('Redis connection retries exhausted');
                return new Error('Redis connection retires exhausted');
              }
              return Math.min(retry * 100, 5000);
            },
          },
        });

        this.client.on('error', (err) => {
          this.errors++;
          console.error('Redis error :(', err);
        });
        this.client.on('connect', () => console.info('Redis connected (:)'));
        this.client.on('ready', () => console.info('Redis ready (:)'));

        RedisCacheService.instance = this;
      }
      return RedisCacheService.instance;
    } catch (error) {
      console.log('Error while instantiating redis :(', error);
      throw error;
    }
  }

  public async connect(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error) {
      console.error('Failed to connect to Redis :(', error);
      throw error;
    }
  }

  public getClient(): RedisClientType {
    return this.client;
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      console.log('Redis client disconnected gracefully (:)');
    }
  }

  public async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      if (value) {
        this.hits++;
        return JSON.parse(value);
      }
      this.misses++;
      return null;
    } catch (error) {
      this.errors++;
      console.error('Cache get failed for key ' + key + ' :( ', error);
      throw error;
    }
  }

  public async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      if (ttl) {
        await this.client.setEx(key, ttl, stringValue);
      } else {
        await this.client.set(key, stringValue);
      }
    } catch (error) {
      this.errors++;
      console.error(`Cache set failed for key ${key} :(`, error);
      throw error;
    }
  }

  public async delete(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      this.errors++;
      console.error(`Cache delete failed for key ${key}`, error);
      throw error;
    }
  }

  public async keys(pattern: string): Promise<string[]> {
    try {
      return await this.client.keys(pattern);
    } catch (error) {
      this.errors++;
      console.error(`Cache keys failed for pattern ${pattern}`, error);
      throw error;
    }
  }

  public async flush(): Promise<void> {
    try {
      await this.client.flushDb();
    } catch (error) {
      this.errors++;
      console.error(`Cache flush failed :(`, error);
      throw error;
    }
  }

  public async getMultiple<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      const values = await this.client.mGet(keys);
      return values.map((val) => (val ? JSON.parse(val) : null));
    } catch (error) {
      this.errors++;
      console.error('Cache `getMultiple` failed :)', error);
      throw error;
    }
  }

  public async setMultiple<T>(data: { key: string; value: T }[], ttl?: number): Promise<void> {
    try {
      const pipeline = this.client.multi();
      data.forEach(({ key, value }) => {
        const stringVal = JSON.stringify(value);
        if (ttl) {
          pipeline.setEx(key, ttl, stringVal);
        } else {
          pipeline.set(key, stringVal);
        }
      });
      await pipeline.exec();
    } catch (error) {
      this.errors++;
      console.error('Cache `setMultiple` failed :) ', error);
      throw error;
    }
  }

  public async getMetrics() {
    const memoryInfo = await this.client.info('memory');
    const statsInfo = await this.client.info('stats');

    return {
      hitRatio: this.hits / ((this.hits + this.misses) | 1),
      totalOperations: this.hits + this.misses,
      hits: this.hits,
      misses: this.misses,
      errors: this.errors,
      memoryUsage: this.parseMemoryInfo(memoryInfo),
      redisStats: this.parseStatsInfo(statsInfo),
    };
  }

  private parseMemoryInfo(info: string) {
    const lines = info.split('\r\n');
    return {
      usedMemory: lines.find((l) => l.startsWith('used_memory:'))?.split(':')[1],
      usedMemoryRss: lines.find((l) => l.startsWith('used_memory_rss:'))?.split(':')[1],
      fragmentationRatio: lines
        .find((l) => l.startsWith('mem_fragmentation_ratio:'))
        ?.split(':')[1],
    };
  }

  private parseStatsInfo(info: string) {
    const lines = info.split('\r\n');
    return {
      keyspaceHits: lines.find((l) => l.startsWith('keyspace_hits:'))?.split(':')[1],
      keyspaceMisses: lines.find((l) => l.startsWith('keyspace_misses:'))?.split(':')[1],
    };
  }

  public logMetrics(): void {
    setInterval(async () => {
      const metrics = await this.getMetrics();
      console.table([
        'Redis metrics',
        {
          hitRatio: metrics.hitRatio,
          memoryUsage: metrics.memoryUsage.usedMemory,
          fragmentationRatio: metrics.memoryUsage.fragmentationRatio,
          kayspaceHits: metrics.redisStats.keyspaceHits,
          keyspaceMisses: metrics.redisStats.keyspaceMisses,
        },
      ]);
    }, Time.MINUTES * 1); // log every minutes
  }
}

// export const redisClient = RedisCacheService.getInstance();
