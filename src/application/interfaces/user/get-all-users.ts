import GetAllUsersDto from '@/application/dto/user/get-all-users';
import { IUser } from '@/domain/interfaces/user';

/**
 * Interface representing the use case to fetch all users who logged into App
 */
export interface IGetAllUsersUseCase {
  /**
   * @param page A number represents current page
   * @param pageSize Number indicating count of documents in a page
   * @returns A Promise resolve to array of `IUser`
   */
  execute(dto: GetAllUsersDto): Promise<IUser[]>;
}
