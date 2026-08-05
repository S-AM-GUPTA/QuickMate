import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { UseGuards } from '@nestjs/common';
// import { AuthGuard } from '../auth/auth.guard'; // Assume frontend sends auth if needed, but for now allow basic chat

@WebSocketGateway({
  cors: {
    origin: '*', // In production, restrict to frontend URL
  },
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private prisma: PrismaService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinTaskRoom')
  handleJoinRoom(
    @MessageBody() data: { taskId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.taskId);
    console.log(`Client ${client.id} joined room ${data.taskId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: { taskId: string; senderId: string; text: string; senderRole: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Received message:', data);

    try {
      // Save message to database
      const msg = await this.prisma.message.create({
        data: {
          taskId: data.taskId,
          senderId: data.senderId,
          messageText: data.text,
        },
        include: {
          sender: {
            select: { id: true, name: true, role: true }
          }
        }
      });

      const responsePayload = {
        id: msg.id,
        taskId: msg.taskId,
        senderId: msg.senderId,
        text: msg.messageText,
        senderRole: data.senderRole, // Keep UI compatibility
        createdAt: msg.createdAt,
      };

      // Broadcast to everyone in the room EXCEPT the sender (sender already updates their UI)
      // Actually, standard practice is to broadcast to everyone including sender so they know it succeeded,
      // but if UI handles optimistic updates, broadcast to others.
      // We'll emit to the room.
      this.server.to(data.taskId).emit('newMessage', responsePayload);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  }
}
