import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class UpdateItem{
  @ApiProperty()
  @IsNumber()
  quantity: number;
}