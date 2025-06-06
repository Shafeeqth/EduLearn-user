import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export default class LoginUserDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsOptional()
  password!: string;

  // authType!: string
}
