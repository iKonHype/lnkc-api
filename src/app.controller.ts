import { Controller, Get, Param, Redirect } from '@nestjs/common';
import { LinkDto } from 'src/link/dtos/link.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
@Serialize(LinkDto)
export class AppController {
  constructor(
    private appService: AppService,
    private configService: ConfigService,
  ) {}

  @Get()
  @Redirect('', 301)
  async redirectToClient() {
    console.log(
      'redirecting to ',
      this.configService.get<string>('CLIENT_ORIGIN'),
    );
    return this.configService.get<string>('CLIENT_ORIGIN');
  }

  @Get(':shortCode')
  @Redirect('', 302)
  async findOne(@Param('shortCode') shortCode: string): Promise<LinkDto> {
    return await this.appService.findLink(shortCode);
  }
}
