import { v4 as uuidv4 } from 'uuid'

export abstract class Entity<T = any> {
  public readonly _id: string
  public readonly props: T

  constructor(props: T, id?: string) {
    this.props = props
    this._id = id ?? uuidv4()
  }

  get id() {
    return this._id
  }

  toJson(): Required<{ id: string } & T> {
    return { id: this._id, ...this.props } as Required<{ id: string } & T>
  }
}
