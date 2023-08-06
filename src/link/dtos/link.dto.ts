import { Expose } from 'class-transformer';

export class LinkDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  url: string;

  @Expose()
  shortCode: string;

  @Expose()
  hasQr: boolean;

  @Expose()
  isCustom: boolean;

  @Expose()
  isPinned: boolean;

  @Expose()
  properties: object;
}
