import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CartItemsDto{
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
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  price: string;

  @ApiProperty()
  @IsString()
  description: string;
}

export class AddToCartDto {
  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty({ type: [CartItemsDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemsDto)
  cartItems: CartItemsDto[];
}