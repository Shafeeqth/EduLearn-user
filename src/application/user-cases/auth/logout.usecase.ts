import { inject, injectable } from 'inversify';
import { TYPES } from '@/shared/constants/identifiers';
import { UserStatus } from '@/shared/types/user-status';
import LogoutUserDto from '@/application/dto/auth/logout.dto';
import UserNotFoundError from '@/shared/errors/not-found-error';
import IUserRepository from '@/domain/repository/user.repository';
import ILogoutUserUseCase from '@/application/interfaces/auth/logout.interface';
// import { AuthType } from '@/shared/types/user-types';

@injectable()
export default class LogoutUserUseCaseImpl implements ILogoutUserUseCase {
  public constructor(
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
  ) {}
  public async execute(dto: LogoutUserDto): Promise<{ userId: string }> {
    // Checks whether user exist with provided email
    const user = await this.userRepository.findById(dto.userId);

    // Creates user if user not already exists
    if (!user) {
      throw new UserNotFoundError('user not found with provided userId');
    }

    // Mark user status as not active
    user.status = UserStatus.NOT_ACTIVE;

    // Save user to db
    await this.userRepository.update(user.id, user);
    return { userId: user.id };
  }
}
