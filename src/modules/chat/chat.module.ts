import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatServicegRPC } from './grpc/chat.grpc';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from 'src/modules/agent/entities/agent.entity';
import { ChatService } from './services/chat.service';
import { Conversation } from './entities/conversation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agent, Conversation])],
  controllers: [ChatController],
  providers: [ChatServicegRPC, ChatService],
  exports: [ChatServicegRPC, ChatService],
})
export class ChatModule {}
