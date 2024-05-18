import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as mongooseSchema } from 'mongoose';

export type ITaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({
    required: true,
    enum: ['pending', 'in progress', 'completed', 'backlog'],
    default: 'pending',
  })
  status: string;

  @Prop({ required: true, enum: ['low', 'medium', 'high'], default: 'medium' })
  priority: string;

  @Prop({ required: true })
  due_date: Date;

  @Prop({ required: true, user: mongooseSchema.Types.ObjectId })
  user: mongooseSchema.Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
