import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { OrderResponseDto } from 'src/orders/dto/order-response.dto';
import { ROLES } from 'src/shared/Enums';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Roles(ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('products')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'Product total fetched',
  })
  async getTotalProducts() {
    return await this.metricsService.getProductsTotal();
  }

  @Roles(ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('orders')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'Order total fetched',
  })
  async getTotalOrders() {
    return await this.metricsService.getOrdersTotal();
  }

  @Roles(ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('users')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'Total users fetched',
  })
  async getTotalUsers() {
    return await this.metricsService.getUsersCount();
  }

  @Roles(ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('query')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'Total queries fetched',
  })
  async getTotalQueries() {
    return await this.metricsService.getQueryCount();
  }

  @Roles(ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/trends/orders')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'order trends fetched',
    type: [OrderResponseDto],
  })
  async getOrderTrends(@Query('start') start: Date, @Query('end') end: Date) {
    return await this.metricsService.getOrderTrends(start, end);
  }

  @Roles(ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/trends/users')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'order trends fetched',
    type:[UserResponseDto]
  })
  async getUserTrends(@Query('start') start: Date, @Query('end') end: Date) {
    return await this.metricsService.getUserTrends(start, end);
  }
}
