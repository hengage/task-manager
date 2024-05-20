import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TasksService } from 'src/tasks';

@WebSocketGateway({ cors: { origin: '*' } })
export class SocketGateway {
  constructor(private tasksService: TasksService) {}
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('fetch-tasks')
  async fetchTasks(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const tasks = await this.tasksService.findAll();
    this.emit('fetched-tasks', tasks);
  }

  emit(eventName: string, data: any): void {
    this.server.sockets.emit(eventName, data);
  }
}
