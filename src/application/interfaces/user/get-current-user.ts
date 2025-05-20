import CurrentUserDto from '@/application/dto/user/current-user.dto';
import { IUser } from '@/domain/interfaces/user';

/**
 * Interface representing the use case to fetch Currently logged in user
 * using a provided userID.
 */
export interface ICurrentUserUseCase {
  /**
   * @param userId ID of the User
   * @returns A Promise resolve to `IUser`
   */
  execute(dto: CurrentUserDto): Promise<IUser>;
}
