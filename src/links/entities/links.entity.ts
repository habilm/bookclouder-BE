import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Tag } from '../../tags/entities/tag.entity';
import { User } from '../../users/entities/user.entity';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Link extends Document {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: User.name,
    index: true,
  })
  userId: string;

  @Prop({
    required: true,
    maxlength: 2000,
    trim: true,
    type: String,
  })
  title: string;

  @Prop({
    required: true,
    minlength: 10,
    maxlength: 3000,
    trim: true,
    type: String,
  })
  url: string;

  @Prop({
    required: false,
    minlength: 3,
    maxlength: 3000,
    type: String,
  })
  icon: string;

  @Prop({
    type: [Types.ObjectId],
    ref: Tag.name,
  })
  tags: Types.ObjectId[];

  @Prop({
    type: Date,
    default: null,
    index: true,
  })
  deletedAt: Date | null;
}
export const LinkSchema = SchemaFactory.createForClass(Link);
