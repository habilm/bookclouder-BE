import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import * as bcrypt from 'bcrypt';

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
    Type: Boolean,
    default: true,
  })
  active: boolean;

  @Prop({
    required: true,
    Type: Boolean,
    default: false,
  })
  isEmailVerified: boolean;
}
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt();

  if (this.password) {
    this.password = await bcrypt.hash(this.password, salt);
  }
});
