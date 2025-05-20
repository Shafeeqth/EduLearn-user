import { IsString } from 'class-validator';

export default class RegisterInstructorDto {
  @IsString({ message: 'userId must be string' })
  userId: string;
}
