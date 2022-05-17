import { IsArray, IsDate, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty()
  @IsNumber()
  systemId: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  createBy: number;

  @ApiProperty()
  @IsDate()
  createOn: Date;

  @ApiProperty()
  @IsArray()
  subCategories: string[];
}
