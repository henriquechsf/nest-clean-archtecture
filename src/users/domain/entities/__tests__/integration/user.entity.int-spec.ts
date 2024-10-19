import { EntityValidationError } from "@/shared/domain/errors/validation-error"
import { UserDataBuilder } from "../../testing/helpers/user-data-builder"
import { UserEntity } from "../../user.entity"

describe('UserEntity integration tests', () => {

  describe('Constructor method', () => {
    it('should throw an error when creating a user with invalid name', () => {
      let props = { ...UserDataBuilder({}), name: null }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), name: '' }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), name: 'a'.repeat(256) }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), name: 10 as any }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)
    })
  })
})
