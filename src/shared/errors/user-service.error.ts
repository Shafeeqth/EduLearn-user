import { BaseError, ErrorCodes, ErrorStatusCodes } from '@mdshafeeq-repo/edulearn-common';

export abstract class UserServiceError extends BaseError {
  abstract errorCode: ErrorCodes;
  abstract statusCode: ErrorStatusCodes;

  constructor(message?: string) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
