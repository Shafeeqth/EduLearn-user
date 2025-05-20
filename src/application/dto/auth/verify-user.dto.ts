import { IsEmail } from 'class-validator';
import { IUser } from '@/domain/interfaces/user';

export default class VerifyUserDto implements Partial<IUser> {
  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;
}
