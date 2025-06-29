import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserRepository } from '@/users/domain/repositories/user.repository';
import { UserModelMapper } from '../models/user-model.mapper';
import { ConflictError } from '@/shared/domain/errors/conflict-error';

export class UserPrismaRepository implements UserRepository.Repository {
  sortableFields: string[];

  constructor(private prismaService: PrismaService) {}

  async findById(id: string): Promise<UserEntity> {
    return this._get(id);
  }

  async insert(entity: UserEntity): Promise<void> {
    await this.prismaService.user.create({ data: entity.toJson() });
  }

  async findAll(): Promise<UserEntity[]> {
    const models = this.prismaService.user.findMany();
    return (await models).map(model => UserModelMapper.toEntity(model))
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

  search(
    props: UserRepository.SearchParams,
  ): Promise<UserRepository.SearchResult> {
    throw new Error('Method not implemented.');
  }

  update(entity: UserEntity): Promise<void> {
    throw new Error('Method not implemented.');
  }

  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
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
