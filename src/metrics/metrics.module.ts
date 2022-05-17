import { forwardRef, Module } from '@nestjs/common';
import { OrdersModule } from 'src/orders/orders.module';
import { ProductsModule } from 'src/products/products.module';
import { QueryModule } from 'src/query/query.module';
import { UsersModule } from 'src/users/users.module';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';

@Module({
  imports: [
    forwardRef(() => ProductsModule),
    forwardRef(() => OrdersModule),
    forwardRef(() => UsersModule),
    forwardRef(() => QueryModule),
  ],
  controllers: [MetricsController],
  providers: [MetricsService],
})
export class MetricsModule {}
