import { inject, injectable } from 'inversify';
import IRegisterUserUseCase from '../interfaces/auth/register-user.interface';
import { TYPES } from '@/shared/constants/identifiers';
import IHashService from '../services/hash.service';
import IUserRepository from '@/domain/repository/user.repository';
import IUUIDService from '../services/uuid.service';
import { IUser } from '@/domain/interfaces/user';
import RegisterUserDto from '../dto/auth/register-user.dto';
import EmailAlreadyExist from '@/shared/errors/user-already-exist.error';
import User from '@/domain/entity/user';
import { ICacheService } from '../services/cache.service';
import { CacheServiceImpl } from '@/infrastructure/services/cache.service';

@injectable()
export default class RegisterUserUseCaseImpl implements IRegisterUserUseCase {
  // private readonly cacheService: ICacheService;
  public constructor(
    @inject(TYPES.IHashService) private readonly hashService: IHashService,
    @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
    @inject(TYPES.IUUIDService) private readonly uuidService: IUUIDService,
    @inject(TYPES.ICacheService) private readonly cacheService: ICacheService,
  ) {
    // want to correct the IoC principle
    // this.cacheService = new CacheServiceImpl();
  }
  public async execute(dto: RegisterUserDto): Promise<IUser> {
    // Checks whether user already exist with provided email
    const alreadyExist = await this.userRepository.findByEmail(dto.email);

    // Throws an error if user already exist with given email
    if (alreadyExist) throw new EmailAlreadyExist();

    // Hash the given password to not store password as plain text to db.
    const hashedPassword = await this.hashService.hash(dto.password);

    // Generate UUID for userId, so to avoid distributed id conflict
    const userUuid = this.uuidService.generate();

    const [firstName, ...lastName] = dto.username!.split(' ');
    const user = new User(
      userUuid,
      dto.email,
      hashedPassword,
      dto.role,
      firstName,
      lastName.join(' '),
      dto.avatar,
    );

    // Save user data into redis.
    await this.cacheService.setValue(user.email.toString(), user);

    return user;
  }
}
