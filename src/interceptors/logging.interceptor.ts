import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();
        const req = context.switchToHttp().getRequest();
        return next.handle().pipe(
            tap((_data) => {
                const log = {
                    timestamp: new Date().toISOString(),
                    method: req.method,
                    url: req.url,
                    duration: Date.now() - now + ' ms',
                };
                const logDir = path.join(process.cwd(), 'logs');
                if (!fs.existsSync(logDir)) {
                    fs.mkdirSync(logDir);
                }
                fs.appendFileSync(path.join(logDir, 'api.log'), JSON.stringify(log) + '\n');
            }),
        );
    }
} 