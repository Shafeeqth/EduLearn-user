import VerifyUserDto from '@/application/dto/auth/verify-user.dto';
import { IUserWithAuthToken } from '@/shared/types/user-with-auth-token';

/**
 * Interface representing the use case for verifying user with 
 * using a provided refresh token.
 */
export interface IVerifyUserUseCase {
  /**
   * @param dto User data transferred from client
   * @returns A Promise resolve to `IUserWithAuthToken`
   */
  execute(dto: VerifyUserDto): Promise<IUserWithAuthToken>;
}
