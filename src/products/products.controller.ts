import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Query,
  Delete,
  Param,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/product.dto';
import { Request } from 'express';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { ApiBody, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ROLES } from 'src/shared/Enums';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductResponseDto } from './dto/productResponse.dto';
import { ProductSearchDto } from './dto/product-search.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'Product Created',
    type: ProductResponseDto,
  })
  async createProduct(@Body() product: ProductDto, @Req() req: Request) {
    return await this.productsService.createProduct(product, req?.user);
  }

  @ApiBody({ description: 'POSTMAN(Tested)' })
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Products List',
    type: [ProductDto],
  })
  async getAllProducts(
    @Query('startIndex') startIndex: number,
    @Query('limit') limit: number,
  ) {
    return await this.productsService.fetchAllProducts(startIndex, limit);
  }

  @Get('search')
  @ApiResponse({
    status: 200,
    description: 'Products List',
    type: [ProductDto],
  })
  async searchProducts(
    @Query('startIndex') startIndex: number,
    @Query('limit') limit: number,
    @Body() search: ProductSearchDto,
  ) {
    return await this.productsService.searchProducts(search, startIndex, limit);
  }

  @Roles(ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBody({ description: 'POSTMAN(Tested)' })
  @Delete('/:productId')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'Product deleted',
  })
  async deleteProduct(@Param('productId') productId: number) {
    return await this.productsService.delete(productId);
  }

  @Roles(ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBody({ description: 'POSTMAN(Tested)' })
  @Put('/:productId/disable')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'Product Disabled',
  })
  async disableProduct(@Param('productId') productId: number) {
    return this.productsService.disable(productId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'Edit Product',
    type: ProductResponseDto,
  })
  @ApiBody({ description: 'POSTMAN(Tested)' })
  @Put('/:productId')
  async editProduct(
    @Body() product: ProductDto,
    @Param('productId') productId: number,
  ) {
    return await this.productsService.edit(productId, product);
  }
  @ApiResponse({
    status: 200,
    description: 'Product Details',
    type: ProductDto,
  })
  @ApiBody({ description: 'POSTMAN(Tested)' })
  @Get('/:productId')
  async getProductById(@Param('productId') productId: number) {
    return await this.productsService.fetchProductById(productId);
  }

  @Roles(ROLES.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/uploads')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return await this.productsService.uploadProducts(file, req.user);
  }
}
