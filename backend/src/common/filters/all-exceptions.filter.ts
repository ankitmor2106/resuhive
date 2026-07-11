import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_ERROR';
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse: any = exception.getResponse();
      
      // Map common HTTP statuses to our error codes
      if (status === HttpStatus.UNAUTHORIZED) code = 'AUTH_001';
      else if (status === HttpStatus.NOT_FOUND) code = 'NOT_FOUND';
      else if (status === HttpStatus.BAD_REQUEST) code = 'VALIDATION_ERROR';

      // Use exception message if string, otherwise use custom message field or fall back
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = exceptionResponse.message || message;
        // If the exception provides a specific code, use it
        code = exceptionResponse.code || code;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      success: false,
      error: {
        code,
        message,
      },
    });
  }
}
