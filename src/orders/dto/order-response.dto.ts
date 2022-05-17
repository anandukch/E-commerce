import { IsArray, IsDate, IsNumber, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CartItemDto {
  @ApiProperty()
  productId: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  price: number;
  @ApiProperty()
  quantity: number;
  @ApiProperty()
  description: string;
}
export class DeliveryItemDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  contactNumber: string;
  @ApiProperty()
  addressLine1: string;
  @ApiProperty()
  addressLine2: string;
  @ApiProperty()
  state: string;
  @ApiProperty()
  pincode: string;
}

export class OrderResponseDto {
  @ApiProperty()
  @IsNumber()
  orderId: number;

  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty({ type: DeliveryItemDto })
  @Type(() => DeliveryItemDto)
  delivery: DeliveryItemDto;

  @ApiProperty({ type: [CartItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];

  @ApiProperty()
  @IsDate()
  createdOn: Date;

  @ApiProperty()
  @IsString()
  status: string;
}
