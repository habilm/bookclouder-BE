import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})

/**
 * Email collection use to track email action such as OTP validation, forgot password etc.
 */
export class Email extends Document {
  @Prop({
    required: true,
    minlength: 3,
    maxlength: 100,
    trim: true,
    type: String,
  })
  name: string;

  @Prop({
    required: true,
    minlength: 3,
    maxlength: 100,
    trim: true,
    type: String,
  })
  toEmail: string;

  @Prop({
    required: true,
    minlength: 3,
    maxlength: 100,
    type: String,
  })
  toName: string;

  /**
   * OTP or any unique identifier
   */
  @Prop({
    required: true,
    minlength: 4,
    maxlength: 50,
    type: String,
  })
  token: string;

  /**
   * Expire the Email token with the specified time in seconds
   */
  @Prop({
    required: true,
    minlength: 1,
    maxlength: 20,
    type: Date,
  })
  expireAt: Date;

  @Prop({
    required: false,
    minlength: 3,
    maxlength: 20,
    type: String,
  })
  ip: string;

  @Prop({
    required: false,
    Type: String,
    default: false,
  })
  isUsed: boolean;
}
export const EmailSchema = SchemaFactory.createForClass(Email);
