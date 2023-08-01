import { Expose } from 'class-transformer';
import { Role } from 'src/role/role.entity';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  role: Role;
}
