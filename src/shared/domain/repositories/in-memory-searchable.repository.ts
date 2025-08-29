import { Entity } from "../entities/entity";
import { NotFoundError } from "../errors/not-found-error";
import { InMemoryRepository } from "./in-memory.repository";
import { RepositoryInterface } from "./repository-contracts";
import { SearchableRepositoryInterface, SearchParams, SearchResult } from "./searchable-repository-contracts";

export abstract class InMemorySearchableRepository<T extends Entity>
  extends InMemoryRepository<T>
  implements SearchableRepositoryInterface<T, any, any> {
  sortableFields: string[] = []

  async search(props: SearchParams): Promise<SearchResult<T>> {
    const itemsFiltered = await this.applyFilter(this.items, props.filter)
    const itemsSorted = await this.applySort(itemsFiltered, props.sort, props.sortDir)
    const itemsPaginated = await this.applyPaginate(itemsSorted, props.page, props.perPage)

    return new SearchResult({
      items: itemsPaginated,
      total: itemsFiltered.length,
      currentPage: props.page,
      perPage: props.perPage,
      sort: props.sort,
      sortDir: props.sortDir,
      filter: props.filter
    })
  }

  protected abstract applyFilter(items: T[], filter: string | null): Promise<T[]>

  protected async applySort(items: T[], sort: string | null, sortDir: string | null): Promise<T[]> {
    if (!sort || !this.sortableFields.includes(sort)) {
      return items
    }
    return [...items].sort((a, b) => {
      if (a.props[sort] < b.props[sort]) {
        return sortDir === 'asc' ? -1 : 1
      }
      if (a.props[sort] > b.props[sort]) {
        return sortDir === 'asc' ? 1 : -1
      }
      return 0
    })
  }

  protected async applyPaginate(items: T[], page: SearchParams['page'], perPage: SearchParams['perPage']): Promise<T[]> {
    const start = (page - 1) * perPage
    const limit = start + perPage
    return items.slice(start, limit)
  }
}
