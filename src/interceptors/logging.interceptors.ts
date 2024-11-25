// import {
//   CallHandler,
//   ExecutionContext,
//   Injectable,
//   Logger,
//   NestInterceptor,
// } from '@nestjs/common';
// import { Observable, tap } from 'rxjs';

// @Injectable()
// export class LoggingInterceptor implements NestInterceptor {
//   private readonly logger = new Logger(LoggingInterceptor.name);

//   intercept(
//     context: ExecutionContext,
//     next: CallHandler<any>,
//   ): Observable<any> | Promise<Observable<any>> {
//     const request = context.switchToHttp().getRequest();
//     const userAgent = request.get('user-agent') || '';
//     const { ip, method, path: url } = request;

//     this.logger.log(
//       this.formatIncomingRequestLog(method, url, userAgent, ip, context),
//     );

//     const now = Date.now();
//     return next.handle().pipe(
//       tap(() => {
//         const response = context.switchToHttp().getResponse();
//         const { statusCode } = response;
//         const contentLength = response.get('content-length') || '-';

//         this.logger.log(
//           this.formatOutgoingResponseLog(
//             method,
//             url,
//             statusCode,
//             contentLength,
//             userAgent,
//             ip,
//             now,
//             Date.now() - now,
//           ),
//         );
//       }),
//     );
//   }

//   /**
//    * Форматирует лог входящего запроса
//    */
//   private formatIncomingRequestLog(
//     method: string,
//     url: string,
//     userAgent: string,
//     ip: string,
//     context: ExecutionContext,
//   ): string {
//     return `
// ==== Incoming Request ====
// Method:        ${method}
// URL:           ${url}
// User-Agent:    ${userAgent}
// IP:            ${ip}
// Handler:       ${context.getHandler().name}
// Controller:    ${context.getClass().name}
// ==========================
// `;
//   }

//   /**
//    * Форматирует лог исходящего ответа
//    */
//   private formatOutgoingResponseLog(
//     method: string,
//     url: string,
//     statusCode: number,
//     contentLength: string,
//     userAgent: string,
//     ip: string,
//     startTime: number,
//     duration: number,
//   ): string {
//     return `
// ==== Outgoing Response ====
// Method:        ${method}
// URL:           ${url}
// Status:        ${statusCode}
// Content-Length: ${contentLength}
// User-Agent:    ${userAgent}
// IP:            ${ip}
// Duration:      ${duration}ms
// Response Time: ${new Date(startTime).toISOString()}
// ==========================
// `;
//   }
// }

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { ip, method, path: url } = request;
    const now = Date.now();

    this.logger.log(`Starting Request: ${method} ${url} from ${ip}`);

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        const duration = Date.now() - now;

        this.logger.log(
          `Request completed: ${method} ${url} ${statusCode} - ${duration}ms from ${ip}`,
        );
      }),
    );
  }
}
