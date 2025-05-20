import { IGetAllUsersUseCase } from '@/application/interfaces/user/get-all-users';
import { inject, injectable } from 'inversify';
import { GrpcUnaryHandler, ResponseMapper } from '@mdshafeeq-repo/edulearn-common';
import {
  BlockUserRequest,
  BlockUserResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  CheckUserByEmailRequest,
  CheckUserByEmailResponse,
  GetAllUserEmailsRequest,
  GetAllUserEmailsResponse,
  GetAllUsersRequest,
  GetAllUsersResponse,
  GetDetailedUserRequest,
  GetDetailedUserResponse,
  GetUserByIdRequest,
  GetUserByIdResponse,
  PaginationResponse,
  RegisterInstructorRequest,
  RegisterInstructorResponse,
  UnBlockUserRequest,
  UnBlockUserResponse,
  UpdateUserDetailsRequest,
  UpdateUserDetailsResponse,
  UserInfo,
} from '@/infrastructure/frameworks/gRPC/generated/user';
import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import GetAllUsersDto from '@/application/dto/user/get-all-users';
import { validateDto } from '@/shared/utils/validation.service';
import { AsObject, dateToProtoTimestamp } from '@/shared/utils/proto-timestamp-converters';
import { UserStatus } from '@/shared/types/user-status';
import { TYPES } from '@/shared/constants/identifiers';
import { parseMetadata } from '@/shared/utils/parse-metadata';
import CurrentUserDto from '@/application/dto/user/current-user.dto';
import { ICurrentUserUseCase } from '@/application/interfaces/user/get-current-user';
import { IJWTClaimWithUser } from '@/application/services/token.service';
import ChangePasswordDto from '@/application/dto/user/change-password.dto';
import { IChangePasswordUseCase } from '@/application/interfaces/user/change-password.inteface';
import { IUpdateUserUseCase } from '@/application/interfaces/user/update-user.interface';
import { IGetAllEmailsUseCase } from '@/application/interfaces/user/get-all-emails.use-case';
import { ICheckEmailExistUseCase } from '@/application/interfaces/user/email-exist.use-case';
import EmailExistDto from '@/application/dto/user/email-exist.dto';
import { IBlockUserUseCase } from '@/application/interfaces/user/block-user.interface';
import BlockUserDto from '@/application/dto/user/block-user.dto';
import UpdateUserDto from '@/application/dto/user/update-user.dto';
import UnBlockUserDto from '@/application/dto/user/unblock-user.dto';
import { IUnBlockUserUseCase } from '@/application/interfaces/user/unblock-user.interface';
import { IDetailedUserUseCase } from '@/application/interfaces/user/get-detailed-user.interface';
import DetailedUserDto from '@/application/dto/user/detailed-user.dto';
import { grpcUnaryHandler } from '@/shared/utils/grpc-unary-handler';
import { IUser } from '@/domain/interfaces/user';
import RegisterInstructorDto from '@/application/dto/user/register-instructor.dto';
import { IRegisterInstructorUseCase } from '@/application/interfaces/user/register-instructor.interface';

@injectable()
export default class UserController {
  public constructor(
    @inject(TYPES.IGetAllUsersUseCase) private readonly allUsersUseCase: IGetAllUsersUseCase,
    @inject(TYPES.ICurrentUserUseCase) private readonly currentUserUseCase: ICurrentUserUseCase,
    @inject(TYPES.IDetailedUserUseCase) private readonly detailedUserUseCase: IDetailedUserUseCase,
    @inject(TYPES.IChangePasswordUseCase)
    private readonly changePasswordUseCase: IChangePasswordUseCase,
    @inject(TYPES.IUpdateUserUseCase) private readonly updateUserUseCase: IUpdateUserUseCase,
    @inject(TYPES.IGetAllEmailsUseCase) private readonly getAllEmailsUseCase: IGetAllEmailsUseCase,
    @inject(TYPES.IEmailExistUseCase)
    private readonly checkEmailExistUseCase: ICheckEmailExistUseCase,
    @inject(TYPES.IBlockUserUseCase)
    private readonly blockUserUseCase: IBlockUserUseCase,
    @inject(TYPES.IUnBlockUserUseCase)
    private readonly unBlockUserUseCase: IUnBlockUserUseCase,
    @inject(TYPES.IRegisterInstructorUseCase)
    private readonly registerInstructorUseCase: IRegisterInstructorUseCase,
  ) {}

