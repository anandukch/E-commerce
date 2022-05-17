import { IsDate, IsObject, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AddressDto } from './address.dto';

export class UserProfileDto {
  @ApiProperty()
  @IsString()
  systemId: string;
  @ApiProperty()
  @IsString()
  username: string;
  @ApiProperty()
  @IsString()
  role: string;
  @ApiProperty()
  @IsString()
  firstName: string;
  @ApiProperty()
  @IsString()
  lastName: string;
  @ApiProperty()
  @IsDate()
  createdOn: string;
  @ApiProperty()
  @IsString()
  contactNumber: string;
  @ApiProperty({type: [AddressDto]})
  @IsString()
  address: AddressDto[];
}
