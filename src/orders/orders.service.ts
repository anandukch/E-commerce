import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from 'src/schemas/cart.schema';
import { Configurations } from 'src/schemas/configurations.schema';
import { DeliveryItem, Order, OrderItem } from 'src/schemas/order.schema';
import { Products } from 'src/schemas/products.schema';
import { CONFIGURATIONS, ORDER_STATUS } from 'src/shared/Enums';
import { MAILER } from 'src/shared/Mailer';
import { Response } from 'src/shared/response';
import { UsersService } from 'src/users/users.service';
import { OrderDto } from './dto/order.dto';
import * as exceljs from 'exceljs';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    @InjectModel(Products.name) private readonly productModel: Model<Products>,
    @InjectModel(Configurations.name)
    private readonly congigurationsModel: Model<Configurations>,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  async create(order: OrderDto, user) {
    const { cartId, addressId } = order;
    try {
      const cart = await this.cartModel
        .findOne({ systemId: cartId, userId: user.systemId })
        .exec();
      if (!cart) {
        return new Response({
          success: false,
          message: 'Cart not found',
        });
      }

      const sid = await this.orderModel.countDocuments().exec();

      const orderItems = await this.createOrderItems(cart);
      const userDetail = await this.userService.findUser(user);

      const address = userDetail.address.find((x) => x.systemId == addressId);
      console.log(addressId);
      const deliveryDetail = new DeliveryItem({
        name: address.name,
        contactNumber: address.contactNumber,
        addressLine1: address.firstAddress,
        addressLine2: address.secondAddress,
        state: address.state,
        pincode: address.pincode,
      });
      const newOrder = new this.orderModel({
        systemId: sid + 1,
        userId: user.systemId,
        delivery: deliveryDetail,
        items: orderItems,
        status: ORDER_STATUS.RECEIVED,
      });
      await newOrder.save();
      await this.cartModel.updateOne({ systemId: cartId }, { cartItems: [] });
      const cartUser = await this.userService.findUser(user);
      if (cartUser?.emailId) {
        MAILER.sendMailWithOrderDetails(
          await this.generateOrderNumber(),
          { emailId: cartUser.emailId, firstName: cartUser.firstName },
          newOrder,
        );
      }
      return new Response({
        success: true,
        message: 'Order Placed Successfully',
        data: {
          orderId: newOrder.systemId,
          userId: user.systemId,
          delivery: addressId,
          items: orderItems,
          status: newOrder.status,
          createdOn: newOrder.createdOn,
        },
      });
    } catch (error) {
      return new Response({
        success: false,
        message: error.message,
      });
    }
  }

  async getAll() {
    const orders = await this.orderModel.find().select('-_id -__v').exec();
    return new Response({
      success: true,
      message: 'Orders fetched successfully',
      data: orders.map((order) => {
        return this.orderResponse(order);
      }),
    });
  }

  async fetchOrderById(orderId: number) {
    const order = await this.orderModel.findOne({ systemId: orderId }).exec();
    return new Response({
      success: true,
      message: 'Order fetched successfully',
      data: this.orderResponse(order),
    });
  }

  async accept(orderId: number) {
    if (
      !(await this.orderModel
        .findOne({ systemId: orderId, status: ORDER_STATUS.RECEIVED })
        .exec())
    ) {
      return new Response({
        success: false,
        message: 'Order cannot be accepted.',
      });
    }
    const order = await this.orderModel.findOneAndUpdate(
      { systemId: orderId },
      { status: ORDER_STATUS.ACCEPTED },
      { new: true },
    );
    return new Response({
      success: true,
      message: 'Order accepted successfully',
      data: this.orderResponse(order),
    });
  }

  async reject(orderId: number) {
    if (
      !(await this.orderModel
        .findOne({
          systemId: orderId,
          status: { $in: [ORDER_STATUS.RECEIVED, ORDER_STATUS.ACCEPTED] },
        })
        .exec())
    ) {
      return new Response({
        success: false,
        message: 'Order cannot be rejected.',
      });
    }
    const order = await this.orderModel.findOneAndUpdate(
      { systemId: orderId },
      { status: ORDER_STATUS.REJECTED },
      { new: true },
    );
    return new Response({
      success: true,
      message: 'Order rejected successfully',
      data: this.orderResponse(order),
    });
  }

  async complete(orderId: number) {
    if (
      !(await this.orderModel
        .findOne({ systemId: orderId, status: ORDER_STATUS.ACCEPTED })
        .exec())
    ) {
      return new Response({
        success: false,
        message: 'Order cannot be completed.',
      });
    }
    const order = await this.orderModel.findOneAndUpdate(
      { systemId: orderId },
      { status: ORDER_STATUS.COMPLETED },
      { new: true },
    );
    return new Response({
      success: true,
      message: 'Order completed successfully',
      data: this.orderResponse(order),
    });
  }

  async cancel(orderId: number) {
    if (
      !(await this.orderModel
        .findOne({
          systemId: orderId,
          status: { $in: [ORDER_STATUS.RECEIVED, ORDER_STATUS.ACCEPTED] },
        })
        .exec())
    ) {
      return new Response({
        success: false,
        message: 'Order cannot be cancelled.',
      });
    }
    const order = await this.orderModel.findOneAndUpdate(
      { systemId: orderId },
      { status: ORDER_STATUS.CANCELLATION_REQUESTED },
      { new: true },
    );
    return new Response({
      success: true,
      message: 'Order cancelled successfully',
      data: this.orderResponse(order),
    });
  }

  async getOrder(user) {
    const orders = await this.orderModel.find({ userId: user.systemId }).exec();
    return new Response({
      success: true,
      message: 'Order fetched successfully',
      data: orders.map((order) => {
        return this.orderResponse(order);
      }),
    });
  }

  orderResponse(order: Order) {
    const cartItems = order.items.map((item) => {
      return {
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        description: item.description,
      };
    });
    const delivery = {
      name: order.delivery.name,
      contactNumber: order.delivery.contactNumber,
      addressLine1: order.delivery.addressLine1,
      addressLine2: order.delivery.addressLine2,
      state: order.delivery.state,
      pincode: order.delivery.pincode,
    };
    return {
      orderId: order.systemId,
      userId: order.userId,
      delivery: delivery,
      items: cartItems,
      status: order.status,
      createdOn: order.createdOn,
    };
  }
  async createOrderItems(cart: Cart) {
    return await Promise.all(
      cart.cartItems.map(async (item) => {
        const product = await this.productModel
          .findOne({ systemId: item.productId })
          .exec();
        const order = new OrderItem({
          productId: product.systemId,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          description: product.description,
        });
        return order;
      }),
    );
  }

  async generateOrderNumber() {
    const now = new Date();
    const today = this.getFormatedDate(now);
    const prevOrder = await this.congigurationsModel
      .findOne({ key: CONFIGURATIONS.ORDER_NUMBER })
      .exec();
    if (prevOrder === null) {
      await this.congigurationsModel.create({
        key: CONFIGURATIONS.ORDER_NUMBER,
        value: 1,
        updatedOn: now,
      });
      return parseInt(`${today}0001`);
    }
    let generatedLastNumber;
    if (this.getFormatedDate(prevOrder.updatedOn) !== today) {
      await this.congigurationsModel.updateOne(
        {
          key: CONFIGURATIONS.ORDER_NUMBER,
        },
        {
          $set: {
            updatedOn: now,
            value: 1,
          },
        },
      );
      generatedLastNumber = '0001';
    } else {
      generatedLastNumber = ('000' + (prevOrder.value + 1)).slice(-4);
      prevOrder.value = generatedLastNumber;
      prevOrder.save();
    }
    return parseInt(today + generatedLastNumber);
  }

  getFormatedDate(date: Date) {
    var todayUTC = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    );
    return todayUTC.toISOString().slice(0, 10).replace(/-/g, '');
  }

  async getTotal() {
    const total = await this.orderModel
      .countDocuments({ status: { $ne: ORDER_STATUS.REJECTED } })
      .exec();
    return total;
  }
  async getTrends(start, end) {
    const orders = await this.orderModel
      .find({ createdOn: { $gte: start, $lte: end } })
      .exec();
    const trends = orders.map((order) => {
      return this.orderResponse(order);
    });
    return trends;
  }

  async getCSV(): Promise<any> {
    let workbook = new exceljs.Workbook();
    let worksheet = workbook.addWorksheet('Tutorials');
    worksheet.columns = [
      { header: 'id', key: 'id', width: 5 },
      { header: 'title', key: 'title', width: 25 },
    ];
    worksheet.addRow([{ id: 1, title: 'Title 1' }]);
    return await workbook.xlsx.writeBuffer();
  }


  async dropCollection() {
    await this.orderModel.deleteMany({});
  }
}
