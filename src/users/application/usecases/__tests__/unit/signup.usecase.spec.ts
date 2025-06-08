import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository";
import { SignupUseCase } from "../../signup.usecase";
import { HashProvider } from "@/shared/application/providers/hash-provider";
import { UserRepository } from "@/users/domain/repositories/user.repository";
import { BcryptjsHashProvider } from "@/shared/infrastructure/providers/hash-providers/bcryptjs-hash.provider";
import { UserDataBuilder } from "@/users/domain/entities/testing/helpers/user-data-builder";
import { ConflictError } from "@/shared/domain/errors/conflict-error";
import { BadRequestError } from "@/shared/application/errors/bad-request-error";

describe('SignupUseCase unit tests', () => {
  let sut: SignupUseCase.UseCase
  let repository: UserRepository.Repository
  let hashProvider: HashProvider

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    hashProvider = new BcryptjsHashProvider()
    sut = new SignupUseCase.UseCase(repository, hashProvider)
  })

  it('should create a user', async () => {
    const spyInsert = jest.spyOn(repository, 'insert')
    const props = UserDataBuilder({})

    const result = await sut.execute(props)

    expect(result.id).toBeDefined()
    expect(result.createdAt).toBeInstanceOf(Date)
    expect(spyInsert).toHaveBeenCalledTimes(1)
  });

  it('should not be able to register with same email twice', async () => {
    const props = UserDataBuilder({ email: 'a@a.com' })
    const result = await sut.execute(props)

    await expect(sut.execute(props)).rejects.toThrow(ConflictError)
  });

  it('should throws error when name not provided', async () => {
    const props = Object.assign(UserDataBuilder({}), { name: null })

    await expect(sut.execute(props)).rejects.toThrow(BadRequestError)
  });

  it('should throws error when email not provided', async () => {
    const props = Object.assign(UserDataBuilder({}), { email: null })

    await expect(sut.execute(props)).rejects.toThrow(BadRequestError)
  });

  it('should throws error when password not provided', async () => {
    const props = Object.assign(UserDataBuilder({}), { password: null })

    await expect(sut.execute(props)).rejects.toThrow(BadRequestError)
  });
});
