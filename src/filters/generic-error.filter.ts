import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';
@Catch()
export class GenericErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(GenericErrorFilter.name);
  constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

  catch(error: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const httpStatus = HttpStatus.CONFLICT;
    const responseBody = {
      message: 'Invalid input parameter(s) or data format. Please check your input and try again.',
    };
    this.logger.error(
      ` name: ${JSON.stringify(error.name)}, message: ${JSON.stringify(
        error.message,
      )}, stack: ${JSON.stringify(error.stack)}`,
    );
    response.status(httpStatus).json(responseBody);
  }
}
