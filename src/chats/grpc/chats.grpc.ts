import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, Client, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Observable } from 'rxjs';
import {  } from './interfaces/chats.interface';
import { ChatRequest, ChatResponse, ChatServiceClient } from './interfaces/chats.interface';

@Injectable()
export class ChatsServicegRPC implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'services.chats',
      protoPath: join(
        __dirname,
        '../../../../ai-agent-proto/services/chats/chat_service.proto',
      ),
      url: 'localhost:50051',
      loader: {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      },
    },
  })
  private client: ClientGrpc;
  private chatServiceClient: ChatServiceClient;

  onModuleInit() {
    this.chatServiceClient =
      this.client.getService<ChatServiceClient>('ChatService');
  }

  async processMessage(request: ChatRequest): Promise<Observable<ChatResponse>> {
    // await this.ensureAgentConfig(request.agent_id);
    return this.chatServiceClient.processMessage(request);
  }

  async streamChat(requests: Observable<ChatRequest>): Promise<Observable<ChatResponse>> {
    return this.chatServiceClient.streamChat(requests);
  }
}
