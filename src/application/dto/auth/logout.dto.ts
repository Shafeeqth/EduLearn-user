import { IsNotEmpty } from 'class-validator';

export default class LogoutUserDto {
  @IsNotEmpty({ message: 'userId is  required' })
  userId!: string;
}
