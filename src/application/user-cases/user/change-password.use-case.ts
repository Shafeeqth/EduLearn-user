import { inject, injectable } from 'inversify';
import { TYPES } from '@/shared/constants/identifiers';
import IUserRepository from '@/domain/repository/user.repository';
import UserNotFoundError from '@/shared/errors/not-found-error';
import { IChangePasswordUseCase } from '@/application/interfaces/user/change-password.inteface';
import ChangePasswordDto from '@/application/dto/user/change-password.dto';
import IHashService from '@/application/services/hash.service';
import BadRequestError from '@/shared/errors/bad-request.error';

@injectable()
export default class ChangePasswordUseCaseImpl implements IChangePasswordUseCase {
  public constructor(
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
    @inject(TYPES.IHashService) private readonly hashService: IHashService,
  ) {}
  public async execute(dto: ChangePasswordDto): Promise<{ userId: string }> {
    // Checks whether user exist with provided email
    const user = await this.userRepository.findById(dto.userId);

    // Throws an error if user NOT exist with given email
    if (!user) throw new UserNotFoundError();

    if (user.password) {
      const passwordMatch = await this.hashService.compare(user.password, dto.oldPassword);
      console.log(passwordMatch, 'change apsswordF');

      if (!passwordMatch)
        throw new BadRequestError(
          'Incorrect `currentPassword`, please check credential and try again',
        );
    }

    const hashedPassword = await this.hashService.hash(dto.newPassword);

    user.password = hashedPassword;

    await this.userRepository.update(dto.userId, user);

    return { userId: user.id };
  }
}
