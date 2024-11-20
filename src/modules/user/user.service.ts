import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { AuthService } from '@modules/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  async getUserByEmail(email: string) {
    if (!email) {
      return null;
    }

    const user = await this.userRepository.findOne({
      where: { email },
    });
    return user;
  }

  private async validateNewUser(email: string) {
    const candidate = await this.getUserByEmail(email);

    if (candidate) {
      throw new HttpException(
        'Пользователь с таким email существует!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async registrationUser(createUserDto: CreateUserDto) {
    await this.validateNewUser(createUserDto.email);

    createUserDto.password = await this.authService.hashPassword(
      createUserDto.password,
    );

    const user$ = await this.userRepository.save(createUserDto);
    const { password, ...user } = user$;
    const tokens = await this.authService.generateToken(user$);
    await this.authService.saveToken(user$, tokens.refreshToken);

    return { user, tokens };
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
