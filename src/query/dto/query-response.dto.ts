import { IsDate, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryResponseDto {
  @ApiProperty()
  @IsNumber()
  userId: number;
  @ApiProperty()
  @IsString()
  query: string;

  @ApiProperty()
  @IsString()
  contactNumber: string;

  @ApiProperty()
  @IsDate()
  updatedOn: Date;

  @ApiProperty()
  @IsString()
  status: string;
}
