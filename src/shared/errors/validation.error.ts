import { BaseError, ErrorCodes, ErrorStatusCodes } from '@mdshafeeq-repo/edulearn-common';
import { ValidationError as InvalidError } from 'class-validator';

export class ValidationError extends BaseError {
  public errorCode: ErrorCodes.INVALID_ARGUMENT = ErrorCodes.INVALID_ARGUMENT;
  public statusCode: ErrorStatusCodes.INVALID_ARGUMENT = ErrorStatusCodes.INVALID_ARGUMENT;

  public constructor(private errors: InvalidError[]) {
    super('Invalid request parameters ');
    console.log(errors);

    Object.setPrototypeOf(this, this.constructor.prototype);
  }

  public serializeErrors(): { message: string; field?: string }[] {
    // return this.errors.target.map((err) => {
    //   return { message: err.message, field: String(err.path) };
    // });

    return [{ message: this.message }];
  }
}
