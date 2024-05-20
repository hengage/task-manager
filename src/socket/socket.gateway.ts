import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class SocketGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('fetch-tasks')
  fetchTasks(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ): void {
    console.log({ message, client });
    this.emit('fetched-tasks', 'tasks');
  }

  emit(eventName: string, data: any): void {
    this.server.sockets.emit(eventName, data);
  }
}
