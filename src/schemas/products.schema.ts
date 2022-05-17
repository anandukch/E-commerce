import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { STATUS } from 'src/shared/Enums';

@Schema()
export class Products extends Document {
  @Prop({ type: String })
  name: string;

  @Prop({ type: Number, default: 0 })
  price: number;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Number })
  systemId: number;

  @Prop({ type: Number })
  category: number;

  @Prop({ type: [String] })
  subCategory: [string];

  @Prop({ type: Date, default: Date.now })
  createdOn: Date;

  @Prop({ type: Number })
  createdBy: number;

  @Prop({ type: String, enum: STATUS, default: STATUS.ACTIVE })
  status: string;
}

export const ProductSchema = SchemaFactory.createForClass(Products);
