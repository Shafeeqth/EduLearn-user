import { IUserServiceController } from '../interfaces/user-controller';
import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import RegisterUserDto from '@/application/dto/auth/register-user.dto';
import { mapToRoles } from '@/shared/utils/map-to-roles';
import { ResponseMapper } from '../mappers/response-mapper';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/shared/constants/identifiers';
import { validateDto } from '@/shared/utils/validation.service';
import {
  Auth2SignRequest,
  Auth2SignResponse,
  GetNewRefreshTokenRequest,
  GetNewRefreshTokenResponse,
  LoginUserRequest,
  LoginUserResponse,
  LogoutUserRequest,
  LogoutUserResponse,
  RegisterUserRequest,
  RegisterUserResponse,
  UserInfo,
  VerifyUserRequest,
  VerifyUserResponse,
} from '@/infrastructure/frameworks/gRPC/generated/user';
import { GrpcUnaryHandler } from '@mdshafeeq-repo/edulearn-common';
import { grpcUnaryHandler } from '@/shared/utils/grpc-unary-handler';
import ILoginUserUseCase from '@/application/interfaces/auth/login-user.interface';
import LoginUserDto from '@/application/dto/auth/login-user.dto';
import { INewRefreshTokenUseCase } from '@/application/interfaces/auth/new-refresh-token.interface';
import NewRefreshTokenDto from '@/application/dto/auth/new-refresh-token.dto';
import IRegisterUserUseCase from '@/application/interfaces/auth/register-user.interface';
import VerifyUserDto from '@/application/dto/auth/verify-user.dto';
import { IVerifyUserUseCase } from '@/application/interfaces/auth/verify-user.interface';
import { UserStatus } from '@/shared/types/user-status';
import Auth2SignDto from '@/application/dto/auth/auth2-sign.dto';
import IAuth2SignUseCase from '@/application/interfaces/auth/auth2-sign.interface';
import LogoutUserDto from '@/application/dto/auth/logout.dto';
import ILogoutUserUseCase from '@/application/interfaces/auth/logout.interface';
import { mapToAuthType } from '@/shared/utils/map-to-authType';
import { IGetAllUsersUseCase } from '@/application/interfaces/user/get-all-users';
import { AsObject, dateToProtoTimestamp } from '@/shared/utils/proto-timestamp-converters';

@injectable()
export default class AuthController implements Partial<IUserServiceController> {
  public constructor(
    @inject(TYPES.IRegisterUserUseCase) private readonly registerUserUseCase: IRegisterUserUseCase,
    @inject(TYPES.ILoginUserUseCase) private readonly loginUserUseCase: ILoginUserUseCase,
    @inject(TYPES.ILogoutUserUseCase) private readonly logoutUserUseCase: ILogoutUserUseCase,
    @inject(TYPES.IAuth2SignUseCase) private readonly auth2SignUseCase: IAuth2SignUseCase,
    @inject(TYPES.IVerifyUserUseCase) private readonly verifyUserUseCase: IVerifyUserUseCase,
    @inject(TYPES.IGetAllUsersUseCase) private readonly getAllUsersUseCase: IGetAllUsersUseCase,
    @inject(TYPES.INewRefreshTokenUseCase)
    private readonly newRefreshTokenUseCase: INewRefreshTokenUseCase,
  ) {}

  public registerUser: GrpcUnaryHandler<RegisterUserRequest, RegisterUserResponse> =
    grpcUnaryHandler(
      async (
        call: ServerUnaryCall<RegisterUserRequest, RegisterUserResponse>,
        callback: sendUnaryData<RegisterUserResponse>,
      ) => {
        const { email, role, password, avatar, username, authType } = call.request;
        console.log(call.request);
        const dto = new RegisterUserDto();
        dto.email = email;
        dto.password = password;
        dto.authType = mapToAuthType(authType);
        dto.role = mapToRoles(role);
        dto.username = username;
        dto.avatar = avatar;

        // Validate user data
        await validateDto(dto);

        const user = await this.registerUserUseCase.execute(dto);
        const response = new ResponseMapper<typeof user, RegisterUserResponse>({
          fields: { userId: 'id' },
        }).toResponse(user);
        console.log('user response (:) ', response);

        callback(null, response);
      },
    );

