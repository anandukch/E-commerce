import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubCategoryDto {
  @ApiProperty()
  @IsArray()
  subCategories: [string];
}
