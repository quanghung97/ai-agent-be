import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './grpc/chat.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
