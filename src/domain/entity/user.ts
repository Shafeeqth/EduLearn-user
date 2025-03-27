import { UserRoles } from '@/shared/types/user-roles';
import { IUser } from '../interfaces/user';

export default class User implements IUser {
  public isVerified: boolean = false;
  public createdAt: Date;
  public updatedAt: Date;
  public lastLogin: Date;

  public constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly password: string,
    public role: UserRoles,
    public firstName?: string,
    public lastName?: string,
    public phone?: string,
    public avatar?: string,
  ) {
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.lastLogin = new Date();
  }
}
