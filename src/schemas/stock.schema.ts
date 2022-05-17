import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { STOCK_STATUS } from 'src/shared/Enums';

@Schema()
export class Stock extends Document {
  @Prop({ type: Number })
  productId: number;

  @Prop({ type: Number })
  quantity: number;

  @Prop({ type: Number })
  systemId: number;

  @Prop({ type: Number })
  createdBy: number;

  @Prop({ type: Date, default: Date.now })
  createdOn: Date;

  @Prop({ type: Number })
  total: number;

  @Prop({ type: String, enum: STOCK_STATUS })
  action: string;
}

export const StockSchema = SchemaFactory.createForClass(Stock);
