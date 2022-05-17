import { Body, Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { ROLES } from 'src/shared/Enums';
import { StockResponseDto } from './dto/stock-response.dto';
import { StockDto } from './dto/stock.dto';
import { StocksService } from './stocks.service';

@ApiTags('stocks')
@Controller('stocks')
export class StocksController {
  constructor(private readonly stockService: StocksService) {}

  @Roles(ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('/:productId/add')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'Stock added',
    type: StockResponseDto,
  })
  async addStock(
    @Param('productId') productId: number,
    @Body() stock: StockDto,
  ) {
    return await this.stockService.addStock(stock, productId);
  }

  @Roles(ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('/:productId/remove')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'Stock added',
    type: StockResponseDto,
  })
  async removeStock(
    @Param('productId') productId: number,
    @Body() stock: StockDto,
  ) {
    return await this.stockService.removeStock(stock, productId);
  }

  @Roles(ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/:productId/history')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'Stock history',
    type: [StockResponseDto],
  })
  async getStockHistory(@Param('productId') productId: number) {
    return await this.stockService.getStockHistory(productId);
  }
}
