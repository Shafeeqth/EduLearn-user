import NewRefreshTokenDto from '@/application/dto/auth/new-refresh-token.dto';
import VerifyUserDto from '@/application/dto/auth/verify-user.dto';


/**
 * Interface representing the use case for retrieving new authentication tokens
 * using a provided refresh token.
 */
export interface IVerifyUserUseCase {
  /**
   * @param token Refresh token  to be verified
   * @returns A Promise resolve to `IAuthTokens`
   */
  execute(dto: VerifyUserDto): Promise<void>;
}
