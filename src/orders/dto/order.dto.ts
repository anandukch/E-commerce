import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderDto {
  @ApiProperty()
  @IsNumber()
  cartId: number;

  @ApiProperty()
  @IsNumber()
  addressId: number;
}
