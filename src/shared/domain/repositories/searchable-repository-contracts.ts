import { Entity } from "../entities/entity";
import { RepositoryInterface } from "./repository-contracts";

export type SortDirection = 'asc' | 'desc'

export type SearchProps<Filter = string> = {
  page?: number
  perPage?: number
  sort?: string | null
  sortDir?: SortDirection | null
  filter?: Filter | null
}

export type SearchResultProps<E extends Entity, Filter> = {
  items: E[]
  total: number
  currentPage: number
  perPage: number
  sort: string | null
  sortDir: SortDirection | null
  filter: Filter | null
}

export class SearchParams {
  protected _page: number
  protected _perPage: number = 10
  protected _sort: string | null
  protected _sortDir: SortDirection | null
  protected _filter: string | null

  constructor(props: SearchProps = {}) {
    this.page = props.page
    this.perPage = props.perPage
    this.sort = props.sort
    this.sortDir = props.sortDir
    this.filter = props.filter
  }

  get page() {
    return this._page
  }

  set page(value: number) {
    let _page = +value
    if (Number.isNaN(_page) || _page <= 0 || parseInt(_page as any) !== _page) {
      _page = 1
    }
    this._page = _page
  }

  get perPage() {
    return this._perPage
  }

  set perPage(value: number) {
    let _perPage = value === (true as any) ? this.perPage : +value
    if (Number.isNaN(_perPage) || _perPage <= 0 || parseInt(_perPage as any) !== _perPage) {
      _perPage = this._perPage
    }
    this._perPage = _perPage
  }

  get sort() {
    return this._sort
  }

  set sort(value: string | null) {
    this._sort = value === null || value === undefined || value === '' ? null : `${value}`
  }

  get sortDir() {
    return this._sortDir
  }

  set sortDir(value: string | null) {
    if (!this.sort) {
      this._sortDir = null
      return
    }

    const dir = `${value}`.toLowerCase()
    this._sortDir = dir !== 'asc' && dir !== 'desc' ? 'desc' : dir
  }

  get filter() {
    return this._filter
  }

  set filter(value: string | null) {
    this._filter = value === null || value === undefined || value === '' ? null : `${value}`
  }
}

export class SearchResult<E extends Entity, Filter = string> {
  readonly items: E[]
  readonly total: number
  readonly currentPage: number
  readonly perPage: number
  readonly lastPage: number
  readonly sort: string | null
  readonly sortDir: SortDirection | null
  readonly filter: Filter | null

  constructor(props: SearchResultProps<E, Filter>) {
    this.items = props.items
    this.total = props.total
    this.currentPage = props.currentPage
    this.perPage = props.perPage
    this.lastPage = Math.ceil(this.total / this.perPage)
    this.sort = props.sort ?? null
    this.sortDir = props.sortDir ?? null
    this.filter = props.filter ?? null
  }

  toJson(forceEntity = false) {
    return {
      items: forceEntity ? this.items : this.items.map((item) => item.toJson()),
      total: this.total,
      currentPage: this.currentPage,
      perPage: this.perPage,
      lastPage: this.lastPage,
      sort: this.sort,
      sortDir: this.sortDir,
      filter: this.filter,
    }
  }
}

export interface SearchableRepositoryInterface<
  E extends Entity,
  SearchInput,
  SearchOutput
> extends RepositoryInterface<E> {
  search(props: SearchParams): Promise<SearchOutput>
}
