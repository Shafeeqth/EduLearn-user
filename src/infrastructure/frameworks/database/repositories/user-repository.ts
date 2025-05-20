import { Repository } from 'typeorm';
import { AppDataSource } from '@/infrastructure/frameworks/database/data-source/data-source';
import User from '@/infrastructure/frameworks/database/entities/user';
import IUserRepository from '@/domain/repository/user.repository';
import { IUser } from '@/domain/interfaces/user';
import { UserRoles } from '@/shared/types/user-types';
import { UserStatus } from '@/shared/types/user-status';
import { injectable } from 'inversify';
import { RedisCacheService } from '../../redis/cache.service';
import { Time } from '@mdshafeeq-repo/edulearn-common';

injectable();
export default class PostgresUserRepositoryImpl implements IUserRepository {
  // private repo: Repository<User>;
  // private cache: RedisCacheService;

  public constructor(
    private cache: RedisCacheService = new RedisCacheService(),
    private repo: Repository<User> = AppDataSource.getRepository(User),
  ) {}
  public async create(user: IUser): Promise<IUser> {
    const newUser = this.repo.create(user);
    const savedUser = await this.repo.save(newUser);

    // Write-through cache: Update user after successful write
    if (savedUser) {
      Promise.all([
        this.cache.set(`db:user:${savedUser.id}`, savedUser, 3600),
        this.cache.set(`db:user:email:${savedUser.email}`, savedUser, 3600),
      ]).catch((error) => console.error('Cache update failed:', error));
    }
    return savedUser;
  }

  public async findById(userId: string): Promise<IUser | null> {
    // Read-through cache: Check cache first
    const cachedUser = await this.cache.get<IUser>(`db:user:${userId}`);
    if (cachedUser) return cachedUser;

    // Fetch from db if not in cache

    const user = await this.repo.findOne({
      where: { id: userId },
      // select: ['id', 'avatar', 'status', 'email', 'role'],
    });
    if (user) {
      await this.cache.set(`db:user:${userId}`, user); // Cache the result
    }
    return user;
  }

  public async findByEmail(email: string): Promise<IUser | null> {
    // Read-through cache: Check cache first
    const cachedUser = await this.cache.get<IUser>(`db:user:email:${email}`);
    if (cachedUser) return cachedUser;

    // Fetch from db if not in cache
    const user = await this.repo.findOne({
      where: { email },
      // select: ['id', 'avatar', 'status', 'email', 'role'],
    });
    if (user) {
      await this.cache.set(`db:user:email:${email}`, user, (Time.HOURS * 1) / 1000); // Cache the result
    }
    return user;
  }

  public async delete(userId: string): Promise<void> {
    const [_, userResponse] = await Promise.allSettled([
      await this.repo.update({ id: userId }, { status: UserStatus.BLOCKED }),
      await this.repo.findOne({ where: { id: userId } }),
    ]);

    // Cache update operations to schedule
    const operations = [
      this.cache.delete(`db:user:${userId}`),
      this.cache.delete(`db:users:page:*`), // Invalidate paginated user lists
    ];

    if (userResponse.status === 'fulfilled' && userResponse.value) {
      const user = userResponse.value;
      operations.push(this.cache.delete(`db:user:email:${user.email}`));
    }

    // Invalidate user cache after deletion
    await Promise.all(operations);
  }

  public async update(userId: string, data: Partial<IUser>): Promise<IUser | null> {
    // Update user
    await this.repo.update({ id: userId }, data);

    // Fetch updated user from database
    const updatedUser = await this.repo.findOne({ where: { id: userId } });

    if (updatedUser) {
      Promise.all([
        // Update cache to reflect to user update
        this.cache.set(`db:user:${userId}`, updatedUser, (Time.HOURS * 1) / 1000),
        this.cache.set(`db:users:email:${updatedUser.email}`, (Time.HOURS * 1) / 1000),
      ]);
    }

    return updatedUser;
  }

  public async getAllInstructors(limit: number, offset: number): Promise<IUser[] | []> {
    const cacheKey = `db:instructors:limit${limit}:offset:${offset}`;

    // Read-through cache: Check cache first
    const cachedInstructors = await this.cache.get<IUser[]>(cacheKey);
    if (cachedInstructors) return cachedInstructors;

    // Fetch from db if not in cache;
    const instructors = await this.repo.find({
      where: { role: UserRoles.INSTRUCTOR },
      skip: offset,
      take: limit,
      // select: ['id', 'avatar', 'status', 'email', 'role', 'status'],
    });

    // Finally cache the result
    await this.cache.set(cacheKey, instructors, (Time.MINUTES / 1000) * 5);

    return instructors;
  }

  async getAllUserEmails(): Promise<string[] | []> {
    // Implement no cache for this function

    // Fetch all user emails
    const emails = await this.repo.find({ select: ['email'] });

    return emails as unknown as string[] | [];
  }

  public async getAllUsers(offset: number, limit: number): Promise<IUser[] | []> {
    const cacheKey = `db:users:limit${limit}:offset:${offset}`;

    // Read-through cache: Check cache first
    const cachedUsers = await this.cache.get<IUser[]>(cacheKey);
    if (cachedUsers) return cachedUsers;

    // Fetch from db if not in cache;
    const users = await this.repo.find({
      skip: offset,
      take: limit,
      // select: ['id', 'avatar', 'status', 'email', 'role', 'status'],
    });

    // Finally cache the result
    await this.cache.set(cacheKey, users, (Time.MINUTES / 1000) * 5);

    return users;
  }
}
