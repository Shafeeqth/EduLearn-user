import { ErrorCodes, ErrorStatusCodes } from '@mdshafeeq-repo/edulearn-common';
import { GrpcError } from './grpc.error';

export default class UserNotFoundError extends GrpcError {
  errorCode: ErrorCodes = ErrorCodes.NOT_FOUND;
  public statusCode: ErrorStatusCodes = ErrorStatusCodes.NOT_FOUND;

  constructor(message?: string) {
    super(message || 'Invalid userId.');

    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: this.message || 'Invalid userId., user not found with specified id!.' }];
  }
}