  public getAllUsers: GrpcUnaryHandler<GetAllUsersRequest, GetAllUsersResponse> = grpcUnaryHandler(
    async (
      call: ServerUnaryCall<GetAllUsersRequest, GetAllUsersResponse>,
      callback: sendUnaryData<GetAllUsersResponse>,
    ) => {
      const userHeader = parseMetadata<{ xUser: IJWTClaimWithUser; correlationId: string }>(
        call.metadata,
        {
          xUser: { header: 'x-user' },
          correlationId: { header: 'correlationId' },
        },
      );
      console.log('User metadata :) ', JSON.stringify(userHeader));

      const { page, pageSize } = call.request.pagination!;
      const usersDto = new GetAllUsersDto();
      usersDto.page = page;
      usersDto.pageSize = pageSize;
      // loginDto.authType = authType;

      // await validate input
      await validateDto(usersDto);

      const users = await this.allUsersUseCase.execute(usersDto);
      console.log('Users', JSON.stringify(users, null, 2));

      const userResponses: UserInfo[] = users.map((user) =>
        new ResponseMapper<typeof user, UserInfo>({
          fields: {
            userId: 'id',
            username: (): string => `${user.firstName} ${user.lastName}`,
            email: 'email',
            avatar: 'avatar',
            role: 'role',
            status: 'status',
            createdAt: (): AsObject => dateToProtoTimestamp(user.createdAt),
            updatedAt: (): AsObject => dateToProtoTimestamp(user.updatedAt),
          },
        }).toResponse(user),
      );

      const paginationResponse: PaginationResponse = {
        totalItems: users.length, // Replace with actual total items if available
        totalPages: Math.ceil(users.length / usersDto.pageSize), // Replace with actual total pages if available
      };
      callback(null, { success: { users: userResponses, pagination: paginationResponse } });
    },
  );

  public registerInstructor: GrpcUnaryHandler<
    RegisterInstructorRequest,
    RegisterInstructorResponse
  > = grpcUnaryHandler(
    async (
      call: ServerUnaryCall<RegisterInstructorRequest, RegisterInstructorResponse>,
      callback: sendUnaryData<RegisterInstructorResponse>,
    ) => {
      const { userId } = call.request;
      const loginDto = new RegisterInstructorDto();
      loginDto.userId = userId;
      // loginDto.authType = authType;

      // await validate input
      await validateDto(loginDto);

      const { accessToken, refreshToken, user } =
        await this.registerInstructorUseCase.execute(loginDto);
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

      callback(null, response);
    },
  );

