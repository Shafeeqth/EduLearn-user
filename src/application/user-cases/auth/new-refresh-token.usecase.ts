import { inject, injectable } from 'inversify';
import { TYPES } from '@/shared/constants/identifiers';
import IHashService from '@/application/services/hash.service';
import IUserRepository from '@/domain/repository/user.repository';
import { INewRefreshTokenUseCase } from '@/application/interfaces/auth/new-refresh-token.interface';
import IUUIDService from '@/application/services/uuid.service';
import ITokenService from '@/application/services/token.service';
import { IRefreshTokenRepository } from '@/domain/repository/refresh-token.repository';
import { IAuthTokens } from '@/shared/types/auth.tokens';
import NewRefreshTokenDto from '@/application/dto/auth/new-refresh-token.dto';
import BadRequestError from '@/shared/errors/bad-request.error';
import { RefreshToken } from '@/domain/entity/refresh-token';
import { Time } from '@mdshafeeq-repo/edulearn-common';

@injectable()
export default class NewRefreshTokenUseCaseImpl implements INewRefreshTokenUseCase {
  public constructor(
    @inject(TYPES.IRegisterUserUseCase) private readonly hashService: IHashService,
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
    @inject(TYPES.IUUIDService) private readonly uuidService: IUUIDService,
    @inject(TYPES.ITokenService) private readonly tokenService: ITokenService,
    @inject(TYPES.IRefreshTokenRepository)
    private readonly tokenRepository: IRefreshTokenRepository,
  ) {}
  public async execute(dto: NewRefreshTokenDto): Promise<IAuthTokens> {
    const userFromToken = await this.tokenRepository.findUserToken(dto.refreshToken);

    if (!userFromToken)
      throw new BadRequestError(
        'The provided token either expired or revoked. Please login  again.',
      );
    const { user } = userFromToken;

    // Generate access token with user data
    const accessToken = this.tokenService.generateAccessToken({
      userId: user.id,
      username: user.firstName + ' ' + (user.lastName || ''),
      role: user.role,
      avatar: user.avatar,
    });

    // Generate refresh token with user data
    const refreshToken = this.tokenService.generateRefreshToken({
      userId: user.id,
      username: user.firstName + ' ' + (user.lastName || ''),
      role: user.role,
      avatar: user.avatar,
    });

    // hash refresh token to better security (a good practice)
    const hashedToken = await this.hashService.hash(refreshToken);

    const token = new RefreshToken(
      userFromToken.id,
      userFromToken.userId,
      hashedToken,
      new Date(Date.now() + Time.DAYS * 7),
    );

    // Create a token if token not exist with current userId else update.
    await this.tokenRepository.upsertToken(token);

    return { accessToken, refreshToken };
  }
}
