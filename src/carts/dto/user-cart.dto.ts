import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNumber, ValidateNested } from "class-validator";
import { CartItemsDto } from "./add-to-cart.dto";

export class UserCartDto {

  @ApiProperty()
  @IsNumber()
  cartId:number;

  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty({ type: [CartItemsDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemsDto)
  cartItems: CartItemsDto[];
}