import { Container } from 'inversify';
import PostgresUserRepositoryImpl from '../frameworks/database/repositories/user-repository';
import { TYPES } from '@/shared/constants/identifiers';
import HashServiceImpl from '../services/hash.service';
import UUIDServiceImpl from '../services/uuid.service';
import UserController from '@/presentation/controllers/user-controller';
import RefreshTokenRepositoryImpl from '../frameworks/database/repositories/refresh-token.repository';
import TokenServiceImpl from '../services/token.service';
import RegisterUserUseCaseImpl from '@/application/user-cases/auth/register-user.usecase';
import LoginUserUseCaseImpl from '@/application/user-cases/auth/login-user.usecase';
import { CacheServiceImpl } from '../services/cache.service';
import { RedisCacheService } from '../frameworks/redis/cache.service';
import CurrentUserUseCaseImpl from '@/application/user-cases/user/current-user.usecase';
import VerifyUserUseCaseImpl from '@/application/user-cases/auth/verify-user.usecase';
// import NewRefreshTokenUseCaseImpl from '@/application/user-cases/new-refresh-token.use-case';

const container = new Container();

/**
 * Bind Interfaces to implementations
 */

//Bind repositories
container.bind(TYPES.IUserRepository).to(PostgresUserRepositoryImpl).inSingletonScope();
container.bind(TYPES.IRefreshTokenRepository).to(RefreshTokenRepositoryImpl).inSingletonScope();
// container.bind<RedisCacheService>(TYPES.IRedisCacheService).toDynamicValue(() => RedisCacheService.getInstance());

//Bind use cases
container.bind(TYPES.IRegisterUserUseCase).to(RegisterUserUseCaseImpl);
container.bind(TYPES.ILoginUserUseCase).to(LoginUserUseCaseImpl);
container.bind(TYPES.ICurrentUserUseCase).to(CurrentUserUseCaseImpl);
container.bind(TYPES.IVerifyUserUseCase).to(VerifyUserUseCaseImpl);
// container.bind(TYPES.INewRefreshTokenUseCase).to(NewRefreshTokenUseCaseImpl);

//Bind services
container.bind(TYPES.IHashService).to(HashServiceImpl);
container.bind(TYPES.IUUIDService).to(UUIDServiceImpl);
container.bind(TYPES.ITokenService).to(TokenServiceImpl);
container.bind(TYPES.ICacheService).to(CacheServiceImpl);

//Bind controllers
container.bind(TYPES.IUserServiceController).to(UserController);

export { container };
