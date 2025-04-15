import { BaseError, ErrorCodes, ErrorStatusCodes } from '@mdshafeeq-repo/edulearn-common';

export class GrpcError extends BaseError {
  public statusCode: ErrorStatusCodes;
  public errorCode: ErrorCodes;
  public constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
  }

  public serializeErrors(): { message: string; field?: string }[] {
    return [{ message: this.message }];
  }

  public getResolutionSteps(): string[] {
    return [
      'Check the request parameters',
      'Verify the service is running',
      'Review the server logs for more details ',
    ];
  }
  // private mapGrpcStatusToHttpStatus = (grpcStatus: status): number => {
  //   const statusMap: { [key in status]?: number } = {
  //     [status.OK]: 200,
  //     [status.INVALID_ARGUMENT]: 400,
  //     [status.NOT_FOUND]: 404,
  //     [status.ALREADY_EXISTS]: 409,
  //     [status.PERMISSION_DENIED]: 403,
  //     [status.UNAUTHENTICATED]: 401,
  //     [status.RESOURCE_EXHAUSTED]: 429,
  //     [status.FAILED_PRECONDITION]: 412,
  //     [status.ABORTED]: 409,
  //     [status.DEADLINE_EXCEEDED]: 504,
  //     [status.INTERNAL]: 500,
  //     [status.UNAVAILABLE]: 503,
  //     [status.DATA_LOSS]: 500,
  //     [status.UNKNOWN]: 500,
  //   };
  //   return statusMap[grpcStatus] || 500;
  // };
}
