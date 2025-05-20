import DetailedUserDto from '@/application/dto/user/detailed-user.dto';
import { IUser } from '@/domain/interfaces/user';

/**
 * Interface representing the use case to fetch detailed Info of user
 * using a provided userId.
 */
export interface IDetailedUserUseCase {
  /**
   * @param userId ID of the User
   * @returns A Promise resolve to `IUser`
   */
  execute(dto: DetailedUserDto): Promise<IUser>;
}
