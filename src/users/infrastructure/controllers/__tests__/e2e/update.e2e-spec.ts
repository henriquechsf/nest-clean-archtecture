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
import { UpdateUserDto } from '@/users/infrastructure/dtos/update-user.dto';

describe('UsersController - e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: UserRepository.Repository;
  let updateUserDto: UpdateUserDto;
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
    updateUserDto = {
      name: 'test name',
    };
    await prismaService.user.deleteMany();
    entity = new UserEntity(UserDataBuilder({}));
    await repository.insert(entity);
  });

  describe('PUT /users', () => {
    it('should update an user', async () => {
      updateUserDto.name = 'test name';
      const res = await request(app.getHttpServer())
        .put(`/users/${entity.id}`)
        .send(updateUserDto)
        .expect(200);

      expect(Object.keys(res.body)).toStrictEqual(['data']);

      const user = await repository.findById(entity.id);

      const presenter = UsersController.userToResponse(user.toJson());
      const serialized = instanceToPlain(presenter);

      expect(res.body.data).toStrictEqual(serialized);
    });

    it('should return an error with 422 code when the request is invalid', async () => {
      const res = await request(app.getHttpServer())
        .put(`/users/${entity.id}`)
        .send({})
        .expect(422);

      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'name should not be empty',
        'name must be a string',
      ]);
    });

    it('should return an error with 422 code when the name field is invalid', async () => {
      delete updateUserDto.name;

      const res = await request(app.getHttpServer())
        .put(`/users/${entity.id}`)
        .send(updateUserDto)
        .expect(422);

      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'name should not be empty',
        'name must be a string',
      ]);
    });

    it('should return an error with 404 code when throw NotFoundError with invalid id', async () => {
      const res = await request(app.getHttpServer())
        .put(`/users/fakeid`)
        .send(updateUserDto)
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'User with id fakeid not found',
        });
    });

    it('should return an error with 422 with invalid field provided', async () => {
      const res = await request(app.getHttpServer())
        .put(`/users/${entity.id}`)
        .send(Object.assign(updateUserDto, { xpto: 'fake' }))
        .expect(422);

      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual(['property xpto should not exist']);
    });
  });
});
