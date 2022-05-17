import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Stock, StockSchema } from 'src/schemas/stock.schema';
import { StockTotal, StockTotalSchema } from 'src/schemas/stockTotal.schema';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Stock.name, schema: StockSchema }]),
    MongooseModule.forFeature([
      { name: StockTotal.name, schema: StockTotalSchema },
    ]),
  ],
  controllers: [StocksController],
  providers: [StocksService],
  exports: [StocksService],
})
export class StocksModule {}
