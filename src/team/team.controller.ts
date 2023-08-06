import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Patch,
  Request,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { Restricted } from 'src/guards/auth.guard';
import { Request as Req } from 'express';
import { CustomException } from 'src/utils/error.util';
import { USER } from 'src/utils/constants';
import { CreateTeamDto } from './dtos/create-team.dto';

@Controller('api/teams')
export class TeamController {
  constructor(private teamService: TeamService) {}

  @Restricted()
  @Get('me')
  async getMeTeam(@Request() req: Req) {
    try {
      const user = req[USER];
      if (!user?.sub)
        throw new InternalServerErrorException("Couldn't find user");
      const team = await this.teamService.findByOwner(user.sub);
      return team;
    } catch (error) {
      throw new CustomException({
        error,
        fallbackMessage: 'Something went wrong while reading team',
      });
    }
  }

  @Restricted()
  @Patch('me')
  async updateMeTeam(
    @Request() req: Req,
    @Body() body: Pick<CreateTeamDto, 'teamName' | 'description'>,
  ) {
    try {
      const user = req[USER];
      if (!user?.sub)
        throw new InternalServerErrorException("Couldn't find user");
      const updatedTeam = await this.teamService.updateByOwner(user.sub, body);
      return updatedTeam;
    } catch (error) {
      throw new CustomException({
        error,
        fallbackMessage: 'Something went wrong while updating team',
      });
    }
  }
}
