import { IsDate, IsObject, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class UserDetailsDto {
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
  @ApiProperty()
  @IsString()
  address: string;
}

export class LoginResponseDto {
  @ApiProperty({type: UserDetailsDto})
  @Type(() => UserDetailsDto)
  user: UserDetailsDto;

  @ApiProperty()
  @IsString()
  authenticationToken: string;
}
