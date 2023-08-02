import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { SignUserDto } from 'src/user/dtos/sign-user.dto';
import { UserService } from 'src/user/user.service';
import { createHash } from 'src/utils/hash.util';

@Injectable()
export class AuthenticationService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup({ firstName, lastName, email, password }: CreateUserDto) {
    const isAlreadyExist = await this.userService.isExist(email);
    if (isAlreadyExist)
      throw new BadRequestException('email is already in use');

    const { salt, hash } = await createHash(password);
    const result = `${salt}.${hash.toString('hex')}`;

    try {
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password: result,
      });

      return user;
    } catch {
      throw new InternalServerErrorException(
        'Internal server error when signing up',
      );
    }
  }

  async signin({ email, password }: SignUserDto) {
    if (!email || !password) return null;

    try {
      const user = await this.userService.findByEmail(email);
      if (!user) throw new NotFoundException('User not found');

      const [salt, storedHash] = user.password.split('.');
      const { hash } = await createHash(password, salt);
      if (storedHash !== hash.toString('hex')) {
        throw new UnauthorizedException('Invalid password');
      }

      const payload = {
        sub: user.id,
        username: user.email,
        role: user.role.id,
      };
      return {
        token: await this.jwtService.signAsync(payload, {
          secret: this.configService.get<string>('JWT_SECRET'),
        }),
      };
    } catch (err) {
      throw new InternalServerErrorException(
        'Internal server error when signing in',
        err,
      );
    }
  }
}
