import { IsNotEmpty, IsUUID } from 'class-validator';

export default class LogoutUserDto {
  @IsNotEmpty({ message: 'userId is  required' })
  @IsUUID(undefined, { message: '`userId` must be typeof UUID' })
  userId!: string;
}
