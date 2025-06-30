import { PrismaClient, User } from '@prisma/client';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { UserPrismaRepository } from '../../user-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserDataBuilder } from '@/users/domain/entities/testing/helpers/user-data-builder';
import { UserRepository } from '@/users/domain/repositories/user.repository';
import { Prisma } from '@prisma/client';

describe('UserPrismaRepository integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: UserPrismaRepository;
  let module: TestingModule;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
  });

  beforeEach(async () => {
    sut = new UserPrismaRepository(prismaService as any);
    await prismaService.user.deleteMany();
  });

  describe('findById method tests', () => {
    it('should throws error when entity not fount', async () => {
      expect(() => sut.findById('fake-id')).rejects.toThrow(
        new NotFoundError('User with id fake-id not found'),
      );
    });

    it('should finds an entity by id', async () => {
      const entity = new UserEntity(UserDataBuilder({}));
      const newUser = await prismaService.user.create({
        data: entity.toJson(),
      });

      const foundEntity = await sut.findById(newUser.id);

      expect(foundEntity.toJson()).toEqual(entity.toJson());
    });
  });

  describe('insert method tests', () => {
    it('should insert a new user entity', async () => {
      const entity = new UserEntity(UserDataBuilder({}));

      await sut.insert(entity);

      const result = await prismaService.user.findFirst({
        where: {
          id: entity._id,
        },
      });

      expect(result).toEqual(entity.toJson());
    });
  });

  describe('findAll method tests', () => {
    it('should return all users', async () => {
      const entity = new UserEntity(UserDataBuilder({}));
      const newUser = await prismaService.user.create({
        data: entity.toJson(),
      });

      const entities = await sut.findAll();

      expect(entities).toHaveLength(1);
      entities.forEach(item =>
        expect(item.toJson()).toStrictEqual(entity.toJson()),
      );
    });
  });

  describe('search method tests', () => {
    it('should apply only pagination when the other params are null', async () => {
      const createdAt = new Date();
      const entities: UserEntity[] = [];
      const arrange = Array(11).fill(UserDataBuilder({}));
      const DEFAULT_PER_PAGE = 10;

      arrange.forEach((item, index) => {
        entities.push(
          new UserEntity({
            ...item,
            email: `test${index}@mail.com`,
            createdAt: new Date(createdAt.getTime() + index),
          }),
        );
      });

      await prismaService.user.createMany({
        data: entities.map(item => item.toJson()),
      });

      const searchOutput = await sut.search(new UserRepository.SearchParams());
      const items = searchOutput.items;

      expect(searchOutput).toBeInstanceOf(UserRepository.SearchResult);
      expect(searchOutput.total).toBe(11);
      expect(items).toHaveLength(DEFAULT_PER_PAGE);
      items.forEach(item => {
        expect(item).toBeInstanceOf(UserEntity);
      });
      items.reverse().forEach((item, index) => {
        expect(`test${index + 1}@mail.com`).toBe(item.email);
      });
    });

    it('should search using filter, sort and paginate', async () => {
      const createdAt = new Date();
      const entities: UserEntity[] = [];
      const arrange = ['test', 'a', 'TEST', 'b', 'TeSt'];
      const DEFAULT_PER_PAGE = 10;

      arrange.forEach((item, index) => {
        entities.push(
          new UserEntity({
            ...UserDataBuilder({ name: item }),
            createdAt: new Date(createdAt.getTime() + index),
          }),
        );
      });

      await prismaService.user.createMany({
        data: entities.map(item => item.toJson()),
      });

      const searchOutputPage1 = await sut.search(
        new UserRepository.SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      );

      expect(searchOutputPage1.items[0].toJson()).toMatchObject(
        entities[0].toJson(),
      );
      expect(searchOutputPage1.items[1].toJson()).toMatchObject(
        entities[4].toJson(),
      );

      const searchOutputPage2 = await sut.search(
        new UserRepository.SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      );

      expect(searchOutputPage2.items[0].toJson()).toMatchObject(
        entities[2].toJson(),
      );
    });
  });

  describe('update method tests', () => {
    it('should throws error on update when entity not fount', async () => {
      const entity = new UserEntity(UserDataBuilder({}));

      expect(() => sut.update(entity)).rejects.toThrow(
        new NotFoundError(`User with id ${entity.id} not found`),
      );
    });

    it('should update an entity', async () => {
      const entity = new UserEntity(UserDataBuilder({}));
      await prismaService.user.create({
        data: entity.toJson(),
      });
      entity.update('new name');

      await sut.update(entity);

      const output = await prismaService.user.findUnique({
        where: { id: entity._id, email: entity.email } as Prisma.UserWhereUniqueInput,
      });

      expect(output.name).toBe('new name');
    });
  });

  describe('delete method tests', () => {
    it('should throws error on delete when entity not fount', async () => {
      const entity = new UserEntity(UserDataBuilder({}));

      expect(() => sut.delete(entity.id)).rejects.toThrow(
        new NotFoundError(`User with id ${entity.id} not found`),
      );
    });

    it('should delete an entity', async () => {
      const entity = new UserEntity(UserDataBuilder({}));
      await prismaService.user.create({
        data: entity.toJson(),
      });

      await sut.delete(entity.id);

      const output = await prismaService.user.findUnique({
        where: { id: entity._id, email: entity.email } as Prisma.UserWhereUniqueInput,
      });

      expect(output).toBeNull();
    });
  });
});
