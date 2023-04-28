import { Expose } from 'class-transformer';

export class LinkDto {
  @Expose()
  url: string;

  @Expose()
  shortCode: string;
}
