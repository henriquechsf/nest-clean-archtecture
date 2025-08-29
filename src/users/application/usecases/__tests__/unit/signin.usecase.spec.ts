import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { BcryptjsHashProvider } from '@/shared/infrastructure/providers/hash-providers/bcryptjs-hash.provider';
import { UserDataBuilder } from '@/users/domain/entities/testing/helpers/user-data-builder';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { SigninUseCase } from '../../signin.usecase';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error';

describe('SigninUseCase unit tests', () => {
  let sut: SigninUseCase.UseCase;
  let repository: UserInMemoryRepository;
  let hashProvider: HashProvider;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    hashProvider = new BcryptjsHashProvider();
    sut = new SigninUseCase.UseCase(repository, hashProvider);
  });

  it('should authenticate an user', async () => {
    const spyFindByEmail = jest.spyOn(repository, 'findByEmail');
    const hashPassword = await hashProvider.generateHash('1234');
    const entity = new UserEntity(
      UserDataBuilder({ email: 'a@a.com', password: hashPassword }),
    );
    repository.items = [entity];

    const result = await sut.execute({
      email: entity.email,
      password: '1234'
    });

    expect(spyFindByEmail).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual(entity.toJson());
  });

  it('should throws error when email not provided', async () => {
    const props = { email: null, password: '1234' }

    await expect(sut.execute(props)).rejects.toThrow(BadRequestError)
  });

  it('should throws error when password not provided', async () => {
    const props = { email: 'a@a.com', password: null }

    await expect(sut.execute(props)).rejects.toThrow(BadRequestError)
  });

  it('should not be able to authenticate with wrong email', async () => {
    const props = { email: 'a@a.com', password: '1234' }

    await expect(sut.execute(props)).rejects.toThrow(NotFoundError)
  });

  it('should not be able to authenticate with wrong password', async () => {
    const hashPassword = await hashProvider.generateHash('1234');
    const entity = new UserEntity(
      UserDataBuilder({ email: 'a@a.com', password: hashPassword }),
    );
    repository.items = [entity];

    const props = { email: 'a@a.com', password: 'invalid-pass' }

    await expect(sut.execute(props)).rejects.toThrow(InvalidCredentialsError)
  });
});
