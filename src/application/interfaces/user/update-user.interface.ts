import UpdateUserDto from '@/application/dto/user/update-user.dto';
import { IUser } from '@/domain/interfaces/user';

/**
 * Interface representing the use-case to update user data
 */
export interface IUpdateUserUseCase {
  /**
   * @param dto represents user data to update
   * @returns A Promise resolve to `IUser`
   */
  execute(dto: UpdateUserDto): Promise<IUser | null>;
}
