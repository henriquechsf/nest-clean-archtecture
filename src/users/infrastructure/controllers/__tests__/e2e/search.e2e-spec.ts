import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { UserRepository } from '@/users/domain/repositories/user.repository';
import { UsersModule } from '@/users/infrastructure/users.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { UsersController } from '../../users.controller';
import { instanceToPlain } from 'class-transformer';
import { applyGlobalConfig } from '@/global-config';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/entities/testing/helpers/user-data-builder';

describe('UsersController - e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: UserRepository.Repository;
  const prismaService = new PrismaClient();

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
  });

  describe('GET /users', () => {
    it('should return the users ordered by createdAt', async () => {
      const createdAt = new Date();
      const entities: UserEntity[] = [];
      const arrange = Array(3).fill(UserDataBuilder({}));
      arrange.forEach((item, index) => {
        entities.push(
          new UserEntity({
            ...item,
            email: `a${index}@a.com`,
            createdAt: new Date(createdAt.getTime() + index),
          }),
        );
      });
      await prismaService.user.createMany({
        data: entities.map(item => item.toJson()),
      });

      const searchParams = {};
      const queryParams = new URLSearchParams(searchParams as any).toString();

      const res = await request(app.getHttpServer())
        .get(`/users?${queryParams}`)
        .expect(200);

      expect(Object.keys(res.body)).toStrictEqual(['data', 'meta']);
      expect(res.body).toStrictEqual({
        data: [...entities]
          .reverse()
          .map(item => instanceToPlain(UsersController.userToResponse(item))),
        meta: {
          total: 3,
          currentPage: 1,
          perPage: 10,
          lastPage: 1,
        },
      });
    });

    it('should return the users ordered by name', async () => {
      const entities: UserEntity[] = [];
      const arrange = ['test', 'a', 'TEST', 'b', 'TeSt'];
      arrange.forEach((item, index) => {
        entities.push(
          new UserEntity({
            ...UserDataBuilder({}),
            name: item,
            email: `a${index}@a.com`,
          }),
        );
      });
      await prismaService.user.createMany({
        data: entities.map(item => item.toJson()),
      });

      const searchParams = {
        page: 1,
        perPage: 2,
        sort: 'name',
        sortDir: 'asc',
        filter: 'TEST',
      };
      let queryParams = new URLSearchParams(searchParams as any).toString();

      let res = await request(app.getHttpServer())
        .get(`/users?${queryParams}`)
        .expect(200);

      expect(Object.keys(res.body)).toStrictEqual(['data', 'meta']);
      expect(res.body).toStrictEqual({
        data: [entities[0], entities[4]].map(item =>
          instanceToPlain(UsersController.userToResponse(item)),
        ),
        meta: {
          total: 3,
          currentPage: 1,
          perPage: 2,
          lastPage: 2,
        },
      });

      searchParams.page = 2;
      queryParams = new URLSearchParams(searchParams as any).toString();

      res = await request(app.getHttpServer())
        .get(`/users?${queryParams}`)
        .expect(200);

      expect(res.body).toStrictEqual({
        data: [entities[2]].map(item =>
          instanceToPlain(UsersController.userToResponse(item)),
        ),
        meta: {
          total: 3,
          currentPage: 2,
          perPage: 2,
          lastPage: 2,
        },
      });
    });

    it('should return an error with 422 code when the query params is invalid', async () => {
      const res = await request(app.getHttpServer())
        .get(`/users?fakeId=10`)
        .expect(422);

      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual(['property fakeId should not exist']);
    });
  });
});
