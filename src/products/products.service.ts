import { forwardRef, Inject, Injectable, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ROLES, STATUS } from 'src/shared/Enums';
import { Response } from 'src/shared/response';
import { ProductDto } from './dto/product.dto';
import { Products } from '../schemas/products.schema';
import { StocksService } from 'src/stocks/stocks.service';
import { ProductSearchDto } from './dto/product-search.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Products.name) private readonly productModel: Model<Products>,
    @Inject(forwardRef(() => StocksService))
    private stockService: StocksService,
  ) {}

  async createProduct(product: ProductDto, user: any) {
    try {
      if (
        !product.hasOwnProperty('name') ||
        !product.hasOwnProperty('price') ||
        !product.hasOwnProperty('description')
      ) {
        return new Response({
          success: false,
          message: 'name, price and description are required',
        });
      }
      if (product.name == '' || product.description == '') {
        return new Response({
          success: false,
          message: 'Please fill all the fields',
        });
      }

      const productsCount = await this.productModel.countDocuments();
      const createdProduct = await this.productModel.create({
        name: product.name,
        description: product.description,
        price: product.price,
        systemId: productsCount + 1,
        createdBy: user.systemId,
      });
      await this.stockService.createStock(createdProduct.systemId);
      return new Response({
        success: true,
        message: 'Product created',
        data: {
          productId: createdProduct.systemId,
          name: createdProduct.name,
          description: createdProduct.description,
          price: createdProduct.price,
        },
      });
    } catch (error) {
      return new Response({
        success: false,
        message: 'Error while creating product',
      });
    }
  }

  async fetchAllProducts(startIndex: number = 0, limit: number = 20) {
    try {
      if (startIndex < 0 || limit < 1) {
        return new Response({
          success: false,
          message: 'startIndex and limit is not valid',
        });
      }
      const products = await this.productModel
        .find({ status: STATUS.ACTIVE })
        .select('-_id systemId name description price')
        .skip(parseInt(startIndex.toString()))
        .limit(parseInt(limit.toString()))
        .sort({ name: +1 });
      return new Response({
        success: true,
        message: 'Products list',
        data: products.map((product) => {
          return {
            productId: product.systemId,
            name: product.name,
            description: product.description,
            price: product.price,
          };
        }),
      });
    } catch (e) {
      return new Response({
        success: false,
        message: 'Error while fetching products',
      });
    }
  }

  async delete(productId: number) {
    try {
      await this.productModel.updateOne(
        { systemId: productId },
        { status: STATUS.DELETED },
      );
      return new Response({
        success: true,
        message: 'product deleted',
      });
    } catch (error) {
      return new Response({
        success: false,
        message: 'Error while deleting product',
      });
    }
  }

  async disable(productId: number) {
    try {
      let product = await this.productModel.findOne({ systemId: productId });
      if (product.status === STATUS.DELETED) {
        return new Response({
          success: false,
          message: 'deleted product cannot be disabled',
        });
      }
      await this.productModel.updateOne(
        { systemId: productId },
        { status: STATUS.DISABLED },
      );
      return new Response({
        success: true,
        message: 'product disabled',
      });
    } catch (error) {
      return new Response({
        success: false,
        message: 'Error while disabling product',
      });
    }
  }

  async edit(productId: number, product: ProductDto) {
    try {
      let productData = await this.productModel.findOne({
        systemId: productId,
      });
      if (productData.status === STATUS.DELETED) {
        return new Response({
          success: false,
          message: 'Cannot edit deleted product',
        });
      }
      await this.productModel.updateOne(
        { systemId: productId },
        { ...product },
      );
      return new Response({
        success: true,
        message: 'product edited',
        data: {
          productId: productId,
          name: product.name,
          description: product.description,
          price: product.price,
        },
      });
    } catch (error) {
      return new Response({
        success: false,
        message: 'Error while editing product',
      });
    }
  }

  async fetchProductById(productId: number) {
    try {
      let product;
      product = await this.productModel.findOne({ systemId: productId });
      if (product.status === STATUS.ACTIVE) {
        return new Response({
          success: true,
          message: 'product fetched',
          data: {
            name: product.name,
            description: product.description,
            price: product.price,
            status: product.status,
            createdOn: product.createdOn,
          },
        });
      }
      return new Response({
        success: false,
        message: 'Invalid ProductId',
      });
    } catch (error) {
      return new Response({
        success: false,
        message: 'Error while fetching product',
      });
    }
  }

  async searchProducts(searchItem:ProductSearchDto, startIndex: number = 0, limit: number = 20) {
    try {
      if (startIndex < 0 || limit < 1) {
        return new Response({
          success: false,
          message: 'startIndex and limit is not valid',
        });
      }
      const products = await this.productModel.find({
        status: STATUS.ACTIVE,
        name: { $regex: searchItem.name, $options: 'i' },
        category:searchItem.category
      });
      return new Response({
        success: true,
        message: 'Products list',
        data: products.map((product) => {
          return {
            productId: product.systemId,
            name: product.name,
            description: product.description,
            price: product.price,
          };
        }),
      });
    } catch (error) {
      return new Response({
        success: false,
        message: 'Error while fetching products',
      });
    }
  }

  async createProductsResponse(products) {
    const firstResponse = [];
    const secondResponse = [];
    products.map(async (product) => {
      const { data } = await this.stockService.getStockTotal(product.systemId);
      if (data.total > 0) {
        firstResponse.push({
          productId: product.systemId,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: data.total,
        });
      } else {
        secondResponse.push({
          productId: product.systemId,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: data.total,
        });
      }
    });
    return firstResponse.concat(secondResponse);
  }

  async uploadProducts(file, user) {
    const sid = await this.productModel.countDocuments();
    const products = this.filterCsv(file, sid, user.systemId);
    await this.productModel.insertMany(products);
    return {
      success: true,
      message: products,
    };
  }

  filterCsv(file, sid, createdBy) {
    let count = sid + 1;
    const productFile = file.buffer.toString().split('\n');
    const productList = [];
    for (let i = 1; i < productFile.length; i++) {
      const product = productFile[i].split(',');
      if (product.includes('')) continue;
      productList.push({
        systemId: count++,
        name: product[0],
        price: product[1],
        description: product[2],
        createdBy: createdBy,
      });
    }
    return productList;
  }

  async getTotal(){
    const total = await this.productModel.countDocuments({status:[STATUS.ACTIVE,STATUS.DISABLED]});
    return total;
  }
  async dropCollection() {
    await this.productModel.deleteMany({});
  }
}
