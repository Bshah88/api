import { Catch, HttpException, ExceptionFilter, Logger, ArgumentsHost } from "@nestjs/common";
import { Response } from 'express';
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const res = exception.getResponse();
        let errorMessage = '';
        if (typeof res === 'object') {
            const { error, message } = exception['response'];
            errorMessage = message;
            this.logger.error(
                `Error: ${error}, Message: ${message}, ErrorCode: ${status}`,
            );
        } else {
            errorMessage = res;
            this.logger.error(`Error: Message: ${res},  ErrorCode: ${status}`);
        }

        response.status(status).send({
            errorMessage,
        });
    }
}