// import { User } from 'src/user/user.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 't_role' })
export class Role {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: 'role_name', unique: true, nullable: false })
  roleName: string;

  @Column()
  description: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
