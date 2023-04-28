import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class CreateLinkDto {
  @ApiProperty()
  @IsUrl()
  url: string;
}
