import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
// import { Injectable } from '@nestjs/common';

// Sharded Pub/Sub was introduced in Redis 7.0 in order to help scaling the usage of Pub/Sub in cluster mode.
// https://www.npmjs.com/package/@socket.io/redis-adapter
export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  private readonly configService: ConfigService;

  async connectToRedis(
    host: string | undefined,
    port: number | undefined,
    password: string | undefined,
  ): Promise<void> {
    // const pubClient = createClient({
    //   socket: {
    //     host: this.configService.get('REDIS_HOST'),
    //     port: this.configService.get('REDIS_PORT'),
    //   },
    //   password: this.configService.get('REDIS_PASSWORD'),
    // });

    const pubClient = createClient({
      socket: {
        host,
        port,
      },
      password,
    });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
