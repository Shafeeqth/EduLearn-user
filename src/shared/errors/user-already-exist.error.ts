import { ErrorCodes, ErrorStatusCodes } from '@mdshafeeq-repo/edulearn-common';
import { GrpcError } from './grpc.error';

export default class EmailAlreadyExist extends GrpcError {
  errorCode: ErrorCodes.EMAIL_ALREADY_REGISTERED = ErrorCodes.EMAIL_ALREADY_REGISTERED;
  public statusCode: ErrorStatusCodes = ErrorStatusCodes.EMAIL_ALREADY_REGISTERED;
  constructor(message?: string) {
    super(message || 'user already exist with given email');

    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [
      {
        message:
          this.message || 'user already exist with given email, please check email and try again.',

        field: 'email',
      },
    ];
  }
}
