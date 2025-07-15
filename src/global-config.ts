import { Reflector } from '@nestjs/core';
import {
  ClassSerializerInterceptor,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { WrapperDataInterceptor } from './shared/infrastructure/interceptors/wrapper-data/wrapper-data.interceptor';
import { ConflictErrorFilter } from './shared/infrastructure/exception-filters/conflict-error/conflict-error.filter';
import { NotFoundErrorFilter } from './shared/infrastructure/exception-filters/not-found-error/not-found-error.filter';
import { InvalidPasswordErrorFilter } from './shared/infrastructure/exception-filters/invalid-password/invalid-password-error.filter';
import { InvalidCredentialsErrorFilter } from './shared/infrastructure/exception-filters/invalid-credentials/invalid-password-error.filter';

export function applyGlobalConfig(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(
    new WrapperDataInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  app.useGlobalFilters(
    new ConflictErrorFilter(),
    new NotFoundErrorFilter(),
    new InvalidPasswordErrorFilter(),
    new InvalidCredentialsErrorFilter(),
  );
}
