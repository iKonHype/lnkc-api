import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { TeamService } from 'src/team/team.service';
import { X_TEAM_ID, X_TEAM_OWNER } from 'src/utils/constants';
import { GuardException } from 'src/utils/error.util';

@Injectable()
export class VerifyOwnershipMiddleware implements NestMiddleware {
  constructor(private teamService: TeamService) {}
  async use(req: any, _: any, next: (error?: any) => void) {
    try {
      let teamId = req.headers?.[X_TEAM_ID];
      if (!teamId) {
        throw new BadRequestException('Team id is missing in the headers');
      }
      if (Array.isArray(teamId)) teamId = teamId.pop();
      const team = await this.teamService.findById(teamId as string);
      if (!team) {
        throw new BadRequestException('Cannot find the team');
      }
      req.headers[X_TEAM_ID] = teamId;
      req.headers[X_TEAM_OWNER] = team.owner.id;
      next();
    } catch (error) {
      throw new GuardException(error);
    }
  }
}
