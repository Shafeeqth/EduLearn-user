import UnBlockUserDto from '@/application/dto/user/unblock-user.dto';
import { IUser } from '@/domain/interfaces/user';

/**
 * Interface representing the use case to Unblock associated user with given userId
 */
export interface IUnBlockUserUseCase {
  /**
   * @param userId ID of the User
   * @returns A Promise resolve to `IUser`
   */
  execute(dto: UnBlockUserDto): Promise<IUser>;
}
