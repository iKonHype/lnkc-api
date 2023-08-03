import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from './link.entity';
import { CreateLinkDto } from './dtos/create-link.dto';
import { LinkDto } from './dtos/link.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { LinkService } from './link.service';
import { Restricted } from 'src/guards/auth.guard';

@Controller('links')
@Serialize(LinkDto)
export class LinkController {
  constructor(
    @InjectRepository(Link)
    private readonly urlRepository: Repository<Link>,
    private linkService: LinkService,
  ) {}

  @Restricted()
  @Post('/new')
  async create(@Body() body: CreateLinkDto): Promise<LinkDto> {
    try {
      return await this.linkService.create(body);
    } catch {
      throw new InternalServerErrorException(
        'Something went wrong while creating the link',
      );
    }
  }

  @Restricted()
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
