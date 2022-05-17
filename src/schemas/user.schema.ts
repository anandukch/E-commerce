import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ROLES, STATUS } from 'src/shared/Enums';
import { USER_STATUS } from '../shared/Enums';

@Schema()
export class Address {
  @Prop({ type: Number })
  systemId: number;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  contactNumber: string;

  @Prop({ type: String })
  firstAddress: string;

  @Prop({ type: String })
  secondAddress: string;

  @Prop({ type: String })
  state: string;

  @Prop({ type: String })
  country: string;

  @Prop({ type: String })
  pincode: string;

  @Prop({ type: String, enum: STATUS, default: STATUS.ACTIVE })
  status: string;
  
  constructor(init: Address) {
    Object.assign(this, init);
  }
}

const AddressSchema = SchemaFactory.createForClass(Address);

@Schema()
export class User extends Document {
  @Prop({ type: String })
  username: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: String, default: '' })
  firstName: string;

  @Prop({ type: String, default: '' })
  lastName: string;

  @Prop({ type: String })
  emailId: string;

  @Prop({ type: String, enum: ROLES, default: ROLES.CUSTOMER })
  role: string;

  @Prop({ type: Number })
  systemId: number;

  @Prop({ type: Date, default: Date.now })
  createdOn: Date;

  @Prop({ type: Number })
  createdBy: number;

  @Prop({ type: String })
  contactNumber: string;

  @Prop({ default: [], type: [AddressSchema] })
  address: Address[];

  @Prop({ type: String, enum: USER_STATUS, default: USER_STATUS.ACTIVE })
  status: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
