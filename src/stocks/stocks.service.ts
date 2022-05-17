import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stock } from 'src/schemas/stock.schema';
import { StockTotal } from 'src/schemas/stockTotal.schema';
import { STOCK_STATUS } from 'src/shared/Enums';
import { Response } from 'src/shared/response';
import { StockDto } from './dto/stock.dto';

@Injectable()
export class StocksService {
  constructor(
    @InjectModel(Stock.name) private readonly stockModel: Model<Stock>,
    @InjectModel(StockTotal.name)
    private readonly stockTotalModel: Model<StockTotal>,
  ) {}

  async addStock(stock: StockDto, productId: number) {
    try {
      let totalStock = await this.stockTotalModel.findOne({
        productId: productId,
      });
      if (totalStock) {
        totalStock.quantity += stock.quantity;
      } else {
        totalStock = new this.stockTotalModel({
          productId: productId,
          quantity: stock.quantity,
        });
      }
      totalStock.save();
      const newStock = new this.stockModel({
        productId,
        quantity: stock.quantity,
        action: STOCK_STATUS.ADDITION,
        total: totalStock.quantity,
      });
      await newStock.save();
      return new Response({
        success: true,
        message: 'Stock added succesfully',
        data: {
          systemId: newStock.systemId,
          productId: newStock.productId,
          quantity: newStock.quantity,
          total: newStock.total,
          action: newStock.action,
          createdBy: newStock.createdBy,
          createdOn: newStock.createdOn,
        },
      });
    } catch (error) {
      return new Response({
        success: false,
        message: 'Error adding stock',
      });
    }
  }

  async removeStock(stock: StockDto, productId: number) {
    try {
      let totalStock = await this.stockTotalModel.findOne({
        productId: productId,
      });
      if (totalStock) {
        if (totalStock.quantity - stock.quantity < 0) {
          return new Response({
            success: false,
            message: 'Invalid quantity',
          });
        }
        totalStock.quantity -= stock.quantity;
      } else {
        totalStock = new this.stockTotalModel({
          productId: productId,
          quantity: -stock.quantity,
        });
      }
      totalStock.save();
      const newStock = new this.stockModel({
        productId,
        quantity: stock.quantity,
        action: STOCK_STATUS.REDUCTION,
        total: totalStock.quantity,
      });
      await newStock.save();
      return new Response({
        success: true,
        message: 'Stock removed succesfully',
        data: {
          systemId: newStock.systemId,
          productId: newStock.productId,
          quantity: newStock.quantity,
          total: newStock.total,
          action: newStock.action,
          createdBy: newStock.createdBy,
          createdOn: newStock.createdOn,
        },
      });
    } catch (error) {
      return new Response({
        success: false,
        message: 'Error removing stock',
      });
    }
  }

  async getStockHistory(productId: number) {
    try {
      const stocks = await this.stockModel.find({ productId: productId });
      return new Response({
        success: true,
        message: 'Stock history',
        data: stocks.map((stock) => ({
          systemId: stock.systemId,
          productId: stock.productId,
          quantity: stock.quantity,
          total: stock.total,
          action: stock.action,
          createdBy: stock.createdBy,
          createdOn: stock.createdOn,
        })),
      });
    } catch (error) {
      return new Response({
        success: false,
        message: 'Error getting stock history',
        data: error.message,
      });
    }
  }

  async getStockTotal(productId: number) {
    try {
      const totalStock = await this.stockTotalModel.findOne({
        productId: productId,
      });
      return new Response({
        success: true,
        message: 'Stock total',
        data: {
          productId: totalStock.productId,
          total: totalStock.quantity,
        },
      });
    } catch (error) {
      return new Response({
        success: false,
        message: 'Error getting stock total',
      });
    }
  }

  async createStock(productId: number) {
    try {
      await this.stockTotalModel.create({
        productId: productId,
        quantity: 0,
      });
    } catch (error) {
      return new Response({
        success: false,
        message: 'Error creating stock',
      });
    }
  }
}
