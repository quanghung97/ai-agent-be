import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatServicegRPC } from './grpc/chat.grpc';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from 'src/modules/agent/entities/agent.entity';
import { ChatService } from './services/chat.service';

@Module({
  imports: [TypeOrmModule.forFeature([Agent])],
  controllers: [ChatController],
  providers: [ChatServicegRPC, ChatService],
  exports: [ChatServicegRPC, ChatService],
})
export class ChatModule {}
