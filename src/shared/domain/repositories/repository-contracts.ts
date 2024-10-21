import { Entity } from "../entities/entity";

export interface RepositoryInterface<T extends Entity> {
  insert(entity: T): Promise<void>
  findById(id: string): Promise<T>
  findAll(): Promise<T[]>
  update(entity: T): Promise<void>
  delete(id: string): Promise<void>
}
