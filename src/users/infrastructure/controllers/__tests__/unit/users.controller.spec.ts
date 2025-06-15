import { UsersController } from '../../users.controller';
import { UserOutput } from '@/users/application/dtos/user-output';
import { DeleteUserUseCase } from '@/users/application/usecases/delete-user.usecase';
import { SigninUseCase } from '@/users/application/usecases/signin.usecase';
import { SignupUseCase } from '@/users/application/usecases/signup.usecase';
import { UpdatePasswordUseCase } from '@/users/application/usecases/update-password.usecase';
import { UpdateUserUseCase } from '@/users/application/usecases/update-user.usecase';
import { SignInDto } from '@/users/infrastructure/dtos/signin.dto';
import { SignUpDto } from '@/users/infrastructure/dtos/signup.dto';
import { UpdatePasswordDto } from '@/users/infrastructure/dtos/update-password.dto';
import { UpdateUserDto } from '@/users/infrastructure/dtos/update-user.dto';

describe('UsersController - unit tests', () => {
  let sut: UsersController;
  let id: string;
  let props: UserOutput;

  beforeEach(async () => {
    sut = new UsersController();
    id = 'ff7dfdd7-e81e-4aa0-acd7-bd2e9c6001de';
    props = {
      id,
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '1234',
      createdAt: new Date(),
    };
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should create an user', async () => {
    const output: SignupUseCase.Output = props;
    const mockSignupUseCase = {
      execute: jest.fn().mockResolvedValue(output),
    };
    sut['signupUseCase'] = mockSignupUseCase as any;

    const input: SignUpDto = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '1234',
    };

    const result = await sut.create(input);

    expect(result).toMatchObject(output);
    expect(mockSignupUseCase.execute).toHaveBeenCalledTimes(1);
    expect(mockSignupUseCase.execute).toHaveBeenCalledWith(input);
  });

  it('should authenticate an user', async () => {
    const output: SigninUseCase.Output = props;
    const mockSigninUseCase = {
      execute: jest.fn().mockResolvedValue(output),
    };
    sut['signinUseCase'] = mockSigninUseCase as any;

    const input: SignInDto = {
      email: 'john.doe@example.com',
      password: '1234',
    };

    const result = await sut.login(input);

    expect(result).toMatchObject(output);
    expect(mockSigninUseCase.execute).toHaveBeenCalledTimes(1);
    expect(mockSigninUseCase.execute).toHaveBeenCalledWith(input);
  });

  it('should update user password', async () => {
    const output: UpdatePasswordUseCase.Output = props;
    const mockUpdatePasswordUseCase = {
      execute: jest.fn().mockResolvedValue(output),
    };
    sut['updatePasswordUseCase'] = mockUpdatePasswordUseCase as any;

    const input: UpdatePasswordDto = {
      password: '123456',
      oldPassword: '1234',
    };

    const result = await sut.updatePassword(id, input);

    expect(result).toMatchObject(output);
    expect(mockUpdatePasswordUseCase.execute).toHaveBeenCalledTimes(1);
    expect(mockUpdatePasswordUseCase.execute).toHaveBeenCalledWith({
      id,
      ...input,
    });
  });

  it('should update an user', async () => {
    const output: UpdateUserUseCase.Output = props;
    const mockUpdateUserUseCase = {
      execute: jest.fn().mockResolvedValue(output),
    };
    sut['updateUserUseCase'] = mockUpdateUserUseCase as any;

    const input: UpdateUserDto = {
      name: 'John Doe Edit',
    };

    const result = await sut.update(id, input);

    expect(result).toMatchObject(output);
    expect(mockUpdateUserUseCase.execute).toHaveBeenCalledTimes(1);
    expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith({
      id,
      ...input,
    });
  });

  it('should delete an user', async () => {
    const output = undefined;
    const mockDeleteUserUseCase = {
      execute: jest.fn().mockResolvedValue(output),
    };
    sut['deleteUserUseCase'] = mockDeleteUserUseCase as any;

    const result = await sut.remove(id);

    expect(result).toStrictEqual(output);
    expect(mockDeleteUserUseCase.execute).toHaveBeenCalledTimes(1);
    expect(mockDeleteUserUseCase.execute).toHaveBeenCalledWith({ id });
  });
});
