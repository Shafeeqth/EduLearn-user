import { inject, injectable } from 'inversify';
import { TYPES } from '@/shared/constants/identifiers';
import IHashService from '../../services/hash.service';
import IUserRepository from '@/domain/repository/user.repository';
import IUUIDService from '../../services/uuid.service';
import { IUser } from '@/domain/interfaces/user';
import UserNotFoundError from '@/shared/errors/not-found-error';
import { IRefreshTokenRepository } from '@/domain/repository/refresh-token.repository';
import ITokenService from '../../services/token.service';
import { RefreshToken } from '@/domain/entity/refresh-token';
import { Time } from '@mdshafeeq-repo/edulearn-common';
import { IVerifyUserUseCase } from '@/application/interfaces/auth/verify-user.interface';
import VerifyUserDto from '@/application/dto/auth/verify-user.dto';
import { IUserWithAuthToken } from '@/shared/types/user-with-auth-token';
import { ICacheService } from '@/application/services/cache.service';
import { UserStatus } from '@/shared/types/user-status';

@injectable()
export default class VerifyUserUseCaseImpl implements IVerifyUserUseCase {
  public constructor(
    @inject(TYPES.IHashService) private readonly hashService: IHashService,
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
    @inject(TYPES.IUUIDService) private readonly uuidService: IUUIDService,
    @inject(TYPES.ITokenService) private readonly tokenService: ITokenService,
    @inject(TYPES.ICacheService) private readonly cacheService: ICacheService,
    @inject(TYPES.IRefreshTokenRepository)
    private readonly tokenRepository: IRefreshTokenRepository,
  ) {}
  public async execute(dto: VerifyUserDto): Promise<IUserWithAuthToken> {
    // Checks whether user exist with provided email
    const user = await this.cacheService.getValue<IUser>(dto.email);

    // Throws an error `UserNotFoundError`if user not exist with given email
    if (!user)
      throw new UserNotFoundError(
        'user not found with provided email while verification, please try again',
      );

    // Change user verified status and active
    user.status = UserStatus.ACTIVE;

    const success = await this.userRepository.create(user);

    if (!success) throw new Error("Can't create user with user details");

    // Generate access token with user data
    const accessToken = this.tokenService.generateAccessToken({
      userId: user.id,
      username: user.firstName + ' ' + (user.lastName || ''),
      role: user.role,
      avatar: user.avatar,
    });

    // Generate refresh token with user data
    const refreshToken = this.tokenService.generateAccessToken({
      userId: user.id,
      username: user.firstName + ' ' + (user.lastName || ''),
      role: user.role,
      avatar: user.avatar,
    });

    // Generate UUID for userId, so to avoid distributed id conflict
    const tokenUuid = this.uuidService.generate();

    // hash refresh token to better security (a good practice)
    const hashedToken = await this.hashService.hash(refreshToken);

    const token = new RefreshToken(
      tokenUuid,
      user.id,
      hashedToken,
      new Date(Date.now() + Time.DAYS * 7),
    );

    // Create a token if token not exist with current userId else update.
    await this.tokenRepository.upsertToken(token);

    return { accessToken, refreshToken, user };
  }
}
