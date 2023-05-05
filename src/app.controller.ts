import { Controller, Get, Param, Redirect } from '@nestjs/common';
import { LinkDto } from 'src/link/dtos/link.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AppService } from './app.service';

@Controller()
@Serialize(LinkDto)
export class AppController {
  constructor(private appService: AppService) {}

  @Get()
  @Redirect('https://site.lnkc.xyz', 302)
  async redirectToClient() {
    return '';
  }

  @Get(':shortCode')
  @Redirect('', 302)
  async findOne(@Param('shortCode') shortCode: string): Promise<LinkDto> {
    return await this.appService.findLink(shortCode);
  }
}
