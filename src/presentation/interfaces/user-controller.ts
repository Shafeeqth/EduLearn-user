import {
  RegisterUserRequest,
  UserServiceServer,
  RegisterUserResponse,
  LoginUserRequest,
  LoginUserResponse,
  GetNewRefreshTokenRequest,
  GetNewRefreshTokenResponse,
} from '@/infrastructure/frameworks/gRPC/generated/user';
import { GrpcUnaryHandler } from '@mdshafeeq-repo/edulearn-common';

export interface IUserServiceController
  extends Pick<UserServiceServer, 'registerUser' | 'getNewRefreshToken'> {
  //   getUser: GrpcUnaryHandler<UserRequest, UserResponse>;

  registerUser: GrpcUnaryHandler<RegisterUserRequest, RegisterUserResponse>;

  loginUser: GrpcUnaryHandler<LoginUserRequest, LoginUserResponse>;
  getNewRefreshToken: GrpcUnaryHandler<GetNewRefreshTokenRequest, GetNewRefreshTokenResponse>;
}
