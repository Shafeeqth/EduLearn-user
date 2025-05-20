import { inject, injectable } from 'inversify';
import { TYPES } from '@/shared/constants/identifiers';
import IUserRepository from '@/domain/repository/user.repository';
import { IUser } from '@/domain/interfaces/user';
import UserNotFoundError from '@/shared/errors/not-found-error';
import UpdateUserDto from '@/application/dto/user/update-user.dto';
import { IUpdateUserUseCase } from '@/application/interfaces/user/update-user.interface';

@injectable()
export default class UpdateUserUseCaseImpl implements IUpdateUserUseCase {
  public constructor(
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
  ) {}
  public async execute(dto: UpdateUserDto): Promise<IUser | null> {
    // Checks whether user exist with provided userId
    const user = await this.userRepository.findById(dto.userId);

    // Throws an error if user NOT exist with given userId
    if (!user) throw new UserNotFoundError();

    user.avatar = dto.avatar;
    user.bio = dto.biography;
    user.facebook = dto.facebook;
    user.firstName = dto.firstName;
    user.lastName = dto.lastName;
    user.headline = dto.headline;
    user.instagram = dto.instagram;
    user.language = dto.language;
    user.linkedin = dto.linkedin;
    user.website = dto.website;
    user.phone = dto.phone;

    // Copy all enumerable properties from dto into user, override existing properties if any
    // Object.assign(user, tempUser);

    return await this.userRepository.update(user.id, user);

    // // Return updated user
    // return user;
  }
}
