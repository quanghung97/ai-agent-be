import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, Client, Transport, ClientProxyFactory } from '@nestjs/microservices';
import { join } from 'path';
import { Observable } from 'rxjs';
import {  } from './interfaces/chats.interface';
import { ChatRequest, ChatResponse, ChatServiceClient } from './interfaces/chats.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChatServicegRPC implements OnModuleInit {
  private client: ClientGrpc;
  private chatServiceClient: ChatServiceClient;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const grpcHost = this.configService.get<string>('GRPC_HOST', 'localhost');
    const grpcPort = this.configService.get<string>('GRPC_PORT', '50051');
    const grpcUrl = `${grpcHost}:${grpcPort}`;

    this.client = ClientProxyFactory.create({
      transport: Transport.GRPC,
      options: {
        package: 'services.chats',
        protoPath: 'src/ai-agent-proto/services/chats/chat_service.proto',
        url: grpcUrl,
        loader: {
          keepCase: true,
          longs: String,
          enums: String,
          defaults: true,
          oneofs: true,
        },
      },
    }) as ClientGrpc;

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
