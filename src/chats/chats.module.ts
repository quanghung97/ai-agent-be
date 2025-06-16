import { Module } from '@nestjs/common';
import { ChatController } from './chats.controller';
import { ChatsServicegRPC } from './grpc/chats.grpc';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from 'src/agents/entities/agent.entity';
import { ChatsService } from './services/chats.service';

@Module({
  imports: [TypeOrmModule.forFeature([Agent])],
  controllers: [ChatController],
  providers: [ChatsServicegRPC, ChatsService],
  exports: [ChatsServicegRPC, ChatsService],
})
export class ChatsModule {}
