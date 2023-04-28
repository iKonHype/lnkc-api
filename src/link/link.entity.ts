import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 't_link' })
export class Link {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false })
  url: string;

  @Column({ name: 'short_code', unique: true, nullable: false })
  shortCode: string;
}
