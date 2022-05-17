import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CONFIGURATIONS } from 'src/shared/Enums';

@Schema()
export class Configurations extends Document {
  @Prop({ type: String, enum: CONFIGURATIONS })
  key: string;

  @Prop({ type: Number })
  value: number;

  @Prop({ type: Date })
  updatedOn: Date;
}

export const ConfigurationsSchema =
  SchemaFactory.createForClass(Configurations);
