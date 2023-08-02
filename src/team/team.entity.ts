import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 't_team' })
export class Team {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: 'team_name', nullable: false })
  teamName: string;

  @Column()
  description: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'owner' })
  owner: User;
}
