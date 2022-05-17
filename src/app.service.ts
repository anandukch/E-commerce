import { Injectable } from '@nestjs/common';
import { OrdersService } from './orders/orders.service';
import { ProductsService } from './products/products.service';
import { QueryService } from './query/query.service';
import { UsersService } from './users/users.service';
import { CartsService } from './carts/carts.service';
import { Response } from './shared/response';

@Injectable()
export class AppService {
  constructor(
    private userService: UsersService,
    private productService: ProductsService,
    private queryService: QueryService,
    private orderService: OrdersService,
    private cartService: CartsService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async seedDatabase() {
    await this.orderService.dropCollection();
    await this.cartService.dropCollection();
    await this.queryService.dropCollection();
    await this.productService.dropCollection();
    await this.userService.dropCollection();
    return new Response({
      success: true,
      message: 'Database seeded successfully',
    });
  }
}
