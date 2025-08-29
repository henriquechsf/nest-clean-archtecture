import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/entities/testing/helpers/user-data-builder';
import { UpdatePasswordUseCase } from '../../update-password.usecase';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { BcryptjsHashProvider } from '@/shared/infrastructure/providers/hash-providers/bcryptjs-hash.provider';
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error';

describe('UpdatePasswordUseCase unit tests', () => {
  let sut: UpdatePasswordUseCase.UseCase;
  let repository: UserInMemoryRepository;
  let hashProvider: HashProvider;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    hashProvider = new BcryptjsHashProvider();
    sut = new UpdatePasswordUseCase.UseCase(repository, hashProvider);
  });

  it('should throw error when entity not found', async () => {
    await expect(
      sut.execute({
        id: 'inexistent-id',
        password: 'new-pass',
        oldPassword: 'old-pass',
      }),
    ).rejects.toThrow(new NotFoundError('Entity not found'));
  });

  it('should throw error when old password not provided', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    repository.items = [entity];

    await expect(
      sut.execute({
        id: entity.id,
        password: 'new-pass',
        oldPassword: '',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('Password and old password are required'),
    );
  });

  it('should throw error when new password not provided', async () => {
    const entity = new UserEntity(UserDataBuilder({ password: '1234' }));
    repository.items = [entity];

    await expect(
      sut.execute({
        id: entity.id,
        password: '',
        oldPassword: '1234',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError('Password and old password are required'),
    );
  });

  it('should throw error when old password does not match', async () => {
    const hashPassword = await hashProvider.generateHash('1234');
    const entity = new UserEntity(UserDataBuilder({ password: hashPassword }));
    repository.items = [entity];

    await expect(
      sut.execute({
        id: entity.id,
        password: '4567',
        oldPassword: '123456',
      }),
    ).rejects.toThrow(new InvalidPasswordError('Old password does not match'));
  });

  it('should update an user', async () => {
    const hashPassword = await hashProvider.generateHash('1234');
    const spyUpdate = jest.spyOn(repository, 'update');
    const items = [new UserEntity(UserDataBuilder({ password: hashPassword }))];
    repository.items = items;

    const result = await sut.execute({
      id: items[0].id,
      password: '4567',
      oldPassword: '1234',
    });

    const checkNewPassword = await hashProvider.compareHash(
      '4567',
      result.password,
    );

    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(checkNewPassword).toBeTruthy();
  });
});
