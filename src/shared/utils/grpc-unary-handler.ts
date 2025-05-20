import { sendUnaryData, ServerUnaryCall, ServerWritableStream } from '@grpc/grpc-js';
import grpcErrorHandler from './grpc-error-handler';
import { GrpcStreamHandler, GrpcUnaryHandler } from '@mdshafeeq-repo/edulearn-common';

// Wrapper for unary gRPC handlers with retry support
export const grpcUnaryHandler = <Request, Response>(
  handler: GrpcUnaryHandler<Request, Response>,
): GrpcUnaryHandler<Request, Response> => {
  return async (call: ServerUnaryCall<Request, Response>, callback: sendUnaryData<Response>) => {
    try {
      await handler(call, callback);
    } catch (error) {
      grpcErrorHandler(error as Error, callback);
    }
  };
};

// Wrapper for streaming gRPC handlers with retry support
export const grpcStreamHandler = <Request, Response>(
  handler: GrpcStreamHandler<Request, Response>,
): GrpcStreamHandler<Request, Response> => {
  return async (call: ServerWritableStream<Request, Response>) => {
    try {
      await handler(call);
    } catch (error) {
      grpcErrorHandler(error as Error, call);
    }
  };
};
