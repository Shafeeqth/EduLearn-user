import { IUser } from '@/domain/interfaces/user';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export default class UpdateUserDto implements Partial<IUser> {
  @IsUUID(undefined, { message: '`userId` must be type UUID' })
  userId!: string;

  @IsOptional()
  @IsString({ message: 'Must be type string' })
  firstName?: string | undefined;

  @IsOptional()
  @IsString({ message: 'Must be type string' })
  lastName?: string | undefined;

  // @IsEnum(UserRoles)
  // role!: UserRoles;

  // @IsString({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  // status: UserStatus;

  @IsOptional()
  @IsString()
  headline?: string;

  @IsOptional()
  @IsString()
  biography?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  facebook?: string;

  @IsOptional()
  @IsString()
  instagram?: string;

  @IsOptional()
  @IsString()
  linkedin?: string;

  @IsOptional()
  @IsString({ message: 'Must be type string' })
  phone?: string | undefined;

  @IsOptional()
  @IsString({ message: 'Must be type string' })
  avatar?: string | undefined;
}
