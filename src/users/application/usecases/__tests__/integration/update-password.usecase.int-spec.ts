import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { BcryptjsHashProvider } from '@/shared/infrastructure/providers/hash-providers/bcryptjs-hash.provider';
import { UpdatePasswordUseCase } from '../../update-password.usecase';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/entities/testing/helpers/user-data-builder';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error';

describe('UpdatePasswordUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: UpdatePasswordUseCase.UseCase;
  let repository: UserPrismaRepository;
  let module: TestingModule;
  let hashProvider: HashProvider;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
    repository = new UserPrismaRepository(prismaService as any);
    hashProvider = new BcryptjsHashProvider();
  });

  beforeEach(async () => {
    sut = new UpdatePasswordUseCase.UseCase(repository, hashProvider);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should throws error when an entity not found', async () => {
    const entity = new UserEntity(UserDataBuilder({}));

    await expect(() =>
      sut.execute({
        id: entity.id,
        password: 'new-password',
        oldPassword: entity.password,
      }),
    ).rejects.toThrow(new NotFoundError(`User with id ${entity.id} not found`));
  });

  it('should throws error when an entity not found', async () => {
    const entity = new UserEntity(UserDataBuilder({}));

    await expect(() =>
      sut.execute({
        id: entity.id,
        password: 'new-password',
        oldPassword: entity.password,
      }),
    ).rejects.toThrow(new NotFoundError(`User with id ${entity.id} not found`));
  });

  it('should throws error when old password not provided', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    const user = await prismaService.user.create({
      data: entity.toJson()
    })

    await expect(() =>
      sut.execute({
        id: entity.id,
        password: 'new-password',
        oldPassword: '',
      }),
    ).rejects.toThrow(new NotFoundError(`Password and old password are required`));
  });

  it('should throws error when new password not provided', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    const user = await prismaService.user.create({
      data: entity.toJson()
    })

    await expect(() =>
      sut.execute({
        id: entity.id,
        password: '',
        oldPassword: entity.password,
      }),
    ).rejects.toThrow(new NotFoundError(`Password and old password are required`));
  });

  it('should throws error when invalid password is provided', async () => {
    const oldPassword = await hashProvider.generateHash('1234')
    const entity = new UserEntity(UserDataBuilder({ password: oldPassword }));
    await prismaService.user.create({
      data: entity.toJson()
    })

    await expect(() =>
      sut.execute({
        id: entity.id,
        password: 'new-password',
        oldPassword: 'invalid-password',
      }),
    ).rejects.toThrow(new InvalidPasswordError(`Old password does not match`));
  });

  it('should update a password', async () => {
    const oldPassword = await hashProvider.generateHash('1234')
    const entity = new UserEntity(UserDataBuilder({ password: oldPassword }));
    await prismaService.user.create({
      data: entity.toJson()
    })

    const output = await sut.execute({
      id: entity.id,
      oldPassword: '1234',
      password: 'new-password',
    })

    const result = await hashProvider.compareHash('new-password', output.password)

    expect(result).toBeTruthy()
  });
});
