import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { RoleModule } from 'src/role/role.module';
import { TeamModule } from 'src/team/team.module';
import { Team } from 'src/team/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Team]), RoleModule, TeamModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
