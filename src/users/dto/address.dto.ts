import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class AddressDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  contactNumber: string;

  @ApiProperty()
  @IsString()
  firstAddress: string;

  @ApiProperty()
  @IsString()
  secondAddress: string;

  @ApiProperty()
  @IsString()
  state: string;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsString()
  pincode: string;
}
