import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsJSON, IsOptional, IsString } from 'class-validator';

export class UpdateLinkDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  hasQr: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isCustom: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isPinned: boolean;

  @ApiProperty()
  @IsJSON()
  @IsOptional()
  properties: object;
}
