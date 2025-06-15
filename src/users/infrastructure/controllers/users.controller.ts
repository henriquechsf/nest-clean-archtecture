import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  HttpCode,
  HttpStatus,
  Query,
  Put,
} from '@nestjs/common';
import { SignUpDto } from '../dtos/signup.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { SignupUseCase } from '../../application/usecases/signup.usecase';
import { SigninUseCase } from '../../application/usecases/signin.usecase';
import { UpdatePasswordUseCase } from '../../application/usecases/update-password.usecase';
import { UpdateUserUseCase } from '../../application/usecases/update-user.usecase';
import { GetUserUseCase } from '../../application/usecases/get-user.usecase';
import { ListUsersUseCase } from '../../application/usecases/list-users.usecase';
import { DeleteUserUseCase } from '../../application/usecases/delete-user.usecase';
import { SignInDto } from '../dtos/signin.dto';
import { ListUsersDto } from '../dtos/list-users.dto';
import { UpdatePasswordDto } from '../dtos/update-password.dto';

@Controller('users')
export class UsersController {
  @Inject(SignupUseCase.UseCase)
  private signupUseCase: SignupUseCase.UseCase;

  @Inject(SigninUseCase.UseCase)
  private signinUseCase: SigninUseCase.UseCase;

  @Inject(UpdatePasswordUseCase.UseCase)
  private updatePasswordUseCase: UpdatePasswordUseCase.UseCase;

  @Inject(UpdateUserUseCase.UseCase)
  private updateUserUseCase: UpdateUserUseCase.UseCase;

  @Inject(GetUserUseCase.UseCase)
  private getUserUseCase: GetUserUseCase.UseCase;

  @Inject(ListUsersUseCase.UseCase)
  private listUsersUseCase: ListUsersUseCase.UseCase;

  @Inject(DeleteUserUseCase.UseCase)
  private deleteUserUseCase: DeleteUserUseCase.UseCase;

  @Post()
  async create(@Body() signupDto: SignUpDto) {
    return this.signupUseCase.execute(signupDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() signinDto: SignInDto) {
    return this.signinUseCase.execute(signinDto);
  }

  @Get()
  async search(@Query() searchParams: ListUsersDto) {
    return this.listUsersUseCase.execute(searchParams);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.getUserUseCase.execute({ id });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.updateUserUseCase.execute({ id, ...updateUserDto });
  }

  @Patch(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.updatePasswordUseCase.execute({ id, ...updatePasswordDto });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteUserUseCase.execute({ id });
  }
}
