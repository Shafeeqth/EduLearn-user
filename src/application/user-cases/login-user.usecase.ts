import { inject, injectable } from 'inversify';
import { TYPES } from '@/shared/constants/identifiers';
import IHashService from '../services/hash.service';
import IUserRepository from '@/domain/repository/user.repository';
import IUUIDService from '../services/uuid.service';
import { IUser } from '@/domain/interfaces/user';
import ILoginUserUseCase from '../interfaces/auth/login-user.interface';
import LoginUserDto from '../dto/auth/login-user.dto';
import { IAuthTokens } from '@/shared/types/auth.tokens';
import UserNotFoundError from '@/shared/errors/not-found-error';
import BadRequestError from '@/shared/errors/bad-request.error';
import { IRefreshTokenRepository } from '@/domain/repository/refresh-token.repository';
import ITokenService from '../services/token.service';
import { RefreshToken } from '@/domain/entity/refresh-token';
import { Time } from '@mdshafeeq-repo/edulearn-common';

@injectable()
export default class LoginUserUseCaseImpl implements ILoginUserUseCase {
  public constructor(
    @inject(TYPES.IHashService) private readonly hashService: IHashService,
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
    @inject(TYPES.IUUIDService) private readonly uuidService: IUUIDService,
    @inject(TYPES.ITokenService) private readonly tokenService: ITokenService,
    @inject(TYPES.IRefreshTokenRepository)
    private readonly tokenRepository: IRefreshTokenRepository,
  ) {}
  public async execute(dto: LoginUserDto): Promise<IAuthTokens & { user: IUser }> {
    // Checks whether user exist with provided email
    const user = await this.userRepository.findByEmail(dto.email);

    // Throws an error `UserNotFoundError`if user not exist with given email
    if (!user)
      throw new UserNotFoundError(
        'user not found with provided email, please check your email and try again',
      );

    const passwordMatch = await this.hashService.compare(user.password, dto.password);

    if (!passwordMatch)
      throw new BadRequestError(
        'The provided password is incorrect. Please check your credentials and try again.',
      );

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
