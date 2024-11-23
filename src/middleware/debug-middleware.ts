import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class DebugMiddleware implements NestMiddleware {
  private readonly logger = new Logger(DebugMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    this.logger.debug(this.formatRequestLog(req));

    res.on('finish', () => {
      const duration = Date.now() - startTime; // Время выполнения запроса
      this.logger.debug(this.formatResponseLog(req, res, duration));
    });

    next();
  }

  /**
   * Форматирует лог входящего запроса
   */
  private formatRequestLog(req: Request): string {
    return `Request
==== Incoming Request ====
Method:        ${req.method}
URL:           ${req.originalUrl}
IP:            ${req.ip}
Headers:       ${this.prettyPrint(req.headers)}
Body:          ${this.prettyPrint(req.body)}
==========================`;
  }

  /**
   * Форматирует лог ответа
   */
  private formatResponseLog(
    req: Request,
    res: Response,
    duration: number,
  ): string {
    return `Response
==== Outgoing Response ====
Method:        ${req.method}
URL:           ${req.originalUrl}
Status:        ${res.statusCode}
Duration:      ${duration}ms
Response Headers: ${this.prettyPrint(res.getHeaders())}
==========================`;
  }

  /**
   * Преобразует объект в красивую строку
   */
  private prettyPrint(data: any): string {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  }
}
