import { AuthType, UserRoles } from '@/shared/types/user-types';
import { IUser } from '../interfaces/user';
import { UserStatus } from '@/shared/types/user-status';

export default class User implements IUser {
  public status: UserStatus = UserStatus.NOT_VERIFIED;
  public createdAt: Date;
  public updatedAt: Date;
  public lastLogin: Date;

  public constructor(
    public readonly id: string,
    public readonly email: string,
    public authType: AuthType,
    public role: UserRoles,
    public readonly password?: string,
    public firstName?: string,
    public lastName?: string,
    public avatar?: string,
    public phone?: string,
  ) {
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.lastLogin = new Date();
  }
}
