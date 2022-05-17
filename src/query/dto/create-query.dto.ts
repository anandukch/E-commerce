import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQueryDto {
  @ApiProperty()
  @IsString()
  query: string;

  @ApiProperty()
  @IsString()
  contactNumber: string;
}
