import {  IsNotEmpty } from 'class-validator';

export default class NewRefreshTokenDto {
  @IsNotEmpty({ message: 'Token required' })
  refreshToken!: string;
}
