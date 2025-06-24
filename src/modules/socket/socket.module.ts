import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { AuthModule } from '@auth/auth.module';
import { ChatModule } from '@chat/chat.module';
// import { RedisIoAdapter } from './adapter/redis-io.adapter';

@Module({
  imports: [AuthModule, ChatModule],
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}
