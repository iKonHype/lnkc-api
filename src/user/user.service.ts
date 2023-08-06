import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { RoleService } from 'src/role/role.service';
import { TeamService } from 'src/team/team.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private roleService: RoleService,
    private teamService: TeamService,
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

  async findById(userId: string) {
    try {
      if (!userId) throw new Error('Invalid identifier - user');
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: {
          role: true,
        },
      });

      const team = await this.teamService.findByOwner(userId);
      if (!team?.id) throw new Error('Invalid identifier - team');

      return { ...user, team: team.id, role: user.role.id };
    } catch (error) {
      throw error;
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

  async updateById(
    userId: string,
    { firstName, lastName }: Pick<CreateUserDto, 'firstName' | 'lastName'>,
  ) {
    try {
      if (!firstName && !lastName)
        throw new Error('All fields are empty - nothing to update');
      const user = await this.userRepository
        .createQueryBuilder('t_user')
        .update(User, { firstName, lastName })
        .where('t_user.id = :userId', { userId })
        .returning('*')
        .execute();
      const plainResult = user.raw[0];
      if (!plainResult?.id) throw new Error('Invalid identifier - user');
      const userInstance = this.userRepository.create({
        ...plainResult,
        firstName: plainResult.first_name,
        lastName: plainResult.last_name,
      });
      return userInstance;
    } catch (error) {
      throw error;
    }
  }
}
