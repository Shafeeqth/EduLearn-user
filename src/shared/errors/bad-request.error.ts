import { ErrorCodes, ErrorStatusCodes } from '@mdshafeeq-repo/edulearn-common';
import { GrpcError } from './grpc.error';

export default class BadRequestError extends GrpcError {
  errorCode: ErrorCodes.BAD_REQUEST = ErrorCodes.BAD_REQUEST;
  public statusCode: ErrorStatusCodes.BAD_REQUEST = ErrorStatusCodes.BAD_REQUEST;
  constructor(message?: string) {
    super(message || 'invalid parameters!. please check request parameters ');

    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [
      {
        message: this.message || 'invalid request parameters',
      },
    ];
  }
}
