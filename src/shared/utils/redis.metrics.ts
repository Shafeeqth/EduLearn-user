// src/monitoring/metrics.ts
import { RedisCacheService } from '@/infrastructure/frameworks/redis/cache.service';
import { collectDefaultMetrics, Gauge } from 'prom-client';

export class RedisMetrics {
  private hitRatioGauge: Gauge;
  private memoryUsageGauge: Gauge;
  private cache: RedisCacheService;

  public constructor(cache: RedisCacheService) {
    this.cache = cache;

    // Collect default Node.js metrics
    collectDefaultMetrics();

    // Redis-specific metrics
    this.hitRatioGauge = new Gauge({
      name: 'redis_cache_hit_ratio',
      help: 'Redis cache hit ratio',
    });

    this.memoryUsageGauge = new Gauge({
      name: 'redis_memory_usage_bytes',
      help: 'Redis memory usage in bytes',
      labelNames: ['type'],
    });
  }

  public async updateMetrics() {
    const metrics = await this.cache.getMetrics();

    // Update hit ratio
    this.hitRatioGauge.set(metrics.hitRatio);

    // Update memory metrics
    this.memoryUsageGauge.set({ type: 'used' }, parseInt(metrics.memoryUsage.usedMemory || '0'));
    this.memoryUsageGauge.set({ type: 'rss' }, parseInt(metrics.memoryUsage.usedMemoryRss || '0'));

    return metrics;
  }
}
