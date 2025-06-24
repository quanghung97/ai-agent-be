import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { RedisIoAdapter } from './modules/socket/adapter/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // CORS configuration
  app.enableCors();

  // Create RedisIoAdapter for SocketIO
  // more info: https://www.npmjs.com/package/@socket.io/redis-adapter
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis(
    configService.get<string>('REDIS_HOST'),
    configService.get<number>('REDIS_PORT'),
    configService.get<string>('REDIS_PASSWORD'),
  );
  app.useWebSocketAdapter(redisIoAdapter);

  const apiPrefix = configService.get<string>('API_PREFIX');
  const apiVersion = configService.get<string>('API_VERSION', '1.0');
  const port = configService.get<number>('PORT') ?? 3000;
  const swaggerPath = configService.get<string>('SWAGGER_PATH') ?? 'api-docs';

  // Set global prefix for all routes
  const globalPrefix = `${apiPrefix}/${apiVersion}`;
  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder()
    .setTitle('AI Agent API')
    .setDescription('The AI Agent API documentation')
    .setVersion(apiVersion)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerPath, app, document);

  await app.listen(port || 3000, '0.0.0.0');
  console.log(
    `Application is running on: http://0.0.0.0:${port}/${globalPrefix}`,
  );
  console.log(
    `Swagger UI is available at: http://0.0.0.0:${port}/${swaggerPath}`,
  );
}
bootstrap().catch(error => {
  console.error('Application failed to start:', error);
  process.exit(1);
});