  public getCurrentUser = grpcUnaryHandler(
    async (
      call: ServerUnaryCall<GetUserByIdRequest, GetUserByIdResponse>,
      callback: sendUnaryData<GetUserByIdResponse>,
    ) => {
      const userHeader = parseMetadata<{ xUser: IJWTClaimWithUser; correlationId: string }>(
        call.metadata,
        {
          xUser: { header: 'x-user' },
          correlationId: { header: 'correlationId' },
        },
      );

      console.log('User metadata :) ', JSON.stringify(userHeader));

      const { userId } = call.request;
      const userDto = new CurrentUserDto();
      userDto.userId = userId;

      // await validate input
      await validateDto(userDto);

      const user = await this.currentUserUseCase.execute(userDto);
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

      callback(null, { user: userResponse });
    },
  );
  public getDetailedUser = grpcUnaryHandler(
    async (
      call: ServerUnaryCall<GetDetailedUserRequest, GetDetailedUserResponse>,
      callback: sendUnaryData<GetDetailedUserResponse>,
    ) => {
      const userHeader = parseMetadata<{ xUser: IJWTClaimWithUser; correlationId: string }>(
        call.metadata,
        {
          xUser: { header: 'x-user' },
          correlationId: { header: 'correlationId' },
        },
      );

      console.log('User metadata :) ', JSON.stringify(userHeader));

      const { userId } = call.request;
      const userDto = new DetailedUserDto();
      userDto.userId = userId;

      // await validate input
      await validateDto(userDto);

      const user = await this.detailedUserUseCase.execute(userDto);
      console.log('User from useCase :) ', JSON.stringify(user, null, 2));
      const userResponse = new ResponseMapper<typeof user, GetDetailedUserResponse>({
        fields: {
          userId: 'id',
          email: 'email',
          status: 'status',
          avatar: 'avatar',
          role: 'role',
          biography: 'bio',
          facebook: 'facebook',
          headline: 'headline',
          instagram: 'instagram',
          firstName: 'firstName',
          lastName: 'lastName',
          language: 'language',
          linkedin: 'linkedin',
          phone: 'phone',
          website: 'website',
          createdAt: (): AsObject => dateToProtoTimestamp(user.createdAt),
          updatedAt: (): AsObject => dateToProtoTimestamp(user.updatedAt),
        },
      }).toResponse(user);
      console.log('User from response :) ', JSON.stringify(userResponse, null, 2));

      callback(null, userResponse);
    },
  );

  public changePassword = grpcUnaryHandler(
    async (
      call: ServerUnaryCall<ChangePasswordRequest, ChangePasswordResponse>,
      callback: sendUnaryData<ChangePasswordResponse>,
    ) => {
      const userHeader = parseMetadata<{ xUser: IJWTClaimWithUser; correlationId: string }>(
        call.metadata,
        {
          xUser: { header: 'x-user' },
          correlationId: { header: 'correlationId' },
        },
      );

      console.log('User metadata :) ', JSON.stringify(userHeader));

      const { userId, newPassword, oldPassword } = call.request;
      const passwordDto = new ChangePasswordDto();
      passwordDto.userId = userId;
      passwordDto.newPassword = newPassword;
      passwordDto.oldPassword = oldPassword;

      // await validate input
      await validateDto(passwordDto);

      const passwordUpdated = await this.changePasswordUseCase.execute(passwordDto);

      callback(null, { success: { updated: !!passwordUpdated } });
    },
  );
  public getAllUserEmails = grpcUnaryHandler(
    async (
      call: ServerUnaryCall<GetAllUserEmailsRequest, GetAllUserEmailsResponse>,
      callback: sendUnaryData<GetAllUserEmailsResponse>,
    ) => {
      console.log('Received call to GetAllUserEmails');
      const userHeader = parseMetadata<{ xUser: IJWTClaimWithUser; correlationId: string }>(
        call.metadata,
        {
          xUser: { header: 'x-user' },
          correlationId: { header: 'correlationId' },
        },
      );

      console.log('User metadata :) ', JSON.stringify(userHeader));

      // const { pagination } = call.request!;
      // const { page, pageSize } = pagination!;
      // const userDto = new CurrentUserDto();
      // userDto.userId = userId;

      // await validate input
      // await validateDto(userDto);

      const userEmails = await this.getAllEmailsUseCase.execute();
      console.log('User emails', JSON.stringify(userEmails, null, 2));
      // const userResponse = new ResponseMapper<{ email: string }, { email: string }>({
      //   fields: {
      //     email: 'email',
      //   },
      // }).toResponseList(userEmails);

      callback(null, { success: { email: userEmails } });
    },
  );
  public checkUserEmailExist = grpcUnaryHandler(
    async (
      call: ServerUnaryCall<CheckUserByEmailRequest, CheckUserByEmailResponse>,
      callback: sendUnaryData<CheckUserByEmailResponse>,
    ) => {
      const userHeader = parseMetadata<{ xUser: IJWTClaimWithUser; correlationId: string }>(
        call.metadata,
        {
          xUser: { header: 'x-user' },
          correlationId: { header: 'correlationId' },
        },
      );

      console.log('User metadata :) ', JSON.stringify(userHeader));

      const { email } = call.request;
      const emailDto = new EmailExistDto();
      emailDto.email = email;

      // await validate input
      await validateDto(emailDto);

      const emailExist = await this.checkEmailExistUseCase.execute(emailDto);

      const response = emailExist
        ? { success: `Account not registered with '${email}' `, error: 'None' }
        : { error: `An account already exist with '${email}' `, success: 'None' };

      callback(null, { response });
    },
  );

