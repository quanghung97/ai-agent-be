import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const apiPrefix = configService.get<string>('API_PREFIX');
  const apiVersion = configService.get<string>('API_VERSION', '1.0');
  const port = configService.get<number>('PORT') ?? 3000;
  const swaggerPath = configService.get<string>('SWAGGER_PATH') ?? 'api-docs';

  // Set global prefix for all routes
  const globalPrefix = `${apiPrefix}/${apiVersion}`;
  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder()
    .setTitle('Chat API')
    .setDescription('The Chat API description')
    .setVersion(apiVersion)
    .addTag('chat')
    .addServer(`/${globalPrefix}`) // Add server URL prefix
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerPath, app, document);

  await app.listen(port);
  console.log(
    `Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}
bootstrap().catch((error) => {
  console.error('Application failed to start:', error);
  process.exit(1);
});
