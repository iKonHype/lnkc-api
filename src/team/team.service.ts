import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Team } from './team.entity';
import { CreateTeamDto } from './dtos/create-team.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team) private readonly teamRepo: Repository<Team>,
  ) {}

  async create({ teamName, description, owner }: CreateTeamDto) {
    const newTeam = this.teamRepo.create({
      teamName,
      description,
      owner,
    });
    try {
      const savedTeam = await this.teamRepo.save(newTeam);
      return savedTeam;
    } catch {
      throw new Error('Something went wrong when creating the team');
    }
  }
}
