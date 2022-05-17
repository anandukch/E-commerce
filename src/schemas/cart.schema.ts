import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class CartItem {
  @Prop()
  systemId: number;

  @Prop()
  productId: number;

  @Prop()
  quantity: number;

  constructor(init: CartItem) {
    Object.assign(this, init);
  }
}
const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema()
export class Cart extends Document {
  @Prop({ type: Number })
  systemId: number;

  @Prop({ type: Number })
  userId: number;

  @Prop({ type: [CartItemSchema] })
  cartItems: CartItem[];

  @Prop({ type: Date, default: Date.now })
  updatedOn: Date;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
