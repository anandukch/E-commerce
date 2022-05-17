import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CartsService } from './carts.service';
import { CartItemDto } from './dto/cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UserCartDto } from './dto/user-cart.dto';
import { UpdateItem } from './dto/update-item.dto';

@ApiTags('carts')
@Controller('carts')
export class CartsController {
  constructor(private readonly cartService: CartsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBody({ description: 'POSTMAN(Tested)' })
  @Post('/:cartId/items')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'Cart item list',
    type: AddToCartDto,
  })
  async addToCart(
    @Body() cartItem: CartItemDto,
    @Request() req: any,
    @Param('cartId') cartId: number,
  ) {
    return await this.cartService.add(cartItem, cartId, req?.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBody({ description: 'POSTMAN(Tested)' })
  @Get('/user')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'cart item list',
    type: UserCartDto,
  })
  async getCart(@Request() req: any) {
    return await this.cartService.get(req?.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBody({ description: 'POSTMAN(Tested)' })
  @Delete('/item/:cartItemId')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'cart deleted',
  })
  async removeFromCart(
    @Request() req: any,
    @Param('cartItemId') cartItemId: number,
  ) {
    return await this.cartService.remove(cartItemId, req?.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBody({ description: 'POSTMAN(Tested)' })
  @Delete('/:cartId')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiOperation({
    description: "Used to clear user's cart. Removes all items from the cart.",
  })
  @ApiResponse({
    status: 200,
    description: 'Cart Cleared',
  })
  async clearCart(@Request() req: any, @Param('cartId') cartId: string) {
    return this.cartService.clearCart(req.user, +cartId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBody({ description: 'POSTMAN(Tested)' })
  @Put('/:cartId')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'cart updated',
    type: UserCartDto,
  })
  async updateCart(
    @Param('cartId') cartId: number,
    @Body() cartItems: [UpdateCartItemDto],
    @Request() req: any,
  ) {
    return await this.cartService.update(cartId, cartItems, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBody({ description: 'POSTMAN(Tested)' })
  @Post('/user')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'Create cart',
    type: '',
  })
  async createCart(@Request() req: any) {
    return await this.cartService.create(req?.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBody({ description: 'POSTMAN(Tested)' })
  @Put('/:cartId/items/:cartItemId')
  @ApiHeader({
    name: 'Bearer Token',
    description: 'Authorization',
  })
  @ApiResponse({
    status: 200,
    description: 'cart item updated',
    type: UserCartDto,
  })
  async updateCartItem(
    @Param('cartId') cartId: number,
    @Param('cartItemId') cartItemId: number,
    @Body() body: UpdateItem,
    @Request() req: any,
  ) {
    return await this.cartService.updateCartItem(
      cartId,
      cartItemId,
      body.quantity,
      req.user,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBody({ description: 'POSTMAN(Tested)', type: [CartItemDto] })
  @Post('/:cartId')
  @ApiResponse({
    status: 200,
    description: 'Add to cart',
    type: AddToCartDto,
  })
  async addItemsToCart(
    @Param('cartId') cartId: number,
    @Body() cartItems: [CartItemDto],
    @Request() req: any,
  ) {
    return await this.cartService.addItems(cartId, cartItems, req.user);
  }
}
