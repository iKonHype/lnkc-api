import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
  ) {}

  async create({ firstName, lastName, email, password }: CreateUserDto) {
    if (!firstName || !email || !password) return null;

    const [role] = await this.roleService.findByRoleName('basic');

    const newUser = this.userRepository.create({
      firstName,
      lastName,
      email,
      password,
      role,
    });
    this.userRepository.save(newUser);

    return newUser;
  }

  async isExist(email: string) {
    if (!email) return null;

    const user = await this.userRepository.find({ where: { email } });
    return !!user?.length;
  }
}
