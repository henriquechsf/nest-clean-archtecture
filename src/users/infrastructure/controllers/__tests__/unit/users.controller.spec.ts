import { UsersController } from '../../users.controller';
import { UserOutput } from '@/users/application/dtos/user-output';
import { SigninUseCase } from '@/users/application/usecases/signin.usecase';
import { SignupUseCase } from '@/users/application/usecases/signup.usecase';
import { SignInDto } from '@/users/infrastructure/dtos/signin.dto';
import { SignUpDto } from '@/users/infrastructure/dtos/signup.dto';

describe('UsersController - unit tests', () => {
  let sut: UsersController;
  let id: string;
  let props: UserOutput;

  beforeEach(async () => {
    sut = new UsersController();
    id = 'ff7dfdd7-e81e-4aa0-acd7-bd2e9c6001de'
    props = {
      id,
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '1234',
      createdAt: new Date()
    }
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should create an user', async () => {
    const output: SignupUseCase.Output = props
    const mockSignupUseCase = {
      execute: jest.fn().mockResolvedValue(output)
    }
    sut['signupUseCase'] = mockSignupUseCase as any

    const input: SignUpDto = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '1234'
    }

    const result = await sut.create(input);

    expect(result).toMatchObject(output);
    expect(mockSignupUseCase.execute).toHaveBeenCalledTimes(1)
    expect(mockSignupUseCase.execute).toHaveBeenCalledWith(input)
  });

  it('should authenticate an user', async () => {
    const output: SigninUseCase.Output = props
    const mockSigninUseCase = {
      execute: jest.fn().mockResolvedValue(output)
    }
    sut['signinUseCase'] = mockSigninUseCase as any

    const input: SignInDto = {
      email: 'john.doe@example.com',
      password: '1234'
    }

    const result = await sut.login(input);

    expect(result).toMatchObject(output);
    expect(mockSigninUseCase.execute).toHaveBeenCalledTimes(1)
    expect(mockSigninUseCase.execute).toHaveBeenCalledWith(input)
  });
});
