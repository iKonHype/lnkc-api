import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from 'src/user/dtos/user.dto';
import { SignUserDto } from 'src/user/dtos/sign-user.dto';

@Controller('auth')
@Serialize(UserDto)
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    const res = await this.authService.signup(body);
    return res;
  }

  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  async signIn(@Body() body: SignUserDto) {
    const res = await this.authService.signin(body);
    return res;
  }
}
