import { logger } from './setup'; // Correct import path
import { context, trace } from '@opentelemetry/api'; // Import OpenTelemetry context API

// Define a more robust LogContext interface
interface LogContext {
  traceId?: string; // OpenTelemetry Trace ID
  spanId?: string; // OpenTelemetry Span ID
  userId?: string; // Logged-in user ID
  correlationId?: string; // General correlation ID if different from traceId
  service?: string;
  environment?: string;
  // Allows arbitrary additional context properties
  [key: string]: unknown;
}

export class LoggingService {
  private readonly serviceName: string;
  public static instance: LoggingService;

  public constructor(serviceName: string) {
    // Service name is mandatory
    if (!LoggingService.instance) {
      this.serviceName = serviceName;
      LoggingService.instance = this;
    }
    return LoggingService.instance;
  }

  // Private helper to build common log entry structure
  private buildLogEntry(level: string, message: string, logContext?: LogContext) {
    // Get current active OpenTelemetry span context for correlation
    const activeSpan = trace.getSpan(context.active());
    const spanContext = activeSpan?.spanContext();

    return {
      level,
      message,
      // Prioritize traceId/spanId from active OpenTelemetry context
      traceId: spanContext?.traceId,
      spanId: spanContext?.spanId,
      // Fallback to context provided if not from active span
      userId: logContext?.userId,
      correlationId: logContext?.correlationId,
      service: logContext?.service || this.serviceName,
      environment: process.env.NODE_ENV || 'development',
      // Include any other custom context provided directly
      ...logContext,
    };
  }

  // Use winston's logger directly with metadata object
  info(message: string, context?: LogContext): void {
    const logEntry = this.buildLogEntry('info', message, context);
    logger.info(message, logEntry);
  }

  error(message: string, context?: LogContext): void {
    const logEntry = this.buildLogEntry('error', message, context);
    logger.error(message, logEntry);
  }

  warn(message: string, context?: LogContext): void {
    // Renamed from warning to warn for consistency with Winston
    const logEntry = this.buildLogEntry('warn', message, context);
    logger.warn(message, logEntry);
  }

  debug(message: string, context?: LogContext): void {
    const logEntry = this.buildLogEntry('debug', message, context);
    logger.debug(message, logEntry);
  }
}
