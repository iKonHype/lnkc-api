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
      const team = await this.teamRepo.findOne({
        where: { id: teamId },
        relations: {
          owner: true,
        },
      });
      return team;
    } catch {
      throw new Error('Something went wrong when getting team');
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

  async isTeamOwner(teamId: string, userId: string): Promise<boolean> {
    if (!teamId || !userId) throw new Error('Invalid team or user');

    try {
      const team = await this.findById(teamId);
      return team.owner?.id === userId;
    } catch (error) {
      throw error;
    }
  }
}
