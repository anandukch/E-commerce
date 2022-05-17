import { IsDate, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StockResponseDto {
  
  @ApiProperty()
  @IsNumber()
  systemId: number;

  @ApiProperty()
  @IsNumber()
  productId: number;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  total: number;

  @ApiProperty()
  @IsString()
  action: String;

  @ApiProperty()
  @IsNumber()
  createdBy: number;

  @ApiProperty()
  @IsDate()
  createdOn: Date;
}
