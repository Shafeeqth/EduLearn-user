import BlockUserDto from '@/application/dto/user/block-user.dto';
import { IUser } from '@/domain/interfaces/user';

/**
 * Interface representing the use case to bock associated user with given userId
 */
export interface IBlockUserUseCase {
  /**
   * @param userId ID of the User
   * @returns A Promise resolve to `IUser`
   */
  execute(dto: BlockUserDto): Promise<IUser>;
}
