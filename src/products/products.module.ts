import { forwardRef, Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductSchema } from '../schemas/products.schema';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StocksModule } from 'src/stocks/stocks.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Products', schema: ProductSchema }]),
    forwardRef(() => StocksModule)
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
