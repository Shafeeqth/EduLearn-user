import { inject, injectable } from 'inversify';
import { TYPES } from '@/shared/constants/identifiers';
import IUserRepository from '@/domain/repository/user.repository';
import { IUser } from '@/domain/interfaces/user';
import UserNotFoundError from '@/shared/errors/not-found-error';
import { IDetailedUserUseCase } from '@/application/interfaces/user/get-detailed-user.interface';
import DetailedUserDto from '@/application/dto/user/detailed-user.dto';

@injectable()
export default class DetailedUserUseCaseImpl implements IDetailedUserUseCase {
  public constructor(
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
  ) {}
  public async execute(dto: DetailedUserDto): Promise<IUser> {
    // Checks whether user exist with provided email
    const user = await this.userRepository.findById(dto.userId);

    // Throws an error if user NOT exist with given email
    if (!user) throw new UserNotFoundError();

    return user;
  }
}
