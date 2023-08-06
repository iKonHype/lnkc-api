import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Headers,
  BadRequestException,
  Patch,
  HttpCode,
  HttpStatus,
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
import { UpdateLinkDto } from './dtos/update-link.dto';

@Controller('api/links')
@Serialize(LinkDto)
export class LinkController {
  constructor(
    @InjectRepository(Link)
    private readonly urlRepository: Repository<Link>,
    private linkService: LinkService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
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
  @Get(':id')
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
  @Patch(':id')
  async updateOne(
    @Param('id') linkId: string,
    @Body() body: UpdateLinkDto,
    @Headers(X_TEAM_ID) teamId: string,
  ) {
    try {
      if (!linkId || !teamId) throw new Error('Invalid Identifier');
      const updatedLink = await this.linkService.updateOneById({
        teamId,
        linkId,
        body,
      });
      return updatedLink;
    } catch (error) {
      throw new CustomException({
        error,
        fallbackMessage: 'Something went wrong when updating link',
      });
    }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Restricted()
  @Delete(':id')
  async removeById(
    @Param('id') linkId: string,
    @Headers(X_TEAM_ID) teamId: string,
  ) {
    try {
      await this.linkService.deleteOneById(teamId, linkId);
    } catch (error) {
      throw new CustomException({
        error,
        fallbackMessage: 'Something when wrong when while deleting link',
      });
    }
  }
}
