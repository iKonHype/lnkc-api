import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
} from '@nestjs/common';
import { TeamService } from './team.service';

@Controller('api/teams')
export class TeamController {
  constructor(private teamService: TeamService) {}

  @Get('/super/all')
  async getAllTeams() {
    try {
      return await this.teamService.find();
    } catch {
      throw new InternalServerErrorException(
        'Something went wrong while getting teams',
      );
    }
  }

  @Get('/super/:id')
  async getTeamById(@Param('id') id: string) {
    try {
      return await this.teamService.findById(id);
    } catch {
      throw new InternalServerErrorException(
        'Something went wrong while getting the team',
      );
    }
  }
}
