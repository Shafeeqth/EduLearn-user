import RegisterUserDto from '@/application/dto/auth/register-user.dto';
import { IUser } from '@/domain/interfaces/user';

export default interface IRegisterUserUseCase {
  /**
   * Creates user with given user data and saves in database
   * @param dto - User data transferred from client
   * @returns A promise that resolve to the created user data
   */
  execute(dto: RegisterUserDto): Promise<IUser>;
}
