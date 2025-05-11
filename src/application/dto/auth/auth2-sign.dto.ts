import { IsEmail, IsNotEmpty, MinLength, IsEnum, IsString } from 'class-validator';
import { AuthType, UserRoles } from '@/shared/types/user-types';
import { IUser } from '@/domain/interfaces/user';

export default class Auth2SignDto implements Partial<IUser> {
  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;

  @IsNotEmpty({ message: 'Avatar is required' })
  @IsString({ message: 'Avatar must be a valid string' })
  avatar?: string;

  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  username?: string;

  @IsEnum(UserRoles, { message: 'Role must be one of the valid user roles' })
  role: UserRoles;

  @IsEnum(AuthType, { message: 'AuthType must be one of the valid auth types' })
  authType: AuthType;
}
