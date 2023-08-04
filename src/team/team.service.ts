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

  async create({ teamName, description, owner }: CreateTeamDto): Promise<Team> {
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

  async findById(teamId: string): Promise<Team> {
    try {
      if (!teamId) {
        throw new Error('Cannot find the team');
      }
      const team = await this.teamRepo.findOne({
        where: { id: teamId },
        relations: {
          owner: true,
        },
      });
      return team;
    } catch (error) {
      throw error;
    }
  }

  async find() {
    try {
      return await this.teamRepo.find({
        relations: {
          owner: true,
        },
      });
    } catch {
      throw new Error('Something went wrong while getting teams');
    }
  }
}
