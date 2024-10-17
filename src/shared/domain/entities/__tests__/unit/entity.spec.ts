import { validate as uuidValidate } from 'uuid'
import { Entity } from '../../entity'

type StubProps = {
  prop1: string
  prop2: number
}

class StubEntity extends Entity<StubProps> {}

describe('Entity unit tests', () => {

  it('Should set props and id', () => {
    const props = { prop1: 'value1', prop2: 10 }
    const entity = new StubEntity(props)

    expect(entity.props).toStrictEqual(props)
    expect(entity.id).toBeDefined()
    expect(uuidValidate(entity.id)).toBeTruthy()
  })

  it('Should accept a valid uuid', () => {
    const props = { prop1: 'value1', prop2: 10 }
    const id = 'e6b753d9-b3d5-412e-8bb8-e9ed26cbf505'
    const entity = new StubEntity(props, id)

    expect(entity.id).toBe(id)
    expect(uuidValidate(entity.id)).toBeTruthy()
  })

  it('Should convert a entity to javascript object JSON', () => {
    const props = { prop1: 'value1', prop2: 10 }
    const id = 'e6b753d9-b3d5-412e-8bb8-e9ed26cbf505'
    const entity = new StubEntity(props, id)

    expect(entity.toJson()).toStrictEqual({ id, ...props })
  })
})
