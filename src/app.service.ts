import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from './link/link.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
  ) {}

  findLink(shortCode: string) {
    return this.linkRepository.findOneBy({ shortCode });
  }
}
