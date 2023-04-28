import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from './link.entity';

@Injectable()
export class LinkService {
  constructor(
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
  ) {}

  create(url: string) {
    const shortCode = (+new Date()).toString(36);
    const newLink = this.linkRepository.create({ url, shortCode });
    this.linkRepository.save(newLink);
    return newLink;
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
