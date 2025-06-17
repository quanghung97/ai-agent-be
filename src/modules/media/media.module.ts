import { Global, Module } from '@nestjs/common';
import { MediaService } from './services/media.service';
import { MediaController } from './media.controller';
import { MinioModule } from 'nestjs-minio-client';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/modules/user/user.module';
import { Media } from './entities/media.entity';
import { MediaImageable } from './entities/mediaImageable.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Media, MediaImageable]),
    UserModule,
    MinioModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          endPoint: configService.get('MINIO_ENDPOINT') as string,
          port: +configService.get('MINIO_PORT'),
          useSSL: configService.get('MINIO_USE_SSL') === 'true' ? true : false,
          accessKey: configService.get('MINIO_ACCESS_KEY') as string,
          secretKey: configService.get('MINIO_SECRET_KEY') as string,
        };
      },
    }),
  ],
  exports: [MediaService],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
