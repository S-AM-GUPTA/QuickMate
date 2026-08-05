import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class FraudDetectionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const body = request.body;

    // Simple heuristic: if amount > 10,000 INR, flag as suspicious
    if (body && body.amount && body.amount > 10000) {
      throw new HttpException(
        'Transaction flagged as suspicious. Please contact support.',
        HttpStatus.FORBIDDEN,
      );
    }

    // Pass the request along if it passes
    return next.handle();
  }
}
