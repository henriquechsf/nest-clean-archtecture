import { BcryptjsHashProvider } from "../../bcryptjs-hash.provider";

describe('BcryptjsHashProvider unit tests', () => {
  let sut: BcryptjsHashProvider

  beforeEach(() => {
    sut = new BcryptjsHashProvider()
  })

  describe('generateHash method', () => {
    it('should return encrypted password', async () => {
      const password = 'TestPassword123'

      const hash = await sut.generateHash(password)

      expect(hash).toBeDefined()
    });
  })

  describe('compareHash method', () => {
    it('should return false on invalid password and hash comparison', async () => {
      const password = 'TestPassword123'
      const hash = await sut.generateHash(password)

      const result = await sut.compareHash('invalid-hash', hash)

      expect(result).toBeFalsy()
    });

    it('should return true on valid password and hash comparison', async () => {
      const password = 'TestPassword123'
      const hash = await sut.generateHash(password)

      const result = await sut.compareHash(password, hash)

      expect(result).toBeTruthy()
    });
  })
});
