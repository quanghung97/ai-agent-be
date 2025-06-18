import { AuthService } from 'src/modules/auth/auth.service';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatServicegRPC } from '../chat/grpc/chat.grpc';
import { ChatMessage } from './interfaces/chat.interface';
import { ChatService } from 'src/modules/chat/services/chat.service';
import { firstValueFrom } from 'rxjs';

interface UserChannelMap {
  [userId: string]: string; // Map user ID to their channel ID
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private authService: AuthService,
    private chatServicegRPC: ChatServicegRPC,
    private chatService: ChatService,
  ) {}
  @WebSocketServer() server: Server;
  private userChannels: UserChannelMap = {};

  async handleConnection(client: Socket) {
    const user = await this.authService.verify(
      client?.handshake?.headers?.authorization || '',
    );

    !user && client.disconnect();
    console.log(`Client connected: ${user?.id}`);
  }

  async handleDisconnect(client: Socket) {
    const user = await this.authService.verify(
      client?.handshake?.headers?.authorization || '',
    );

    if (user && this.userChannels[user.id]) {
      delete this.userChannels[user.id]; // Remove user's channel on disconnect
    }
    console.log(`Client disconnected`);
  }

  // client emit to subscribe to register channel with format `user-${user.id}`
  @SubscribeMessage('subscribe')
  async handleSubscribe(client: Socket) {
    const user = await this.authService.verify(
      client?.handshake?.headers?.authorization || '',
    );
    if (!user) {
      client.disconnect();
    } else {
      const channelId = `user-${user.id}`;
      client.join(channelId); // Subscribe client to the channel
      this.userChannels[user.id] = channelId; // Update user's channel
    }
  }

  @SubscribeMessage('unsubscribe')
  async handleUnsubscribe(client: Socket) {
    const user = await this.authService.verify(
      client?.handshake?.headers?.authorization || '',
    );
    if (user && this.userChannels[user.id]) {
      client.leave(this.userChannels[user.id]); // Unsubscribe client from the channel
      delete this.userChannels[user.id]; // Remove user's channel
    }
  }

  // event `message` listener
  // @SubscribeMessage('message')
  // async handleMessage(client: Socket, payload: any) {
  //   const user = await this.authService.verify(
  //     client?.handshake?.headers?.authorization || '',
  //   );

  //   if (!user) {
  //     client.disconnect();
  //   } else {
  //     const channelId = this.userChannels[user.id];

  //     if (channelId) {
  //       this.server.to(channelId).emit('message', channelId); // Broadcast the message to all clients in channelId
  //     }
  //   }
  // }

  // send notification one-way from backend to frontend with private channel (format `user-${user.id}`) to event `notification`
  sendNotificationToChannel(userId: string, notification: any): void {
    const channelId = this.userChannels[userId];
    if (channelId) {
      this.server.to(channelId).emit('notification', notification); // Emit notification to the user's channel
    } else {
      // Handle user not subscribed to any channel
    }
  }

  @SubscribeMessage('chat-message')
  async handleChatMessage(client: Socket, payload: ChatMessage) {
    const user = await this.authService.verify(
      client?.handshake?.headers?.authorization || '',
    );

    if (!user) {
      client.disconnect();
      return;
    }
    // Ensure the agent configuration is set up
    await this.chatService.ensureAgentConfig(payload.agentId);

    // Process message through gRPC service
    const response = await firstValueFrom(await this.chatServicegRPC.processMessage({
      agent_id: payload.agentId,
      message: payload.message,
      session_id: payload.sessionId,
      user_id: user.id,
    }));

    // Save conversation to database
    await this.chatService.saveConversation(
      payload.sessionId,
      user.id,
      payload.agentId,
      payload.message,
      response
    );

    const channelId = this.userChannels[user.id];
    if (channelId) {
      this.server.to(channelId).emit('chat-response', {
        ...response,
        timestamp: new Date(),
      });
    }
  }
}
