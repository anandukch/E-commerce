import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { QUERY_STATUS } from 'src/shared/Enums';

@Schema()
export class Query extends Document {
  @Prop({ required: true })
  systemId: number;

  @Prop({ type: String })
  query: string;

  @Prop({ type: Number })
  userId: number;

  @Prop({ type: String })
  contactNumber: string;

  @Prop({ type: Date, default: Date.now })
  createdOn: Date;

  @Prop({ type: Date })
  updatedOn: Date;

  @Prop({ type: String, enum: QUERY_STATUS, default: QUERY_STATUS.ACTIVE })
  status: string;
}

export const QuerySchema = SchemaFactory.createForClass(Query);
