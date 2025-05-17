import { ICacheService } from '@/application/services/cache.service';
import { RedisCacheService } from '../frameworks/redis/cache.service';
import { Time } from '@mdshafeeq-repo/edulearn-common';

export class CacheServiceImpl implements ICacheService {
  private cacheService: RedisCacheService;

  public constructor() {
    this.cacheService = new RedisCacheService();
  }

  public async getValue<T>(key: string): Promise<T | null> {
    return (await this.cacheService.get(key.toString())) as T;
  }

  public async setValue<T>(key: string, value: T): Promise<void> {
    return await this.cacheService.set<T>(key, value, Time.DAYS / 1000); // Time.DAYS returns in milliseconds but method expects in seconds so convert back
  }

  public async delete(key: string): Promise<void> {
    return await this.cacheService.delete(key);
  }
}
