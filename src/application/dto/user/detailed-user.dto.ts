import { IsString } from 'class-validator';

export default class DetailedUserDto {
  @IsString({ message: 'userId must be string' })
  userId: string;
}
