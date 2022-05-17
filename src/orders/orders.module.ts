import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from 'src/schemas/cart.schema';
import {
  Configurations,
  ConfigurationsSchema,
} from 'src/schemas/configurations.schema';
import { Order, OrderSchema } from 'src/schemas/order.schema';
import { Products, ProductSchema } from 'src/schemas/products.schema';
import { UsersModule } from 'src/users/users.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    MongooseModule.forFeature([{ name: Products.name, schema: ProductSchema }]),
    MongooseModule.forFeature([
      { name: Configurations.name, schema: ConfigurationsSchema },
    ]),

    forwardRef(() => UsersModule),
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
