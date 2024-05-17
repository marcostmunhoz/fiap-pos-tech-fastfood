import { InvalidValueException } from '@/shared/domain/exception/invalid-value.exception';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

@Catch(InvalidValueException)
export class InvalidValueExceptionFilter implements ExceptionFilter {
  catch(exception: InvalidValueException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = HttpStatus.BAD_REQUEST;

    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}
