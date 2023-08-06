import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TeamService } from 'src/team/team.service';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { SignUserDto } from 'src/authentication/dto/sign-user.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { createHash } from 'src/utils/auth.util';

@Injectable()
export class AuthenticationService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private userService: UserService,
    private teamService: TeamService,
  ) {}

  async signup({ firstName, lastName, email, password }: CreateUserDto) {
    const isAlreadyExist = await this.userService.isExist(email);
    if (isAlreadyExist) throw new Error('Email is already in use');

    const { salt, hash } = await createHash(password);
    const result = `${salt}.${hash.toString('hex')}`;

    try {
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password: result,
      });

      if (!user?.id)
        throw new Error('Something went wrong while creating user');

      /**
       * Create user team automatically when signing up
       * Team name template: [firstname]'s Team
       * User can edit the team name later
       */
      const team = await this.teamService.create({
        teamName: `${firstName}'s Team`,
        description: '',
        owner: user,
      });

      if (!team?.id)
        throw new Error('Something went wrong while creating user team');

      return user;
    } catch (error) {
      throw error;
    }
  }

  async signin({ email, password }: SignUserDto) {
    if (!email || !password) return null;

    try {
      const user = await this.userService.findByEmail(email);
      if (!user) throw new Error('User not found');

      const [salt, storedHash] = user.password.split('.');
      const { hash } = await createHash(password, salt);
      if (storedHash !== hash.toString('hex')) {
        throw new Error('Invalid password');
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
    } catch (error) {
      throw error;
    }
  }

  async changePassword(
    email: string,
    currentPassword: string,
    newPassword: string,
  ) {
    try {
      const user = await this.userService.findByEmail(email);
      if (!user) throw new NotFoundException('User not found');

      const [salt, storedHash] = user.password.split('.');
      const { hash } = await createHash(currentPassword, salt);
      if (storedHash !== hash.toString('hex')) {
        throw new Error('Invalid password');
      }

      const { salt: newSalt, hash: newHash } = await createHash(newPassword);
      const newPassowrdHash = `${newSalt}.${newHash.toString('hex')}`;

      const newUser = await this.userService.silentUpdate({
        ...user,
        password: newPassowrdHash,
      } as User);

      if (!newUser) throw new Error('Failed to change password');

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
    } catch (error) {
      throw error;
    }
  }
}
