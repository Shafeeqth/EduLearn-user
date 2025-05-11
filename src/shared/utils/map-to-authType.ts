import { AuthType } from '../types/user-types';

export const mapToAuthType = (type: string) => {
  switch (type) {
    case AuthType.EMAIL:
      return AuthType.EMAIL;
    case AuthType.OAUTH_2:
      return AuthType.OAUTH_2;
    default:
      throw Error('Invalid auth type');
  }
};
