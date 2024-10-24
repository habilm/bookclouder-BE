import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User extends Document {
  @Prop({
    required: true,
    minlength: 3,
    maxlength: 100,
    trim: true,
    type: String,
  })
  fullName: string;

  @Prop({
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 100,
    trim: true,
    type: String,
  })
  email: string;

  @Prop({
    required: true,
    minlength: 3,
    maxlength: 20,
    type: String,
  })
  password: string;

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
  })
  active: boolean;
}
export const UserSchema = SchemaFactory.createForClass(User);
