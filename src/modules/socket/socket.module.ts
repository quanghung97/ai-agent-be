import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ChatsModule } from 'src/modules/chats/chats.module';
// import { RedisIoAdapter } from './adapter/redis-io.adapter';

@Module({
  imports: [AuthModule, ChatsModule],
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}
