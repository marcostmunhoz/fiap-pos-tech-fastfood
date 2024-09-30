import { DomainException } from '@/shared/domain/exception/domain.exception';
import { EntityAlreadyExistsException } from '@/shared/domain/exception/entity-already-exists.exception';
import { EntityNotFoundException } from '@/shared/domain/exception/entity-not-found.exception';
import { UnauthorizedResourceException } from '@/shared/domain/exception/unauthorized-resource.exception';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

type ResponseBody = {
  statusCode: number;
  message: string;
};

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const body = this.mapExceptionToResponse(exception);

    response.status(body.statusCode).json(body);
  }

  mapExceptionToResponse(exception: DomainException): ResponseBody {
    const response: ResponseBody = {
      statusCode: HttpStatus.BAD_REQUEST,
      message: exception.message,
    };

    if (exception instanceof EntityNotFoundException) {
      response.statusCode = HttpStatus.NOT_FOUND;
    }

    if (exception instanceof EntityAlreadyExistsException) {
      response.statusCode = HttpStatus.CONFLICT;
    }

    if (exception instanceof UnauthorizedResourceException) {
      response.statusCode = HttpStatus.FORBIDDEN;
    }

    return response;
  }
}
