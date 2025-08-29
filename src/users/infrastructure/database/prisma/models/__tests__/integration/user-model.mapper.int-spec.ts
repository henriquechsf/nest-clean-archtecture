import { PrismaClient, User } from '@prisma/client';
import { UserModelMapper } from '../../user-model.mapper';
import { ValidationError } from '@/shared/domain/errors/validation-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';

describe('UserModelMapper integration tests', () => {
  let prismaService: PrismaClient;
  let props: any;

  beforeAll(async () => {
    setupPrismaTests();
    prismaService = new PrismaClient();
    await prismaService.$connect();
  });

  beforeEach(async () => {
    await prismaService.user.deleteMany();
    props = {
      id: '901032b4-c4b3-4424-9487-a4dac6437de5',
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      createdAt: new Date(),
    };
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('should throws error when user model is invalid', async () => {
    const model: User = Object.assign(props, { name: null });

    expect(() => UserModelMapper.toEntity(model)).toThrow(ValidationError);
  });

  it('should convert an user model to an user entity', async () => {
    const model: User = await prismaService.user.create({ data: props });

    const sut = UserModelMapper.toEntity(model);

    expect(sut).toBeInstanceOf(UserEntity);
    expect(sut.toJson()).toStrictEqual(props);
  });
});
