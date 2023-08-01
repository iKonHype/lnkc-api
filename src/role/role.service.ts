import { Injectable } from '@nestjs/common';
import { Role } from './role.entity';
import { CreateRoleDto } from './dtos/create-role.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
  ) {}

  create({ roleName, description }: CreateRoleDto) {
    if (!roleName) return null;

    const newRole = this.roleRepo.create({ roleName, description });
    return this.roleRepo.save(newRole);
  }

  findByRoleName(roleName: string) {
    if (!roleName) return null;
    return this.roleRepo.find({ where: { roleName } });
  }
}
