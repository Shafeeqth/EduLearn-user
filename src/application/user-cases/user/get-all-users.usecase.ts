import { inject, injectable } from 'inversify';
import { TYPES } from '@/shared/constants/identifiers';
import IUserRepository from '@/domain/repository/user.repository';
import { IUser } from '@/domain/interfaces/user';
import { IGetAllUsersUseCase } from '@/application/interfaces/user/get-all-users';
import GetAllUsersDto from '@/application/dto/user/get-all-users';

@injectable()
export default class GetAllUsersUseCaseImpl implements IGetAllUsersUseCase {
  public constructor(
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
  ) {}
  public async execute(dto: GetAllUsersDto): Promise<IUser[]> {
    // Checks users with limit and offset
    const users = await this.userRepository.getAllUsers(dto.page, dto.pageSize);

    return users;
  }
}