  public auth2Sign: GrpcUnaryHandler<Auth2SignRequest, Auth2SignResponse> = grpcUnaryHandler(
    async (
      call: ServerUnaryCall<Auth2SignRequest, Auth2SignResponse>,
      callback: sendUnaryData<Auth2SignResponse>,
    ) => {
      const { email, role, avatar, username, authType } = call.request;
      console.log(call.request);
      const dto = new Auth2SignDto();
      dto.email = email;
      dto.authType = mapToAuthType(authType);
      dto.role = mapToRoles(role);
      dto.username = username;
      dto.avatar = avatar;

      // Validate user data
      await validateDto(dto);

      const { accessToken, refreshToken, user } = await this.auth2SignUseCase.execute(dto);
      const userResponse = new ResponseMapper<typeof user, UserInfo>({
        fields: {
          userId: 'id',
          username: (): string => `${user.firstName} ${user.lastName}`,
          email: 'email',
          status: 'status',
          avatar: 'avatar',
          role: 'role',
          createdAt: (): AsObject => dateToProtoTimestamp(user.createdAt),
          updatedAt: (): AsObject => dateToProtoTimestamp(user.updatedAt),
        },
      }).toResponse(user);
      console.log('user response (:) ', { accessToken, refreshToken, userResponse });

      callback(null, { accessToken, refreshToken, user: userResponse });
    },
  );

  public verifyUser: GrpcUnaryHandler<VerifyUserRequest, VerifyUserResponse> = grpcUnaryHandler(
    async (
      call: ServerUnaryCall<VerifyUserRequest, VerifyUserResponse>,
      callback: sendUnaryData<VerifyUserResponse>,
    ) => {
      const { email } = call.request;
      const verifyDto = new VerifyUserDto();
      verifyDto.email = email;

      // await validate input
      await validateDto(verifyDto);

      const { accessToken, refreshToken, user } = await this.verifyUserUseCase.execute(verifyDto);
      const userResponse = new ResponseMapper<typeof user, UserInfo>({
        fields: {
          userId: 'id',
          username: (): string => `${user.firstName} ${user.lastName}`,
          email: 'email',
          status: 'status',
          avatar: 'avatar',
          role: 'role',
          createdAt: (): AsObject => dateToProtoTimestamp(user.createdAt),
          updatedAt: (): AsObject => dateToProtoTimestamp(user.updatedAt),
        },
      }).toResponse(user);

      console.log(JSON.stringify(userResponse, null, 2));
      const response = { accessToken, refreshToken, user: userResponse };
      callback(null, { success: response });
    },
  );

  public loginUser: GrpcUnaryHandler<LoginUserRequest, LoginUserResponse> = grpcUnaryHandler(
    async (
      call: ServerUnaryCall<LoginUserRequest, LoginUserResponse>,
      callback: sendUnaryData<LoginUserResponse>,
    ) => {
      const { email, password } = call.request;
      const loginDto = new LoginUserDto();
      loginDto.email = email;
      loginDto.password = password;
      // loginDto.authType = authType;

      // await validate input
      await validateDto(loginDto);

      const { accessToken, refreshToken, user } = await this.loginUserUseCase.execute(loginDto);
      const userResponse = new ResponseMapper<typeof user, UserInfo>({
        fields: {
          userId: 'id',
          username: (): string => `${user.firstName} ${user.lastName}`,
          email: 'email',
          status: 'status',
          avatar: 'avatar',
          role: 'role',
          createdAt: (): AsObject => dateToProtoTimestamp(user.createdAt),
          updatedAt: (): AsObject => dateToProtoTimestamp(user.updatedAt),
        },
      }).toResponse(user);
      const response = { accessToken, refreshToken, user: userResponse };

      callback(null, { success: response });
    },
  );

  public logoutUser: GrpcUnaryHandler<LogoutUserRequest, LogoutUserResponse> = grpcUnaryHandler(
    async (
      call: ServerUnaryCall<LogoutUserRequest, LogoutUserResponse>,
      callback: sendUnaryData<LogoutUserResponse>,
    ) => {
      const { userId } = call.request;
      const logoutDto = new LogoutUserDto();
      logoutDto.userId = userId;

      // await validate input
      await validateDto(logoutDto);

      const response = await this.logoutUserUseCase.execute(logoutDto);

      callback(null, { userId: response.userId, message: 'User logged out successfully' });
    },
  );

  public getNewRefreshToken = grpcUnaryHandler(
    async (
      call: ServerUnaryCall<GetNewRefreshTokenRequest, GetNewRefreshTokenResponse>,
      callback: sendUnaryData<GetNewRefreshTokenResponse>,
    ) => {
      const { refreshToken } = call.request;

      // validate user data
      const dto = new NewRefreshTokenDto();
      dto.refreshToken = refreshToken;

      await validateDto(dto);

      const response = await this.newRefreshTokenUseCase.execute(dto);

      callback(null, { success: response });
    },
  );
}
