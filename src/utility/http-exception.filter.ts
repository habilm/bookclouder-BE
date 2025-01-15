import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { isXhr } from './helper';
import { errorLog } from './logs';
import { ThrottlerException } from '@nestjs/throttler';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    errorLog(
      exception.toString(),
      status,
      request.method,
      request.path,
      request.ip,
    );

    if (process.env.NODE_ENV === 'local') {
      console.log(exception);
    }

    if (status >= 500) {
      response
        .status(status)
        .send(
          'Internal Server Error. Please try again later. Or please do contact the support team',
        );
      return;
    }

    const error = exception.getResponse();
    if (isXhr(request)) {
      if (exception instanceof ThrottlerException) {
        response.status(status).json({
          status: 'error',
          message: 'Too many requests. Please try again later.',
        });
      } else {
        response.status(status).json(error);
      }
    } else {
      response.status(status).send(exception.message);
    }

    return;
  }
}
