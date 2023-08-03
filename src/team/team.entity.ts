import { Link } from 'src/link/link.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
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

  @OneToMany(() => Link, (link) => link.team)
  links: Link[];
}
