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
    private roleService: RoleService,
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

    try {
      const savedUser = await this.userRepository.save(newUser);
      return savedUser;
    } catch {
      throw new Error('Something went wrong when creating the user');
    }
  }

  async findByEmail(email: string) {
    if (!email) return null;
    try {
      const user = await this.userRepository
        .createQueryBuilder('t_user')
        .where('t_user.email = :email', { email })
        .leftJoinAndSelect('t_user.role', 'role')
        .getOne();
      return user;
    } catch {
      throw new Error('Something went wrong when finding the user');
    }
  }

  async isExist(email: string) {
    if (!email) return null;
    let user: User | undefined;

    try {
      user = await this.findByEmail(email);
    } catch {
      throw new Error('Something went wrong when finding the user');
    } finally {
      return !!user;
    }
  }
}
