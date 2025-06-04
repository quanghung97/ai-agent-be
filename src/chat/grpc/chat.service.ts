import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, Client, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Observable } from 'rxjs';

interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
  speed: number;
}

interface TTSSettings {
  enable_tts: boolean;
  voice_id: string;
  voice_settings: VoiceSettings;
}

interface ChatRequest {
  user_id: string;
  message: string;
  session_id: string;
  context?: { [key: string]: string };
  tts_settings?: TTSSettings;
}

interface ChatResponse {
  response: string;
  session_id: string;
  user_id: string;
  type: string;
  metadata: {
    intent: string;
    turn_count: number;
    additional_data: { [key: string]: string };
  };
  audio_content?: Uint8Array;
}

interface ChatServiceClient {
  processMessage(request: ChatRequest): Observable<ChatResponse>;
  streamChat(request: Observable<ChatRequest>): Observable<ChatResponse>;
}

@Injectable()
export class ChatService implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'services.chats',
      protoPath: join(
        __dirname,
        '../../../../ai-agent-proto/services/chats/chat_service.proto',
      ),
      url: 'localhost:50051', // Match your Python server port
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

  processMessage(request: ChatRequest): Observable<ChatResponse> {
    return this.chatServiceClient.processMessage(request);
  }

  streamChat(requests: Observable<ChatRequest>): Observable<ChatResponse> {
    return this.chatServiceClient.streamChat(requests);
  }
}
