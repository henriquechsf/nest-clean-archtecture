import { Controller, Get, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { NotFoundErrorFilter } from '../../not-found-error.filter';

@Controller('stub')
class StubController {
  @Get()
  index() {
    throw new NotFoundError('User model not found');
  }
}

describe('NotFoundErrorFilter', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [StubController],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalFilters(new NotFoundErrorFilter());
    await app.init();
  });

  it('should catch a NotFoundError', async () => {
    await request(app.getHttpServer())
      .get('/stub')
      .expect(404)
      .expect({
        statusCode: 404,
        error: 'Not Found',
        message: 'User model not found',
      });
  });
});
