export default interface ITokenService {
  /**
   * Signs the given data and returns a an Access token.
   * @param data - The data to sign.
   * @returns return the signed token.
   */
  generateAccessToken<T extends IJwtUserData>(data: T): string;

  /**
   * Signs the given data and returns a an Refresh token.
   * @param data - The data to sign.
   * @returns A promise that resolves to the signed token.
   */
  generateRefreshToken<T extends IJwtUserData>(data: T): string;

  /**
   * Decodes the given token and returns the decoded Access token data.
   * @param token - The token to decode.
   * @returns A promise that resolves to the decoded data.
   */
  decodeAccessToken<T>(token: string): Promise<T>;

  /**
   * Decodes the given token and returns the decoded Refresh token data.
   * @param token - The token to decode.
   * @returns A promise that resolves to the decoded data.
   */
  decodeRefreshToken<T>(token: string): Promise<T>;
}

export interface IJwtUserData {
  userId: string;
  role: string;
  username: string;
  avatar?: string;
}

export interface StandardJwtClaims {
  iat: number;
  iss: string;
  aud: string;
  jti: string;
  exp?: number;
  sub?: string;
}

export interface IJWTClaimWithUser extends StandardJwtClaims {
  user: IJwtUserData;
}
