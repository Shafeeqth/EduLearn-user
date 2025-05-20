import RegisterInstructorDto from '@/application/dto/user/register-instructor.dto';
import { IUser } from '@/domain/interfaces/user';
import { IAuthTokens } from '@/shared/types/auth.tokens';

/**
 * Interface representing the use case to bock associated user with given userId
 */
export interface IRegisterInstructorUseCase {
  /**
   * @param userId ID of the User
   * @returns A Promise resolve to `IUser`
   */
  execute(dto: RegisterInstructorDto): Promise<IAuthTokens & { user: IUser }>;
}