  public blockUser = grpcUnaryHandler(
    async (
      call: ServerUnaryCall<BlockUserRequest, BlockUserResponse>,
      callback: sendUnaryData<BlockUserResponse>,
    ) => {
      const userHeader = parseMetadata<{ xUser: IJWTClaimWithUser; correlationId: string }>(
        call.metadata,
        {
          xUser: { header: 'x-user' },
          correlationId: { header: 'correlationId' },
        },
      );

      console.log('User metadata :) ', JSON.stringify(userHeader));

      const { userId } = call.request;
      const userDto = new BlockUserDto();
      userDto.userId = userId;

      // await validate input
      await validateDto(userDto);

      const blockedUser = await this.blockUserUseCase.execute(userDto);

      callback(null, { success: { updated: !!blockedUser } });
    },
  );
  public unBlockUser = grpcUnaryHandler(
    async (
      call: ServerUnaryCall<UnBlockUserRequest, UnBlockUserResponse>,
      callback: sendUnaryData<UnBlockUserResponse>,
    ) => {
      const userHeader = parseMetadata<{ xUser: IJWTClaimWithUser; correlationId: string }>(
        call.metadata,
        {
          xUser: { header: 'x-user' },
          correlationId: { header: 'correlationId' },
        },
      );

      console.log('User metadata :) ', JSON.stringify(userHeader));

      const { userId } = call.request;
      const userDto = new UnBlockUserDto();
      userDto.userId = userId;

      // await validate input
      await validateDto(userDto);

      const blockedUser = await this.unBlockUserUseCase.execute(userDto);

      callback(null, { success: { updated: !!blockedUser } });
    },
  );

  public updateUserDetails = grpcUnaryHandler(
    async (
      call: ServerUnaryCall<UpdateUserDetailsRequest, UpdateUserDetailsResponse>,
      callback: sendUnaryData<UpdateUserDetailsResponse>,
    ) => {
      const userHeader = parseMetadata<{ xUser: IJWTClaimWithUser; correlationId: string }>(
        call.metadata,
        {
          xUser: { header: 'x-user' },
          correlationId: { header: 'correlationId' },
        },
      );
      console.log('User metadata :) ', JSON.stringify(userHeader));

      const { userId, firstName, lastName } = call.request!;
      const userDto = new UpdateUserDto();
      userDto.userId = userId;
      userDto.firstName = firstName;
      userDto.lastName = lastName;

      // await validate input
      await validateDto(userDto);

      const updatedUser = await this.updateUserUseCase.execute(userDto);

      const userResponse = new ResponseMapper<IUser, UserInfo>({
        fields: {
          userId: 'id',
          username: (): string => `${updatedUser!.firstName} ${updatedUser!.lastName}`,
          email: 'email',
          status: 'status',
          avatar: 'avatar',
          role: 'role',
          createdAt: (): AsObject => dateToProtoTimestamp(updatedUser!.createdAt),
          updatedAt: (): AsObject => dateToProtoTimestamp(updatedUser!.updatedAt),
        },
      }).toResponse(updatedUser!);

      callback(null, { user: userResponse });
    },
  );
}
