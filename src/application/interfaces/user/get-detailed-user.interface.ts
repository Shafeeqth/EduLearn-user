import DetailedUserDto from '@/application/dto/user/detailed-user.dto';
import { IUser } from '@/domain/interfaces/user';

/**
 * Interface representing the use case to fetch Currently logged in user
 * using a provided userID.
 */
export interface IDetailedUserUseCase {
  /**
   * @param userId ID of the User
   * @returns A Promise resolve to `IUser`
   */
  execute(dto: DetailedUserDto): Promise<IUser>;
}
