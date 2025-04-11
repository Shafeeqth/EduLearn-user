import { IsEmail, IsNotEmpty } from 'class-validator';

export default class NewRefreshTokenDto {
  @IsNotEmpty({ message: 'Token required' })
  @IsEmail({}, { message: 'Invalid email format' })
  refreshToken!: string;
}
