import { Entity } from "../entities/entity";
import { NotFoundError } from "../errors/not-found-error";
import { RepositoryInterface } from "./repository-contracts";

export abstract class InMemoryRepository<T extends Entity> implements RepositoryInterface<T> {
  items: T[] = []

  async insert(entity: T): Promise<void> {
    this.items.push(entity)
  }

  async findById(id: string): Promise<T> {
    const _id = `${id}`
    const entity = this.items.find(item => item.id === _id)

    if (!entity) {
      throw new NotFoundError('Entity not found')
    }

    return entity
  }

  async findAll(): Promise<T[]> {
    return this.items
  }

  async update(entity: T): Promise<void> {
    await this.findById(entity.id)
    const index = this.items.findIndex(item => item.id === entity.id)
    this.items[index] = entity
  }

  async delete(id: string): Promise<void> {
    await this.findById(id)
    const index = this.items.findIndex(item => item.id === id)
    this.items.splice(index, 1)
  }
}
