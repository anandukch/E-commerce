import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../schemas/user.schema';

export class UserEntity {
  @ApiProperty()
  username: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  role: string;
  @ApiProperty()
  systemId: number;
  @ApiProperty()
  createdOn: Date;

  constructor(user: User) {
    const {
      username,
      firstName,
      lastName,
      password,
      role,
      systemId,
      createdOn,
    } = user;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.role = role;
    this.systemId = systemId;
    this.createdOn = createdOn;
  }

  returnUser() {
    return {
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role,
      systemId: this.systemId,
      createdOn: this.createdOn,
    };
  }
}
