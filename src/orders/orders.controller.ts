import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { ROLES } from 'src/shared/Enums';
import { OrderDto } from './dto/order.dto';
import { OrdersService } from './orders.service';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderResponseDto } from './dto/order-response.dto';
import { Readable } from 'stream';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Get('/excel')
  async getOrdersCsv(@Res({ passthrough: true }) response: Response) {
    const file = await this.orderService.getCSV();
    const stream = Readable.from(file);
    response.set({
      'Content-Disposition': `inline; filename="${file.filename}"`,
      'Content-Type': file.mimetype,
    });
    return new StreamableFile(stream);
  }

  @Roles(ROLES.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'Order Created',
    type: OrderResponseDto,
  })
  async createOrder(@Body() order: OrderDto, @Req() req: Request) {
    return await this.orderService.create(order, req.user);
  }

  @Roles(ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'Orders fetched',
    type: [OrderResponseDto],
  })
  async getOrders() {
    return await this.orderService.getAll();
  }

  @Roles(ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('/:orderId/accept')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'Order accepted',
    type: OrderResponseDto,
  })
  async acceptOrder(@Param('orderId') orderId: number) {
    return await this.orderService.accept(orderId);
  }

  @Roles(ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('/:orderId/reject')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'Order rejected',
    type: OrderResponseDto,
  })
  async rejectOrder(@Param('orderId') orderId: number) {
    return await this.orderService.reject(orderId);
  }

  @Roles(ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('/:orderId/complete')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'Order completed',
    type: OrderResponseDto,
  })
  async completeOrder(@Param('orderId') orderId: number) {
    return await this.orderService.complete(orderId);
  }

  @Roles(ROLES.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/user')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'Order fetched',
    type: [OrderResponseDto],
  })
  async getUserOrder(@Req() req: Request) {
    return await this.orderService.getOrder(req.user);
  }

  @Roles(ROLES.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/:orderId')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'Order cancelled',
    type: OrderResponseDto,
  })
  async getOrderById(@Param('orderId') orderId: number) {
    return await this.orderService.fetchOrderById(orderId);
  }

  @Roles(ROLES.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/:orderId/cancel')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'Order cancelled',
    type: OrderResponseDto,
  })
  async cancelUserOrder(@Param('orderId') orderId: number) {
    return await this.orderService.cancel(orderId);
  }
}
