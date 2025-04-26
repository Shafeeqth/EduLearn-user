import { inject, injectable } from 'inversify';
import { TYPES } from '@/shared/constants/identifiers';
import IUserRepository from '@/domain/repository/user.repository';
import { IUser } from '@/domain/interfaces/user';
import { ICurrentUserUseCase } from '@/application/interfaces/user/get-current-user';
import CurrentUserDto from '@/application/dto/user/current-user.dto';
import UserNotFoundError from '@/shared/errors/not-found-error';

@injectable()
export default class CurrentUserUseCaseImpl implements ICurrentUserUseCase {
  public constructor(
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
  ) {}
  public async execute(dto: CurrentUserDto): Promise<IUser> {
    // Checks whether user already exist with provided email
    const user = await this.userRepository.findById(dto.userId);

    // Throws an error if user already exist with given email
    if (!user) throw new UserNotFoundError();

    return user;
  }
}
