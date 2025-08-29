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

    it('should throw an error when creating a user with invalid email', () => {
      let props = { ...UserDataBuilder({}), email: null }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), email: '' }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), email: 'a'.repeat(256) }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), email: 10 as any }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)
    })

    it('should throw an error when creating a user with invalid password', () => {
      let props = { ...UserDataBuilder({}), password: null }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), password: '' }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), password: 'a'.repeat(101) }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), password: 10 as any }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)
    })

    it('should throw an error when creating a user with invalid createdAt', () => {
      let props = { ...UserDataBuilder({}), createdAt: '2024' as any }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = { ...UserDataBuilder({}), createdAt: 10 as any }
      expect(() => new UserEntity(props)).toThrow(EntityValidationError)
    })

    it('should a valid user', () => {
      expect.assertions(0)

      new UserEntity(UserDataBuilder({}))
    })
  })

  describe('Update method', () => {
    it('should throw an error when update a user with invalid name', () => {
      const entity = new UserEntity(UserDataBuilder({}))

      expect(() => entity.update(null)).toThrow(EntityValidationError)
      expect(() => entity.update('')).toThrow(EntityValidationError)
      expect(() => entity.update('a'.repeat(256))).toThrow(EntityValidationError)
      expect(() => entity.update(10 as any)).toThrow(EntityValidationError)
    })

    it('should update a valid user', () => {
      expect.assertions(0)

      const entity = new UserEntity(UserDataBuilder({}))
      entity.update('valid name')
    })
  })

  describe('Update password method', () => {
    it('should throw an error when update a password with invalid password', () => {
      const entity = new UserEntity(UserDataBuilder({}))

      expect(() => entity.updatePassword(null)).toThrow(EntityValidationError)
      expect(() => entity.updatePassword('')).toThrow(EntityValidationError)
      expect(() => entity.updatePassword('a'.repeat(101))).toThrow(EntityValidationError)
      expect(() => entity.updatePassword(10 as any)).toThrow(EntityValidationError)
    })

    it('should update a valid password', () => {
      expect.assertions(0)

      const entity = new UserEntity(UserDataBuilder({}))
      entity.updatePassword('valid_password')
    })
  })
})
