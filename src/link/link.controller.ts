import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  Headers,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from './link.entity';
import { CreateLinkDto } from './dtos/create-link.dto';
import { LinkDto } from './dtos/link.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { LinkService } from './link.service';
import { Restricted } from 'src/guards/auth.guard';
import { Request as Req } from 'express';
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
  async findAll(@Request() req: Req) {
    try {
      const teamId = req.headers?.[X_TEAM_ID] as string | undefined;

      return await this.linkService.findAllByTeam(teamId);
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
