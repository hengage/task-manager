import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task, TaskSchema } from './schema/task.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '3600s' },
      }),
    }),
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService, MongooseModule],
})
export class TasksModule {}
