import Auth2SignDto from '@/application/dto/auth/auth2-sign.dto';
import { IUserWithAuthToken } from '@/shared/types/user-with-auth-token';

export default interface IAuth2SignUseCase {
  /**
   * Creates user with given user data if the use not exist, returns `IUserWithAuthToken`
   * @param dto - User data transferred from client
   * @returns A promise that resolve to `IUserWithAuthToken`
   */
  execute(dto: Auth2SignDto): Promise<IUserWithAuthToken>;
}
