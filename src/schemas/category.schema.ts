import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { STATUS } from 'src/shared/Enums';

@Schema()
export class Category extends Document {
  @Prop({ type: String })
  name: string;

  @Prop({ type: [String], default: [] })
  subCategories: string[];

  @Prop({ type: Number })
  systemId: number;

  @Prop({ type: Date, default: Date.now })
  createdOn: Date;

  @Prop({ type: Number })
  createdBy: number;

  @Prop({ type: String, enum: STATUS, default: STATUS.ACTIVE })
  status: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
