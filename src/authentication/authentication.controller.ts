import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { Request as Req } from 'express';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from 'src/user/dtos/user.dto';
import { SignUserDto } from './dto/sign-user.dto';
import { PasswordChangeDto } from './dto/password-change.dto';
import { CustomException } from 'src/utils/error.util';
import { USER } from 'src/utils/constants';
import { Restricted } from 'src/guards/auth.guard';

@Controller('api/auth')
@Serialize(UserDto)
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    try {
      const user = await this.authService.signup(body);
      if (!user?.id) throw new Error();
      return user;
    } catch (error) {
      throw new CustomException({
        error,
        fallbackMessage: 'Something went wrong while signining up',
      });
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  async signIn(@Body() body: SignUserDto) {
    try {
      const res = await this.authService.signin(body);
      if (!res?.token) throw new Error();
      return res;
    } catch (error) {
      throw new CustomException({
        error,
        fallbackMessage: 'Something went wrong while signining in',
      });
    }
  }

  @Restricted()
  @Post('/change-password')
  async changePassword(@Request() req: Req, @Body() body: PasswordChangeDto) {
    try {
      const user = req[USER];
      if (!user?.username)
        throw new BadRequestException('Invalid identifier - user');
      const token = await this.authService.changePassword(
        user.username,
        body.currentPassword,
        body.newPassword,
      );

      if (!token) throw new Error();
      return token;
    } catch (error) {
      throw new CustomException({
        error,
        fallbackMessage: 'Something went wrong while changing password',
      });
    }
  }
}
