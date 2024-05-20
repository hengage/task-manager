import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { TasksModule } from 'src/tasks';

@Module({
  imports: [TasksModule],
  providers: [SocketGateway],
})
export class SocketModule {}
