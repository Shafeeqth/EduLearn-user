import { IsEmail, IsNotEmpty, MinLength, IsEnum, IsString } from 'class-validator';
import { UserRoles } from '@/shared/types/user-roles';
import { IUser } from '@/domain/interfaces/user';

export default class RegisterUserDto implements Partial<IUser> {
  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;

  @IsNotEmpty({ message: 'Avatar is required' })
  @IsString({ message: 'Avatar must be a valid string' })
  avatar?: string;

  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  username?: string;

  @IsEnum(UserRoles, { message: 'Role must be one of the valid user roles' })
  role: UserRoles;
}
