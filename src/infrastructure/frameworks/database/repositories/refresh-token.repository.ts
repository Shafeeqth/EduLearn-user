import { IRefreshTokenRepository } from '@/domain/repository/refresh-token.repository';
import { MoreThan, LessThan, Repository } from 'typeorm';
import { RefreshToken } from '../entities/refresh-token';
import { AppDataSource } from '../data-source/data-source';
import { IRefreshToken } from '@/domain/interfaces/refresh-token';
import { injectable } from 'inversify';
import { IUser } from '@/domain/interfaces/user';

@injectable()
export default class RefreshTokenRepositoryImpl implements IRefreshTokenRepository {
  private repo: Repository<RefreshToken>;
  public constructor() {
    this.repo = AppDataSource.getRepository(RefreshToken);
  }

  public async upsertToken(token: IRefreshToken): Promise<void> {
    await this.repo.upsert(token, { conflictPaths: ['userId'] });
  }

  public async findByUserId(userId: string): Promise<IRefreshToken | null> {
    return await this.repo.findOne({
      where: {
        userId: userId,
      },
    });
  }

  public async findUserToken(token: string): Promise<({ user: IUser } & IRefreshToken) | null> {
    const refreshToken = await this.repo.findOne({
      where: {
        token,
        revoked: false,
        expiresAt: MoreThan(new Date()),
      },
      relations: ['user '],
    });
    return refreshToken || null;
  }

  public async updateToken(userId: string, token: Partial<IRefreshToken>): Promise<void> {
    await this.repo.update(userId, token);
  }

  public async deleteExpiredAndRevokedTokens(): Promise<void> {
    await this.repo.delete({
      revoked: true,
      expiresAt: LessThan(new Date()),
    });
  }
}
