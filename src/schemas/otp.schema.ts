import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Otp extends Document {
  @Prop({ type: String })
  username: string;

  @Prop({ type: Number })
  otp: number;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
