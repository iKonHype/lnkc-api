import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create({ firstName, lastName, email, password }: CreateUserDto) {
    const newUser = this.userRepository.create({
      firstName,
      lastName,
      email,
      password,
    });
    this.userRepository.save(newUser);
  }

  async isExist(email: string) {
    return email;
  }
}
