import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartItem } from 'src/schemas/cart.schema';
import { Products } from 'src/schemas/products.schema';
import { ROLES, STATUS } from 'src/shared/Enums';
import { Response } from 'src/shared/response';
import { CartItemDto } from './dto/cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
@Injectable()
export class CartsService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    @InjectModel(Products.name) private readonly productModel: Model<Products>,
  ) {}

  async add(cartItem: CartItemDto, cartId: number, user: any) {
    const cart = await this.cartModel.findOne({
      systemId: cartId,
      userId: user.systemId,
    });
    if (!cart) {
      return new Response({ success: false, message: 'Invalid Cart Id' });
    }
    const product = await this.productModel.findOne({
      systemId: cartItem.productId,
    });
    if (product.status === STATUS.DISABLED) {
      return new Response({
        success: false,
        message: 'Disabled products cannot be added to cart',
      });
    }
    if (product.status === STATUS.DELETED) {
      return new Response({
        success: false,
        message: 'Invalid Product Id',
      });
    }
    const item = cart.cartItems.find(
      (item) => item.productId === cartItem.productId,
    );
    if (item) {
      item.quantity += cartItem.quantity;
    } else {
      const newCartItem = new CartItem({
        systemId: cart.cartItems.length + 1,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
      });
      cart.cartItems.push(newCartItem);
    }
    await cart.save();
    return new Response({
      success: true,
      message: 'Added to Cart',
      data: {
        userId: user.systemId,
        cartId: cart.systemId,
        cartItems: await this.cartItemResponse(cart),
      },
    });
  }

  async get(user) {
    const cart = await this.cartModel.findOne({ userId: user.systemId });
    if (!cart) {
      return new Response({ success: false, message: 'Cart not found' });
    }
    return new Response({
      success: true,
      message: 'Cart Items',
      data: {
        cartId: cart.systemId,
        userId: user.systemId,
        cartItems: await this.cartItemResponse(cart),
      },
    });
  }

  async remove(cartItemId: number, user: any) {
    const cart = await this.cartModel.findOne({ userId: user.systemId });
    if (!cart) {
      return new Response({ success: false, message: 'Cart not found' });
    }
    cartItemId = parseInt(cartItemId.toString());

    const cartItem = cart.cartItems.find(
      (item) => item.systemId === cartItemId,
    );

    if (!cartItem) {
      return new Response({ success: false, message: 'Item not found' });
    }
    cart.cartItems.splice(cart.cartItems.indexOf(cartItem), 1);
    await cart.save();
    return new Response({
      success: true,
      message: 'Removed from Cart',
      data: {
        cartId: cart.systemId,
        userId: user.systemId,
        cartItems: await this.cartItemResponse(cart),
      },
    });
  }

  async update(cartId: number, cartItems: UpdateCartItemDto[], user) {
    if (user.role === ROLES.ADMIN) {
      if (!(await this.cartModel.findOne({ systemId: cartId }))) {
        return new Response({ success: false, message: 'Cart not found' });
      }
      await this.updateCartItemHandler(cartItems);
      const cart = await this.cartModel.findOne({ systemId: cartId });
      return new Response({
        success: true,
        message: 'Cart Items Updated',
        data: {
          cartId: cart.systemId,
          userId: user.systemId,
          cartItems: await this.cartItemResponse(cart),
        },
      });
    }
    if (
      !(await this.cartModel.findOne({
        userId: user.systemId,
        systemId: cartId,
      }))
    ) {
      return new Response({
        success: false,
        message: 'Cart not found',
      });
    }
    await this.updateCartItemHandler(cartItems);
    const userCart = await this.cartModel.findOne({
      userId: user.systemId,
      systemId: cartId,
    });
    return new Response({
      success: true,
      message: 'Cart Items Updated',
      data: {
        cartId: userCart.systemId,
        userId: user.systemId,
        cartItems: await this.cartItemResponse(userCart),
      },
    });
  }

  async updateCartItem(
    cartId: number,
    cartItemId: number,
    quantity: number,
    user: any,
  ) {
    const cart = await this.cartModel.findOne({
      userId: user.systemId,
      systemId: cartId,
    });
    if (!cart) {
      return new Response({ success: false, message: 'Cart not found' });
    }
    const cartItem = cart.cartItems.find(
      (item) => item.systemId === parseInt(cartItemId.toString()),
    );
    if (!cartItem) {
      return new Response({ success: false, message: 'Cart Item not found' });
    }
    if (quantity < 0) {
      return new Response({ success: false, message: 'Invalid Quantity' });
    }
    if (quantity === 0) {
      cart.cartItems.splice(cart.cartItems.indexOf(cartItem), 1);
      await cart.save();
    } else {
      cartItem.quantity = quantity;
      await cart.save();
    }

    return new Response({
      success: true,
      message: 'Cart Item Updated',
      data: {
        cartId: cart.systemId,
        userId: user.systemId,
        cartItems: await this.cartItemResponse(cart),
      },
    });
  }

  async updateCartItemHandler(cartItems: UpdateCartItemDto[]) {
    return await Promise.all(
      cartItems.map(async (item: UpdateCartItemDto) => {
        await this.cartModel.findOneAndUpdate(
          { 'cartItems.systemId': item.cartItemId },
          { 'cartItems.$.quantity': item.quantity },
        );
      }),
    );
  }

  async cartItemResponse(cart: Cart) {
    return await Promise.all(
      cart.cartItems.map(async (item) => {
        const product = await this.productModel.findOne({
          systemId: item.productId,
        });
        return {
          systemId: item.systemId,
          productId: item.productId,
          quantity: item.quantity,
          name: product.name,
          price: product.price,
          description: product.description,
        };
      }),
    );
  }

  async create(user: any) {
    const cart = await this.cartModel.findOne({ userId: user.systemId });
    if (cart) {
      return new Response({
        success: false,
        message: 'Cart already exists',
      });
    }
    const cartCount = await this.cartModel.countDocuments();
    await this.cartModel.create({
      systemId: cartCount + 1,
      userId: user.systemId,
      cartItems: [],
      updatedOn: new Date(),
    });
    return new Response({
      success: true,
    });
  }

  async addItems(cartId: number, cartItems: CartItemDto[], user: any) {
    if (!(await this.cartModel.findOne({ systemId: cartId }))) {
      return new Response({ success: false, message: 'Cart not found' });
    }
    cartItems.forEach(async (cartItem) => {
      await this.add(cartItem, cartId, user);
    });
    let cart = await this.cartModel.findOne({ systemId: cartId });
    return new Response({
      success: true,
      message: 'Added to Cart',
      data: {
        userId: user.systemId,
        cartItems: await this.cartItemResponse(cart),
      },
    });
  }

  async clearCart(user: { systemId: number }, cartId: number) {
    try {
      const userId = user.systemId;

      const userCart = await this.cartModel.findOne({
        systemId: cartId,
        userId,
      });
      if (userCart === null) {
        return new Response({
          success: false,
          message: 'Invalid Cart Id',
          data: { cartId },
        });
      }

      await userCart.updateOne({ $set: { cartItems: [] } });

      return new Response({
        success: true,
        message: 'Cart cleared',
        data: {
          cartId: userCart.systemId,
          userId: user.systemId,
          cartItems: [],
        },
      });
    } catch (ex) {
      return new Response({
        success: false,
        message: 'Something went wrong',
        data: { cartId },
      });
    }
  }
  
  async dropCollection() {
    await this.cartModel.deleteMany({});
  }
}
