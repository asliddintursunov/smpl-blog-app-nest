import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Custom error message';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();

      const responseBody = exception.getResponse();

      if (typeof responseBody === 'string') {
        message = responseBody;
      } else if (typeof responseBody === 'object' && responseBody !== null) {
        const maybeMsg =
          'message' in responseBody
            ? (responseBody as { message?: unknown }).message
            : undefined;

        if (Array.isArray(maybeMsg)) {
          message = maybeMsg.join(', ');
        } else if (typeof maybeMsg === 'string') {
          message = maybeMsg;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message || message;
    }

    res.status(statusCode).json({
      statusCode,
      timestamp: new Date().toISOString(),
      path: req.originalUrl || req.url,
      message,
    });
  }
}
