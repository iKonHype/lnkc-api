import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from './link.entity';
import { LinkController } from './link.controller';
import { LinkService } from './link.service';
import { TeamModule } from 'src/team/team.module';

@Module({
  imports: [TypeOrmModule.forFeature([Link]), TeamModule],
  controllers: [LinkController],
  providers: [LinkService],
})
export class LinkModule {}
