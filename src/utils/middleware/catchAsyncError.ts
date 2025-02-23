import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AsyncErrorHandlerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const originalNext = next;
    next = (err?: any) => {
      if (err) {
        return originalNext(err);
      }
      originalNext();
    };

    try {
      originalNext();
    } catch (err) {
      next(err);
    }
  }
}
