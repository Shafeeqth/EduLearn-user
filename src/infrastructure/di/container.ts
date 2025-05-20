import { Container } from 'inversify';
import PostgresUserRepositoryImpl from '../frameworks/database/repositories/user-repository';
import { TYPES } from '@/shared/constants/identifiers';
import HashServiceImpl from '../services/hash.service';
import UUIDServiceImpl from '../services/uuid.service';
import UserController from '@/presentation/controllers/user.controller';
import RefreshTokenRepositoryImpl from '../frameworks/database/repositories/refresh-token.repository';
import TokenServiceImpl from '../services/token.service';
import RegisterUserUseCaseImpl from '@/application/user-cases/auth/register-user.usecase';
import LoginUserUseCaseImpl from '@/application/user-cases/auth/login-user.usecase';
import { CacheServiceImpl } from '../services/cache.service';
import CurrentUserUseCaseImpl from '@/application/user-cases/user/current-user.usecase';
import VerifyUserUseCaseImpl from '@/application/user-cases/auth/verify-user.usecase';
import Auth2SignUseCaseImpl from '@/application/user-cases/auth/auth2-sign.usecase';
import LogoutUseCaseImpl from '@/application/user-cases/auth/logout.usecase';
import GetAllUsersUseCaseImpl from '@/application/user-cases/user/get-all-users.usecase';
import AuthController from '@/presentation/controllers/auth.controller';
import NewRefreshTokenUseCaseImpl from '@/application/user-cases/auth/new-refresh-token.usecase';
import GetAllEmailsUseCaseImpl from '@/application/user-cases/user/get-all-emails.use-case';
import ChangePasswordUseCaseImpl from '@/application/user-cases/user/change-password.use-case';
import UpdateUserUseCaseImpl from '@/application/user-cases/user/update-userdata.use-case';
import BlockUserUserCaseImpl from '@/application/user-cases/user/block-user.use-case';
import CheckEmailExistUseCaseImpl from '@/application/user-cases/user/email-exist.use-case';
import UnBlockUserUserCaseImpl from '@/application/user-cases/user/unblock-user.use-case';
import DetailedUserUseCaseImpl from '@/application/user-cases/user/get-detailed-user.use-case';
import RegisterInstructorUseCaseImpl from '@/application/user-cases/user/register-instructor.usecase';

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
container.bind(TYPES.ILogoutUserUseCase).to(LogoutUseCaseImpl);
container.bind(TYPES.ICurrentUserUseCase).to(CurrentUserUseCaseImpl);
container.bind(TYPES.IVerifyUserUseCase).to(VerifyUserUseCaseImpl);
container.bind(TYPES.IAuth2SignUseCase).to(Auth2SignUseCaseImpl);
container.bind(TYPES.IGetAllUsersUseCase).to(GetAllUsersUseCaseImpl);
container.bind(TYPES.INewRefreshTokenUseCase).to(NewRefreshTokenUseCaseImpl);
container.bind(TYPES.IGetAllEmailsUseCase).to(GetAllEmailsUseCaseImpl);
container.bind(TYPES.IChangePasswordUseCase).to(ChangePasswordUseCaseImpl);
container.bind(TYPES.IUpdateUserUseCase).to(UpdateUserUseCaseImpl);
container.bind(TYPES.IBlockUserUseCase).to(BlockUserUserCaseImpl);
container.bind(TYPES.IUnBlockUserUseCase).to(UnBlockUserUserCaseImpl);
container.bind(TYPES.IEmailExistUseCase).to(CheckEmailExistUseCaseImpl);
container.bind(TYPES.IDetailedUserUseCase).to(DetailedUserUseCaseImpl);
container.bind(TYPES.IRegisterInstructorUseCase).to(RegisterInstructorUseCaseImpl);

//Bind services
container.bind(TYPES.IHashService).to(HashServiceImpl);
container.bind(TYPES.IUUIDService).to(UUIDServiceImpl);
container.bind(TYPES.ITokenService).to(TokenServiceImpl);
container.bind(TYPES.ICacheService).to(CacheServiceImpl);

//Bind controllers
container.bind(TYPES.IUserServiceController).to(UserController);
container.bind(TYPES.IAuthServiceController).to(AuthController);

export { container };
