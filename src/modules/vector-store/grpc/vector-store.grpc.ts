import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, Client, Transport, ClientProxyFactory } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { StoreConversationRequest, StoreConversationResponse, VectorStoreServiceClient } from './interfaces/vector-store.interface';

@Injectable()
export class VectorStoreServicegRPC implements OnModuleInit {
  private client: ClientGrpc;
  private vectorStoreServiceClient: VectorStoreServiceClient;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const grpcHost = this.configService.get<string>('GRPC_HOST', 'localhost');
    const grpcPort = this.configService.get<string>('GRPC_PORT', '50051');
    const grpcUrl = `${grpcHost}:${grpcPort}`;

    this.client = ClientProxyFactory.create({
      transport: Transport.GRPC,
      options: {
        package: 'services.vector_store',
        protoPath: 'src/proto/services/vector_store/vector_store_service.proto',
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

    this.vectorStoreServiceClient = this.client.getService<VectorStoreServiceClient>('VectorStoreService');
  }

  storeConversation(request: StoreConversationRequest): Observable<StoreConversationResponse> {
    return this.vectorStoreServiceClient.storeConversation(request);
  }
}
