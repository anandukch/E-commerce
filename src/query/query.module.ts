import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Query, QuerySchema } from 'src/schemas/query.schema';
import { QueryController } from './query.controller';
import { QueryService } from './query.service';

@Module({
  controllers: [QueryController],
  providers: [QueryService],
  imports: [
    MongooseModule.forFeature([{ name: Query.name, schema: QuerySchema }]),
  ],
  exports: [QueryService],
})
export class QueryModule {}
