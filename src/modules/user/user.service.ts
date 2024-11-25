import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { RemoveRoleDto } from './dto/updateUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { AuthService } from '@modules/auth/auth.service';
import { RoleService } from '@modules/role/role.service';
import { AuthUserDto } from '@modules/auth/dto/authUser.dto';
import { AddRoleDto } from './dto/addRole.dto';
import { TaskService } from '@modules/task/task.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private authService: AuthService,
    private roleService: RoleService,
  ) {}

  async getUserByEmail(email: string) {
    if (!email) {
      throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['roles', 'tasks'],
    });

    return user;
  }

  async getUserById(id: number) {
    if (!id) {
      throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'tasks'],
    });

    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST);
    }

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
    const role = await this.roleService.getRoleByValue('ADMIN');
    user$.roles = [role];
    await this.userRepository.save(user$);

    const { password, ...user } = user$;
    const tokens = await this.authService.generateToken(user$);
    await this.authService.saveToken(user$, tokens.refreshToken);

    return { user, tokens };
  }

  async authUser(authUserDto: AuthUserDto) {
    const candidate = await this.getUserByEmail(authUserDto.email);
    if (!candidate) {
      throw new HttpException(
        'Пользователь с таким email не существует',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user$ = await this.authService.auth(authUserDto, candidate);
    const { password, ...user } = user$;
    const tokens = await this.authService.generateToken(user$);
    await this.authService.saveToken(user$, tokens.refreshToken);

    await this.authService.saveToken(user$, tokens.refreshToken);
    const tasks = user.tasks.map((task) => ({
      ...task,
      responsibles: task.responsibles.map(({ password, ...rest }) => rest),
    }));
    return { ...user, tasks: user.tasks.length > 0 ? tasks : [], tokens };
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new HttpException(
        'Пользователь не авторизован',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const userData = await this.authService.validateRefreshToken(refreshToken);

    const tokenFromDb = await this.authService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw new HttpException(
        'Пользователь не авторизован',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user$ = await this.getUserById(userData.id);
    const { password, ...user } = user$;

    const tokens = await this.authService.generateToken(user$);
    await this.authService.saveToken(user$, tokens.refreshToken);

    await this.authService.saveToken(user$, tokens.refreshToken);
    const tasks = user.tasks.map((task) => ({
      ...task,
      responsibles: task.responsibles.map(({ password, ...rest }) => rest),
    }));
    return { ...user, tasks: user.tasks.length > 0 ? tasks : [], tokens };
  }

  async logount(refreshToken: string) {
    const token = await this.authService.removeToken(refreshToken);

    return token;
  }

  async addRole(addRoleDto: AddRoleDto) {
    const user$ = await this.getUserById(addRoleDto.userId);
    const role = await this.roleService.getRoleByValue(addRoleDto.value);
    const roleExists = user$.roles.some((r) => r.value === addRoleDto.value);

    if (user$ && role) {
      if (!roleExists) {
        user$.roles.push(role);
        await this.userRepository.save(user$);
        const { password, tasks, ...user } = user$;

        const tokens = await this.authService.generateToken(user$);
        await this.authService.saveToken(user$, tokens.refreshToken);
        return { user };
      }
      throw new HttpException(
        `У пользователя уже есть роль ${addRoleDto.value}`,
        HttpStatus.CONFLICT,
      );
    }
    throw new HttpException(
      'Пользователь или роль не найдены',
      HttpStatus.NOT_FOUND,
    );
  }

  async softDeleteUser(userId: number, refreshToken: string) {
    await this.authService.removeToken(refreshToken);
    const user = await this.getUserById(userId);
    await this.userRepository.softDelete(user.id);
  }

  async removeRole(removeRoleDto: RemoveRoleDto) {
    const user$ = await this.getUserById(removeRoleDto.userId);
    const role$ = await this.roleService.getRoleByValue(removeRoleDto.value);
    const roleExists = user$.roles.some(
      (role) => role.value === removeRoleDto.value,
    );

    if (user$ && role$) {
      if (roleExists) {
        user$.roles = user$.roles.filter((role) => role.value !== role$.value);
        await this.userRepository.save(user$);
        const { password, tasks, ...user } = user$;

        const tokens = await this.authService.generateToken(user$);
        await this.authService.saveToken(user$, tokens.refreshToken);

        return { user, tokens };
      }
      throw new HttpException(
        `У пользователя нет роли ${removeRoleDto.value}`,
        HttpStatus.CONFLICT,
      );
    }
    throw new HttpException(
      'Пользователь или роль не найдены',
      HttpStatus.NOT_FOUND,
    );
  }
}
