import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
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
    @Request() req: Req,
  ): Promise<LinkDto> {
    try {
      const user = req['user']?.sub ?? '';
      return await this.linkService.create(user, body);
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
      const userId = String(req['user'].sub ?? '');

      let teamId = req.headers['x-team-id'];
      if (Array.isArray(teamId)) teamId = teamId.pop();
      console.log('teamId', teamId);

      return await this.linkService.findAllByTeam(userId, teamId);
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
