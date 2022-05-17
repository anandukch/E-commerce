import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StockDto {
  @ApiProperty()
  @IsNumber()
  quantity: number;
}
