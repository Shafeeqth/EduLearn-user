import { inject, injectable } from 'inversify';
import { TYPES } from '@/shared/constants/identifiers';
import IUserRepository from '@/domain/repository/user.repository';
import { IUser } from '@/domain/interfaces/user';
import UserNotFoundError from '@/shared/errors/not-found-error';
import { IBlockUserUseCase } from '@/application/interfaces/user/block-user.interface';
import BlockUserDto from '@/application/dto/user/block-user.dto';
import { UserStatus } from '@/shared/types/user-status';

@injectable()
export default class BlockUserUserCaseImpl implements IBlockUserUseCase {
  public constructor(
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
  ) {}
  public async execute(dto: BlockUserDto): Promise<IUser> {
    // Checks whether user exist with provided userId
    const user = await this.userRepository.findById(dto.userId);

    // Throws an error if user NOT exist with given userId
    if (!user) throw new UserNotFoundError();

    // Change user status to blocked
    user.status = UserStatus.BLOCKED;

    await this.userRepository.update(user.id, user);

    // Return updated user
    return user;
  }
}
