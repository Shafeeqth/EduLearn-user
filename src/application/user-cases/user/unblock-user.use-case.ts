import { inject, injectable } from 'inversify';
import { TYPES } from '@/shared/constants/identifiers';
import IUserRepository from '@/domain/repository/user.repository';
import { IUser } from '@/domain/interfaces/user';
import UserNotFoundError from '@/shared/errors/not-found-error';
import { UserStatus } from '@/shared/types/user-status';
import { IUnBlockUserUseCase } from '@/application/interfaces/user/unblock-user.interface';
import UnBlockUserDto from '@/application/dto/user/unblock-user.dto';

@injectable()
export default class UnBlockUserUserCaseImpl implements IUnBlockUserUseCase {
  public constructor(
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
  ) {}
  public async execute(dto: UnBlockUserDto): Promise<IUser> {
    // Checks whether user exist with provided userId
    const user = await this.userRepository.findById(dto.userId);

    // Throws an error if user NOT exist with given userId
    if (!user) throw new UserNotFoundError();

    // Change user status to blocked
    user.status = UserStatus.ACTIVE;

    await this.userRepository.update(user.id, user);

    // Return updated user
    return user;
  }
}
