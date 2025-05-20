import EmailExistDto from '@/application/dto/user/email-exist.dto';

/**
 * Interface representing the use case to check given email exist or not
 */
export interface ICheckEmailExistUseCase {
  /**
   * @param email ID of the User
   * @returns A Promise resolve to boolean value
   */
  execute(dto: EmailExistDto): Promise<boolean>;
}
