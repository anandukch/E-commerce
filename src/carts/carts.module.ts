import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from 'src/schemas/cart.schema';
import { Products, ProductSchema } from 'src/schemas/products.schema';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';

@Module({
  controllers: [CartsController],
  providers: [CartsService],
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    MongooseModule.forFeature([{ name: Products.name, schema: ProductSchema }]),
  ],
  exports: [CartsService],
})
export class CartsModule {}
