import { Response } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { LoggingInterceptor } from '@interceptors/logging.interceptors';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TokenEntity } from '@modules/auth/entities/token.entity';
import { UserEntity } from './entities/user.entity';
import { RegistrationBodySchema } from '@schemas/body-schemas';
import { RegistrationErrorSchema } from '@schemas/error-schemas';
import { RegistrationResponseSchema } from '@schemas/respones-schemas';

@ApiTags('User CRUD')
@UseInterceptors(LoggingInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Cоздание пользователя', operationId: '1' })
  @ApiExtraModels(UserEntity, TokenEntity, CreateUserDto)
  @ApiResponse({
    status: 200,
    type: RegistrationResponseSchema,
    description: 'Registration user',
  })
  @ApiBadRequestResponse({
    type: RegistrationErrorSchema,
    description: 'Некорректный запрос',
  })
  @ApiBody({ type: RegistrationBodySchema })
  @Post('/registration')
  async registrationUser(@Body() userDto: CreateUserDto, @Res() res: Response) {
    try {
      const payload = await this.userService.registrationUser(userDto);
      res.cookie('refreshToken', payload.tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict',
      });
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Congratulations, you can job', ...payload });
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
