import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartItemDto {
  @ApiProperty()
  @IsNumber()
  cartItemId: number;

  @ApiProperty()
  @IsNumber()
  quantity: number;
}
