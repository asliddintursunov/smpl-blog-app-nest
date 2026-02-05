import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startedAt = Date.now();

    const http = context.switchToHttp();
    const req = http.getRequest<ExpressRequest>();

    const method = req.method;
    const url = req.originalUrl || req.url;

    return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - startedAt;
        this.logger.log(`${method} ${url} +${ms}ms`);
      }),
      map((data: never) => ({
        success: true,
        data,
      })),
    );
  }
}
