import { ConflictError } from '@/shared/domain/errors/conflict-error';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

@Catch(ConflictError)
export class ConflictErrorFilter implements ExceptionFilter {
  catch(exception: ConflictError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(HttpStatus.CONFLICT).send({
      statusCode: HttpStatus.CONFLICT,
      error: 'Conflict',
      message: exception.message,
    });
  }
}
