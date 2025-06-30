import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserRepository } from '@/users/domain/repositories/user.repository';
import { UserModelMapper } from '../models/user-model.mapper';
import { ConflictError } from '@/shared/domain/errors/conflict-error';
import { Prisma } from '@prisma/client';

export class UserPrismaRepository implements UserRepository.Repository {
  sortableFields: string[] = ['name', 'createdAt'];

  constructor(private prismaService: PrismaService) {}

  async findById(id: string): Promise<UserEntity> {
    return this._get(id);
  }

  async insert(entity: UserEntity): Promise<void> {
    await this.prismaService.user.create({ data: entity.toJson() });
  }

  async findAll(): Promise<UserEntity[]> {
    const models = this.prismaService.user.findMany();
    return (await models).map(model => UserModelMapper.toEntity(model));
  }

  async search(
    props: UserRepository.SearchParams,
  ): Promise<UserRepository.SearchResult> {
    const sortable = this.sortableFields.includes(props.sort) || false;
    const orderByField = sortable ? props.sort : 'createdAt';
    const orderByDir = sortable ? props.sortDir : 'desc';

    const count = await this.prismaService.user.count({
      ...(props.filter && {
        where: {
          name: {
            contains: props.filter,
            mode: 'insensitive',
          },
        },
      }),
    });

    const models = await this.prismaService.user.findMany({
      ...(props.filter && {
        where: {
          name: {
            contains: props.filter,
            mode: 'insensitive',
          },
        },
      }),
      orderBy: {
        [orderByField]: orderByDir,
      },
      skip: props.page && props.page > 0 ? (props.page - 1) * props.perPage : 1,
      take: props.perPage && props.perPage > 0 ? props.perPage : 15,
    });

    return new UserRepository.SearchResult({
      items: models.map(model => UserModelMapper.toEntity(model)),
      total: count,
      currentPage: props.page,
      perPage: props.perPage,
      sort: orderByField,
      sortDir: orderByDir,
      filter: props.filter,
    });
  }

  async update(entity: UserEntity): Promise<void> {
    await this._get(entity._id);
    await this.prismaService.user.update({
      where: { id: entity._id, email: entity.email } as Prisma.UserWhereUniqueInput,
      data: entity.toJson(),
    });
  }

  async delete(id: string): Promise<void> {
    const model = await this._get(id);
    await this.prismaService.user.delete({
      where: { id, email: model.email } as Prisma.UserWhereUniqueInput
    })
  }

  findByEmail(email: string): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }

  async emailExists(email: string): Promise<void> {
    const entity = await this.prismaService.user.findFirst({
      where: { email },
    });

    if (entity) {
      throw new ConflictError('Email address already used');
    }
  }

  protected async _get(id: string): Promise<UserEntity> {
    try {
      const user = await this.prismaService.user.findFirstOrThrow({
        where: { id },
      });

      return UserModelMapper.toEntity(user);
    } catch {
      throw new NotFoundError(`User with id ${id} not found`);
    }
  }
}
