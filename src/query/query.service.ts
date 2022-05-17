import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Query } from 'src/schemas/query.schema';
import { QUERY_STATUS, ROLES } from 'src/shared/Enums';
import { Response } from 'src/shared/response';
import { CreateQueryDto } from './dto/create-query.dto';

@Injectable()
export class QueryService {
  constructor(
    @InjectModel(Query.name) private readonly queryModel: Model<Query>,
  ) {}

  async create(query: CreateQueryDto, user) {
    if (
      !query.hasOwnProperty('query') ||
      !query.hasOwnProperty('contactNumber')
    ) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Required fields missing',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (query.query === '' || query.contactNumber === '') {
      return new Response({
        success: false,
        message: 'Field cannot be empty',
      });
    }
    const sid = await this.queryModel.countDocuments().exec();
    const createdQuery = new this.queryModel({
      systemId: sid + 1,
      userId: user.systemId,
      query: query.query,
      contactNumber: query.contactNumber,
      updatedOn: new Date(),
    });
    await createdQuery.save();
    return new Response({
      success: true,
      message: 'Query created successfully',
      data: this.createQueryResponse(createdQuery),
    });
  }

  async getAll() {
    const queries = await this.queryModel.find().exec();
    return new Response({
      success: true,
      message: 'Queries fetched successfully',
      data: queries.map((query) => this.createQueryResponse(query)),
    });
  }

  async resolve(queryId: number, user) {
    if (user?.role === ROLES.ADMIN) {
      const query = await this.queryModel.findOneAndUpdate(
        { systemId: queryId },
        { status: QUERY_STATUS.RESOLVED },
      );
      return new Response({
        success: true,
        message: 'Query resolved',
        data: this.createQueryResponse(query),
      });
    }
    const resolvedQuery = await this.queryModel.findOneAndUpdate(
      { userId: user.systemId, systemId: queryId },
      { status: QUERY_STATUS.RESOLVED },
    );
    if (!resolvedQuery) {
      return new Response({
        success: false,
        message: 'Invalid query details',
      });
    }
    return new Response({
      success: true,
      message: 'Query resolved',
      data: this.createQueryResponse(resolvedQuery),
    });
  }

  createQueryResponse(query: Query) {
    return {
      userId: query.userId,
      query: query.query,
      contactNumber: query.contactNumber,
      updatedOn: query.updatedOn,
      createdOn: query.createdOn,
      status: query.status,
    };
  }

  async getTotalQuery() {
    const queries=await this.queryModel.countDocuments({status:QUERY_STATUS.ACTIVE})
    return queries;
  }
  async dropCollection() {
    await this.queryModel.deleteMany({});
  }
}
