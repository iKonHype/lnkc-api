import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from './link.entity';
import { CreateLinkDto } from './dtos/create-link.dto';
import { LinkDto } from './dtos/link.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { LinkService } from './link.service';
import { Restricted } from 'src/guards/auth.guard';
import { CustomException } from 'src/utils/error.util';
import { X_TEAM_ID } from 'src/utils/constants';

@Controller('api/links')
@Serialize(LinkDto)
export class LinkController {
  constructor(
    @InjectRepository(Link)
    private readonly urlRepository: Repository<Link>,
    private linkService: LinkService,
  ) {}

  @Restricted()
  @Post('/')
  async create(
    @Body() body: CreateLinkDto,
    @Headers(X_TEAM_ID) teamId: string,
  ): Promise<LinkDto> {
    try {
      return await this.linkService.create(teamId, body);
    } catch (error) {
      throw new CustomException({
        error,
        fallbackMessage: 'Something went wrong while creating the link',
      });
    }
  }

  @Restricted()
  @Get('/')
  async findAll(@Headers(X_TEAM_ID) teamId: string) {
    try {
      return await this.linkService.findAllByTeam(teamId);
    } catch (error) {
      throw new CustomException({
        error,
        fallbackMessage: 'Something went wrong when reading links',
      });
    }
  }

  @Restricted()
  @Get('/:id')
  async findOne(
    @Param('id') linkId: string,
    @Headers(X_TEAM_ID) teamId: string,
  ) {
    try {
      if (!linkId || !teamId) {
        throw new BadRequestException('invalid identifier');
      }
      return await this.linkService.findOneById(linkId, teamId);
    } catch (error) {
      throw new CustomException({
        error,
        fallbackMessage: 'Something went wrong when reading links',
      });
    }
  }

  @Restricted()
  @Get('/super/all')
  async findAllSuper(): Promise<LinkDto[]> {
    return await this.linkService.find();
  }

  @Get(':shortCode')
  async findOneSuper(@Param('shortCode') shortCode: string): Promise<LinkDto> {
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
