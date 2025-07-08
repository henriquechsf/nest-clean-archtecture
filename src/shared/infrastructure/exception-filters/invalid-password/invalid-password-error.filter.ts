import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

@Catch(InvalidPasswordError)
export class InvalidPasswordErrorFilter implements ExceptionFilter {
  catch(exception: InvalidPasswordError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(HttpStatus.UNPROCESSABLE_ENTITY).send({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      error: 'Unprocessable Entity',
      message: exception.message,
    });
  }
}
