import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Restricted } from 'src/guards/auth.guard';
import { Request as Req } from 'express';
import { USER } from 'src/utils/constants';
import { CustomException } from 'src/utils/error.util';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { CreateUserDto } from './dtos/create-user.dto';

@Serialize(UserDto)
@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Restricted()
  @Get('me')
  async getMe(@Request() req: Req) {
    try {
      const user = req[USER];
      if (!user?.sub) throw new Error('Invalid identifier - user');
      return await this.userService.findById(user.sub);
    } catch (error) {
      throw new CustomException({
        error,
        fallbackMessage: 'Something went wrong while reading user',
      });
    }
  }

  @Restricted()
  @Patch('me')
  async updateMe(
    @Request() req: Req,
    @Body() body: Pick<CreateUserDto, 'firstName' | 'lastName'>,
  ) {
    try {
      const user = req[USER];
      if (!user?.sub) throw new Error('Invalid identifier - user');
      return await this.userService.updateById(user.sub, body);
    } catch (error) {
      throw new CustomException({
        error,
        fallbackMessage: 'Something went wrong while updating user',
      });
    }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Restricted()
  @Delete('me')
  async deleteMe(@Request() req: Req) {
    try {
      const user = req[USER];
      if (!user?.sub)
        throw new BadRequestException('Invalid identifier - user');
      await this.userService.deleteUser(user.sub);
    } catch (error) {
      throw new CustomException({
        error,
        fallbackMessage: 'Something went wrong while deleting user',
      });
    }
  }
}
