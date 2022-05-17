import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ORDER_STATUS } from 'src/shared/Enums';

@Schema()
export class OrderItem {
  @Prop()
  productId: number;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop()
  quantity: number;

  constructor(init: OrderItem) {
    Object.assign(this, init);
  }
}
const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema()
export class DeliveryItem {
  @Prop()
  name: string;

  @Prop()
  contactNumber: string;

  @Prop()
  addressLine1: string;

  @Prop()
  addressLine2: string;

  @Prop()
  state: string;

  @Prop()
  pincode: string;

  constructor(init: DeliveryItem) {
    Object.assign(this, init);
  }
}
const DeliveryItemSchema = SchemaFactory.createForClass(DeliveryItem);

@Schema()
export class Order extends Document {
  @Prop({ type: Number })
  systemId: number;

  @Prop({ type: Number })
  userId: number;

  @Prop({ type: DeliveryItemSchema })
  delivery: DeliveryItem;

  @Prop({ type: [OrderItemSchema] })
  items: OrderItem[];

  @Prop({ type: Date, default: Date.now })
  createdOn: Date;

  @Prop({ type: String, enum: ORDER_STATUS, default: ORDER_STATUS.RECEIVED })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
