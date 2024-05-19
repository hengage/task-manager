import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import * as bcrypt from 'bcrypt';
import { HydratedDocument } from 'mongoose';

/**
 * The `User` class represents a user schema for MongoDB using Mongoose.
 */
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = HydratedDocument<User>;

UserSchema.pre('save', async function (next) {
  const user = this as UserDocument;

  // If the password is not modified, proceed to the next middleware
  if (!user.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  user.password = bcrypt.hashSync(user.password, salt);

  return next();
});
