// notes.gateway.ts
import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class PostsGateway {
  private readonly logger = new Logger(PostsGateway.name);
  @WebSocketServer()
  server: Server;

  // Nhận thứ tự mới từ 1 client và gửi cho tất cả client khác
  @SubscribeMessage('updateOrder')
  handleUpdateOrder(@MessageBody() data: any) {
    this.server.emit('orderUpdated', data); // broadcast
  }
  @SubscribeMessage('notesUpdate')
  handleNotesUpdate() {
    this.server.emit('notesUpdated');
  }
  handleConnection(client: Socket) {
    this.logger.log(`⚡ Client connected: ${client.id}`);
    client.emit('connected', { message: 'Kết nối WebSocket thành công!' });
  }
  handleDisconnect(client: Socket) {
    this.logger.log(`❌ Client disconnected: ${client.id}`);
  }
}
