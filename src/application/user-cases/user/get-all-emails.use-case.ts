import { inject, injectable } from 'inversify';
import { TYPES } from '@/shared/constants/identifiers';
import IUserRepository from '@/domain/repository/user.repository';
import { IGetAllEmailsUseCase } from '@/application/interfaces/user/get-all-emails.use-case';

@injectable()
export default class GetAllEmailsUseCaseImpl implements IGetAllEmailsUseCase {
  public constructor(
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
  ) {}
  public async execute(): Promise<string[]> {
    const userEmails = await this.userRepository.getAllUserEmails();

    return userEmails;
  }
}
