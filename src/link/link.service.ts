import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from './link.entity';
import { generateShortode } from 'src/utils/link.util';
import { CreateLinkDto } from './dtos/create-link.dto';
import { TeamService } from 'src/team/team.service';

@Injectable()
export class LinkService {
  constructor(
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
    private teamService: TeamService,
  ) {}

  async create(
    user: string,
    { url, title, description, teamId }: CreateLinkDto,
  ) {
    try {
      const shortCode = generateShortode();

      const team = await this.teamService.findById(teamId);
      if (!team) {
        throw new Error('Something went wrong when getting team');
      }

      if (team.owner?.id !== user) {
        throw new Error('Invalid user without link create permissions');
      }

      const newLink = this.linkRepository.create({
        url,
        shortCode,
        title,
        description,
        team,
      });

      const savedLink = await this.linkRepository.save(newLink);
      return savedLink;
    } catch (error) {
      throw error;
    }
  }

  async findAllByTeam(userId: string, teamId: string) {
    if (!teamId) throw new Error('Invalid team id');

    try {
      const isCurrentUserIsTheTeamOwner = await this.teamService.isTeamOwner(
        teamId,
        userId,
      );
      if (!isCurrentUserIsTheTeamOwner) {
        throw new Error('Invalid user without link read permissions');
      }

      const links = await this.linkRepository
        .createQueryBuilder('t_link')
        .where('t_link.team_id = :teamId', { teamId })
        .getMany();

      return links;
    } catch (error) {
      throw error;
    }
  }

  find() {
    return this.linkRepository.find();
  }

  findOne(shortCode: string) {
    return this.linkRepository.findOneBy({ shortCode });
  }

  deleteById(id: string) {
    this.linkRepository.delete(id);
  }

  async deleteByShortCode(shortCode: string) {
    const link = await this.findOne(shortCode);
    this.deleteById(link.id);
  }
}
