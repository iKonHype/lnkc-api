import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from './link.entity';
import { CreateLinkDto } from './dtos/create-link.dto';
import { LinkDto } from './dtos/link.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { LinkService } from './link.service';

@Controller('shorts')
@Serialize(LinkDto)
export class LinkController {
  constructor(
    @InjectRepository(Link)
    private readonly urlRepository: Repository<Link>,
    private linkService: LinkService,
  ) {}

  @Post('/new')
  async create(@Body() urlData: CreateLinkDto): Promise<LinkDto> {
    return await this.linkService.create(urlData.url);
  }

  @Get('/all')
  async findAll(): Promise<LinkDto[]> {
    return await this.linkService.find();
  }

  @Get(':shortCode')
  async findOne(@Param('shortCode') shortCode: string): Promise<LinkDto> {
    return await this.linkService.findOne(shortCode);
  }

  @Delete(':id')
  async removeById(@Param('id') id: string): Promise<void> {
    await this.linkService.deleteById(id);
  }

  @Delete('code/:shortCode')
  async removeByShortCode(
    @Param('shortCode') shortCode: string,
  ): Promise<void> {
    await this.linkService.deleteByShortCode(shortCode);
  }
}
