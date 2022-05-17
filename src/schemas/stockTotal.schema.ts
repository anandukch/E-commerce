import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { STOCK_STATUS } from 'src/shared/Enums';

@Schema()
export class StockTotal extends Document {
  @Prop({ type: Number })
  productId: number;

  @Prop({ type: Number })
  quantity: number;

  @Prop({ type: Number })
  systemId: number;

  @Prop({ type: Date, default: Date.now })
  updatedOn: Date;
}

export const StockTotalSchema = SchemaFactory.createForClass(StockTotal);
