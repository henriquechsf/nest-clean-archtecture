import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DeleteUserUseCase } from '../../delete-user.usecase';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/entities/testing/helpers/user-data-builder';

describe('DeleteUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: DeleteUserUseCase.UseCase;
  let repository: UserPrismaRepository;
  let module: TestingModule;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
    repository = new UserPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new DeleteUserUseCase.UseCase(repository);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should throws error when entity not found', async () => {
    await expect(() => sut.execute({ id: 'fake-id' })).rejects.toThrow(
      new NotFoundError('User with id fake-id not found'),
    );
  });

  it('should delete an user', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({
      data: entity.toJson(),
    });

    await sut.execute({ id: entity.id });

    const output = await prismaService.user.findFirst({
      where: { id: entity.id },
    });
    expect(output).toBeNull();
    const models = await prismaService.user.findMany()
    expect(models).toHaveLength(0)
  });
});
