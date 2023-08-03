import { Team } from 'src/team/team.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 't_link' })
export class Link {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column()
  description: string;

  @Column({ nullable: false })
  url: string;

  @Column({ name: 'short_code', unique: true, nullable: false })
  shortCode: string;

  @Column({ name: 'has_qr', default: false })
  hasQr: boolean;

  @Column({ name: 'is_custom', default: false })
  isCustom: boolean;

  @Column({ name: 'is_pinned', default: false })
  isPinned: boolean;

  @Column({ nullable: true, type: 'json' })
  properties: object;

  @ManyToOne(() => Team, (team) => team.links)
  @JoinColumn({ name: 'team_id' })
  team: Team;
}
