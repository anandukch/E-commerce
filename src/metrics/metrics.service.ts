import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { OrdersService } from 'src/orders/orders.service';
import { ProductsService } from 'src/products/products.service';
import { QueryService } from 'src/query/query.service';
import { Response } from 'src/shared/response';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MetricsService {
  constructor(
    @Inject(forwardRef(() => ProductsService))
    private productService: ProductsService,
    @Inject(forwardRef(() => OrdersService))
    private orderService: OrdersService,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
    @Inject(forwardRef(() => QueryService))
    private queryService: QueryService,
  ) {}

  async getProductsTotal() {
    try {
      const total = await this.productService.getTotal();
      return new Response({
        success: true,
        message: 'Total products fetched',
        data: total,
      });
    } catch (error) {
      return new Response({
        success: false,
        message: 'error occured',
      });
    }
  }

  async getOrdersTotal() {
    try {
      const total = await this.orderService.getTotal();
      return new Response({
        success: true,
        message: 'Total orders fetched',
        data: total,
      });
    } catch (error) {
      return new Response({
        success: false,
        message: 'error occured',
      });
    }
  }

  async getUsersCount() {
    try {
      const total = await this.userService.getTotalUsers();
      return new Response({
        success: true,
        message: 'total users counts fetched',
        data: total,
      });
    } catch (error) {
      return new Response({
        success: false,
        message: 'error occured',
      });
    }
  }

  async getQueryCount() {
    try {
      const total = await this.queryService.getTotalQuery();
      return new Response({
        success: true,
        message: 'total queries fetched',
        data: total,
      });
    } catch (error) {
      return new Response({
        success: false,
        message: 'error occured',
      });
    }
  }

  async getOrderTrends(start = new Date('0'), end = new Date()) {
    try {
      const orders = await this.orderService.getTrends(start, end);
      return new Response({
        success: true,
        message: 'total orders fetched',
        data: orders,
      });
    } catch (error) {
      return new Response({
        success: false,
        message: 'error occured',
      });
    }
  }
  async getUserTrends(start = new Date('0'), end = new Date()) {
    try {
      const users = await this.userService.getTrends(start, end);
      return new Response({
        success: true,
        message: 'user trends fetched',
        data: users,
      });
    } catch (error) {
      return new Response({
        success: false,
        message: 'error occured',
      });
    }
  }
}
