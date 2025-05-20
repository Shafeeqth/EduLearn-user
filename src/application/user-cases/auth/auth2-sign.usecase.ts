import { inject, injectable } from 'inversify';
import { TYPES } from '@/shared/constants/identifiers';
import IHashService from '../../services/hash.service';
import IUserRepository from '@/domain/repository/user.repository';
import IUUIDService from '../../services/uuid.service';
import { IRefreshTokenRepository } from '@/domain/repository/refresh-token.repository';
import ITokenService from '../../services/token.service';
import { RefreshToken } from '@/domain/entity/refresh-token';
import { Time } from '@mdshafeeq-repo/edulearn-common';
import { IUserWithAuthToken } from '@/shared/types/user-with-auth-token';
import IAuth2SignUseCase from '@/application/interfaces/auth/auth2-sign.interface';
import Auth2SignDto from '@/application/dto/auth/auth2-sign.dto';
import User from '@/domain/entity/user';
import { UserStatus } from '@/shared/types/user-status';
// import { AuthType } from '@/shared/types/user-types';

@injectable()
export default class Auth2SignUseCaseImpl implements IAuth2SignUseCase {
  public constructor(
    @inject(TYPES.IHashService) private readonly hashService: IHashService,
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
    @inject(TYPES.IUUIDService) private readonly uuidService: IUUIDService,
    @inject(TYPES.ITokenService) private readonly tokenService: ITokenService,
    @inject(TYPES.IRefreshTokenRepository)
    private readonly tokenRepository: IRefreshTokenRepository,
  ) {}
  public async execute(dto: Auth2SignDto): Promise<IUserWithAuthToken> {
    // Checks whether user exist with provided email
    let user = await this.userRepository.findByEmail(dto.email);

    // Creates user if user not already exists
    if (!user) {
      // Generate UUID for userId, so to avoid distributed id conflict
      const userUuid = this.uuidService.generate();

      const [firstName, ...lastName] = dto.username!.split(' ');
      user = new User(
        userUuid,
        dto.email,
        dto.authType,
        dto.role,
        undefined,
        firstName,
        lastName.join(' '),
        dto.avatar,
      );

      // Mark user status as active
      user.status = UserStatus.ACTIVE;

      // Save user to db
      await this.userRepository.create(user);
    }

    // Generate access token with user data
    const accessToken = this.tokenService.generateAccessToken({
      userId: user.id,
      username: user.firstName + ' ' + (user.lastName || ''),
      role: user.role,
    });

    // Generate refresh token with user data
    const refreshToken = this.tokenService.generateRefreshToken({
      userId: user.id,
      username: user.firstName + ' ' + (user.lastName || ''),
      role: user.role,
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
