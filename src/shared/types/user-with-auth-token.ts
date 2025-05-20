import { IUser } from '@/domain/interfaces/user';
import { IAuthTokens } from './auth.tokens';

export interface IUserWithAuthToken extends IAuthTokens {
  user: IUser;
}
