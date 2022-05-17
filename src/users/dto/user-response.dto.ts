import { ApiProperty } from '@nestjs/swagger';
import { AddressDto } from './address.dto';

export class UserResponseDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  role: string;
  @ApiProperty()
  systemId: number;
  @ApiProperty()
  createdOn: Date;
  @ApiProperty({ type: [AddressDto] })
  address: AddressDto[];
  public constructor(init?: any) {
    Object.assign(this, init);
  }
}
