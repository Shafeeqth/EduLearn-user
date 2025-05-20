import { getEnvs } from '@mdshafeeq-repo/edulearn-common';
import ITokenService, {
  IJWTClaimWithUser,
  IJwtUserData,
  StandardJwtClaims,
} from '../../application/services/token.service';
import jwt from 'jsonwebtoken';
import { v4 } from 'uuid';
import type { StringValue } from 'ms';
import { injectable } from 'inversify';
export type JwtSignOptions = jwt.SignOptions;

const {
  JWT_REFRESH_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_EXPIRY,
  JWT_REFRESH_TOKEN_EXPIRY,
  SERVICE_NAME,
} = getEnvs(
  'JWT_ACCESS_TOKEN_SECRET',
  'JWT_REFRESH_TOKEN_SECRET',
  'JWT_ACCESS_TOKEN_EXPIRY',
  'JWT_REFRESH_TOKEN_EXPIRY',
  'SERVICE_NAME',
);

const defaultStandardJwtClaims: StandardJwtClaims = {
  iat: Date.now(),
  iss: SERVICE_NAME,
  aud: 'EduLean-frontend',
  jti: v4(),
};

@injectable()
export default class TokenServiceImpl implements ITokenService {
  public constructor() {}

  public decodeAccessToken<T>(token: string): Promise<T> {
    return new Promise((resolve, reject) => {
      return jwt.verify(token, JWT_ACCESS_TOKEN_SECRET, (err, decode) => {
        if (err) reject(err);
        resolve(decode as T);
      });
    });
  }

  public decodeRefreshToken<T>(token: string): Promise<T> {
    return new Promise((resolve, reject) => {
      return jwt.verify(token, JWT_REFRESH_TOKEN_SECRET, (err, decode) => {
        if (err) reject(err);
        resolve(decode as T);
      });
    });
  }

  public generateAccessToken<T extends IJwtUserData>(data: T): string {
    const claims = { ...defaultStandardJwtClaims, user: data };
    return jwt.sign(claims as IJWTClaimWithUser, JWT_ACCESS_TOKEN_SECRET as jwt.Secret, {
      algorithm: 'HS256',
      expiresIn: JWT_ACCESS_TOKEN_EXPIRY.toString() as StringValue,
    });
  }

  public generateRefreshToken<T extends IJwtUserData>(data: T): string {
    const claims = { ...defaultStandardJwtClaims, user: data };
    return jwt.sign(claims as IJWTClaimWithUser, JWT_REFRESH_TOKEN_SECRET, {
      algorithm: 'HS256',
      expiresIn: JWT_REFRESH_TOKEN_EXPIRY.toString() as StringValue,
    });
  }
}
