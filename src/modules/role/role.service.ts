import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleDto } from './dto/createRole.dto';
import { RoleEntity } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  async onModuleInit() {
    const adminRole = await this.roleRepository.findOne({
      where: { value: 'ADMIN' },
    });

    if (!adminRole) {
      const role = new RoleEntity();
      role.value = 'ADMIN';
      role.description = 'Администратор';
      await this.roleRepository.save(role);
    }
  }

  async create(createRoleDto: CreateRoleDto) {
    await this.validateRole(createRoleDto.value);

    const role = await this.roleRepository.save(createRoleDto);

    return { role };
  }

  async getRoleByValue(value: string) {
    if (!value) {
      throw new HttpException(`Введите роль!`, HttpStatus.BAD_REQUEST);
    }

    const role = await this.roleRepository.findOne({ where: { value } });
    if (!role) {
      throw new HttpException(
        `Роль ${value} не существует`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return role;
  }

  async validateRole(value: string) {
    if (!value) {
      throw new HttpException(`Введите роль!`, HttpStatus.BAD_REQUEST);
    }

    const role = await this.roleRepository.findOne({ where: { value } });
    if (role) {
      throw new HttpException(
        `Роль ${value} уже существует!`,
        HttpStatus.CONFLICT,
      );
    }
  }

  async getAllRoles() {
    const roles = await this.roleRepository.find();
    return { roles };
  }
}
