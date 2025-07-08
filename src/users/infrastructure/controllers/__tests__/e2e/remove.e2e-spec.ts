import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { UserRepository } from '@/users/domain/repositories/user.repository';
import { UsersModule } from '@/users/infrastructure/users.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { applyGlobalConfig } from '@/global-config';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/entities/testing/helpers/user-data-builder';

describe('UsersController - e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: UserRepository.Repository;
  const prismaService = new PrismaClient();
  let entity: UserEntity;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [
        EnvConfigModule,
        UsersModule,
        DatabaseModule.forTest(prismaService),
      ],
    }).compile();

    app = module.createNestApplication();
    applyGlobalConfig(app);
    await app.init();

    repository = module.get<UserRepository.Repository>('UserRepository');
  });

  afterAll(async () => {
    await module.close();
  });

  beforeEach(async () => {
    await prismaService.user.deleteMany();
    entity = new UserEntity(UserDataBuilder({}));
    await repository.insert(entity);
  });

  describe('DELETE /users/:id', () => {
    it('should remove a user', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${entity.id}`)
        .expect(204)
        .expect({});
    });

    it('should return an error with 404 code when throw NotFoundError with invalid id', async () => {
      await request(app.getHttpServer())
        .delete(`/users/fakeid`)
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'User with id fakeid not found',
        });
    });
  });
});
