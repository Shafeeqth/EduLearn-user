import { IsEmail } from 'class-validator';

export default class CurrentUserDto {
  @IsEmail({}, { message: 'Invalid email format' })
  userId: string;
}
