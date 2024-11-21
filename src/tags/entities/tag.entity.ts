import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { User } from '../../users/entities/user.entity';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Tag extends Document {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: User.name,
  })
  userId: string;

  @Prop({
    required: true,
    maxlength: 255,
    trim: true,
    type: String,
  })
  name: string;

  @Prop({
    minlength: 7,
    maxlength: 7,
    trim: true,
    type: String,
    default: null,
  })
  color?: string;

  @Prop({
    required: false,
    type: Date,
    default: null,
  })
  deletedAt?: Date | null;
}
export const TagSchema = SchemaFactory.createForClass(Tag);
