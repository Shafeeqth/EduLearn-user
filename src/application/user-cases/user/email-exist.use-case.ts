import { inject, injectable } from 'inversify';
import { TYPES } from '@/shared/constants/identifiers';
import IUserRepository from '@/domain/repository/user.repository';
import { ICheckEmailExistUseCase } from '@/application/interfaces/user/email-exist.use-case';
import EmailExistDto from '@/application/dto/user/email-exist.dto';

@injectable()
export default class CheckEmailExistUseCaseImpl implements ICheckEmailExistUseCase {
  public constructor(
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
  ) {}
  public async execute(dto: EmailExistDto): Promise<boolean> {
    // Checks users with limit and offset
    const user = await this.userRepository.findByEmail(dto.email);

    return !!user;
  }
}
