import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { CreateMediaDto } from '../dto/create-media.dto';
import { UpdateMediaDto } from '../dto/update-media.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Media } from '../entities/media.entity';
import * as path from 'path';
import { MediaImageable } from '../entities/mediaImageable.entity';
import { AttachToEntityDto } from '../dto/attach-to-entity.dto';
// import { ConfigService } from '@nestjs/config';
import { DetachToEntityDto } from '../dto/detach-to-entity.dto';
import { FileType } from '../enums/file-type.enum';
import { FileSizeUnit } from '../enums/file-size-unit.enum';
import { UserToken } from '@common/interfaces/user-token.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    @InjectRepository(MediaImageable)
    private mediaImageableRepository: Repository<MediaImageable>,
    private readonly minioService: MinioService,
    private configService: ConfigService,
  ) {}

  async create(createMediaDto: CreateMediaDto) {
    const mediaDto = this.mediaRepository.create(createMediaDto);

    try {
      await this.mediaRepository.save(mediaDto);

      return mediaDto;
    } catch (e) {
      throw new BadRequestException(e.detail);
    }
  }

  async update(
    id: string,
    user: UserToken,
    updateMediaDto: UpdateMediaDto,
  ) {
    try {
      const media = await this.mediaRepository.findOneOrFail({
        where: { id },
      });

      const updateMedia = { ...media, ...updateMediaDto };

      // Create a new entity with the updated data
      const mediaDto = this.mediaRepository.create(updateMedia);
      mediaDto.updatedBy = user.id;

      return this.mediaRepository.save(mediaDto);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findAll(req: any) {
    const defaultSort: Record<string, string> = { created_at: 'DESC' }; // Updated to snake_case
    let take = Number(req.query.limit || 10);
    let page = Number(req.query.page || 1);

    if (page <= 0) {
      page = 1;
    }

    const skip = take * (page - 1);

    if (Number(take) > 100) {
      take = 100;
    }

    const { sortField, sortOrder } = req.query;
    const orderBy: Record<string, string> = {};

    if (sortField) {
      // Convert camelCase to snake_case for database queries
      const dbField = sortField.replace(
        /[A-Z]/g,
        letter => `_${letter.toLowerCase()}`,
      );
      orderBy[dbField] = sortOrder?.toLowerCase() ?? 'asc';
    }

    const [result, total] = await this.mediaRepository.findAndCount({
      order: Object.keys(orderBy).length ? orderBy : defaultSort,
      take,
      skip,
    });

    return {
      result,
      total,
    };
  }

  async findOne(user: UserToken, id: string): Promise<Media | null> {
    return this.mediaRepository.findOne({
      where: { id },
    });
  }

  async remove(user: UserToken, id: string): Promise<DeleteResult> {
    const media = await this.findOne(user, id);
    if (!media) {
      throw new NotFoundException();
    }
    const bucketName = this.configService.get<string>('MINIO_BUCKET');
    if (!bucketName) {
      throw new BadRequestException('Bucket name is required.');
    }

    await this.minioService.client.removeObject(bucketName, media.fileName);
    return this.mediaRepository.delete({ id });
  }

  async createBucketIfNotExists(bucketName: string) {
    const bucketExists =
      await this.minioService.client.bucketExists(bucketName);
    if (!bucketExists) {
      await this.minioService.client.makeBucket(bucketName);
      await this.minioService.client.setBucketPolicy(
        bucketName,
        JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Action: ['s3:GetObject'],
              Effect: 'Allow',
              Principal: {
                AWS: ['*'],
              },
              Resource: [`arn:aws:s3:::${bucketName}/*`],
              Sid: '',
            },
          ],
        }),
      );
    }
  }

  _isValidFileType(mimetype: string): boolean {
    return Object.values(FileType).some(type => type === mimetype);
  }

  async uploadFile(
    req: any,
    file: Express.Multer.File,
    bucket?: string,
  ) {
    if (!file) {
      throw new BadRequestException('File not found');
    }
    const sizeLimit = 15;
    const fileSizeUnit = 'MB';

    if (sizeLimit && fileSizeUnit) {
      let fileSizeLimitBytes: number;
      // Convert size limit to bytes based on unit
      switch (fileSizeUnit) {
        // case FileSizeUnit.KB:
        //   fileSizeLimitBytes = sizeLimit * 1024;
        //   break;
        case FileSizeUnit.MB:
          fileSizeLimitBytes = sizeLimit * 1024 * 1024;
          break;
        default:
          throw new BadRequestException('Invalid file size unit setting');
      }

      if (file.size > fileSizeLimitBytes) {
        throw new BadRequestException(
          `File size exceeds limit: ${sizeLimit} ${fileSizeUnit}`,
        );
      }

      if (!this._isValidFileType(file.mimetype)) {
        throw new BadRequestException(
          `The file you attempted to upload is not in the supported format. Please ensure that your file is in one of the following formats: ${Object.values(FileType).join(
            ', ',
          )}`,
        );
      }
    }

    const bucketName = bucket || process.env.MINIO_BUCKET;
    if (!bucketName) {
      throw new BadRequestException('Bucket name is required.');
    }
    await this.createBucketIfNotExists(bucketName);

    const fileName = file.originalname;
    const subFolder = Date.now();

    try {
      await this.minioService.client.putObject(
        bucketName,
        `${subFolder}/${fileName}`,
        file.buffer,
        file.size,
      );

      const mediaDto: CreateMediaDto = {
        fileName,
        filePath: `${bucketName}/${subFolder}/${fileName}`,
        fileUrl: `${process.env.MINIO_PUBLIC_ENDPOINT}/${bucketName}/${subFolder}/${fileName}`,
        fileSize: file.size,
        mimeType: file.mimetype,
        extension: path.extname(file.originalname),
        createdBy: req.user?.id,
        folderId: (req.body as any)?.folderId,
      };

      return this.create(mediaDto);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async uploadPublicFile(file: Express.Multer.File, bucket?: string) {
    if (!file) {
      throw new BadRequestException('File not found');
    }
    // const sizeLimit = this.configService.get<number>(
    //   'setting.otherSetting.maximumFileSize',
    // );

    // const fileSizeUnit = this.configService.get<string>(
    //   'setting.otherSetting.fileSizeUnit',
    // );

    // const allowedFileTypes = this.configService.get<string[]>(
    //   'setting.otherSetting.allowedFileTypes',
    // );

    // if (sizeLimit && fileSizeUnit && allowedFileTypes) {
    //   let fileSizeLimitBytes: number;
    //   // Convert size limit to bytes based on unit
    //   switch (fileSizeUnit) {
    //     case FileSizeUnit.KB:
    //       fileSizeLimitBytes = sizeLimit * 1024;
    //       break;
    //     case FileSizeUnit.MB:
    //       fileSizeLimitBytes = sizeLimit * 1024 * 1024;
    //       break;
    //     default:
    //       throw new BadRequestException('Invalid file size unit setting');
    //   }

    //   if (file.size > fileSizeLimitBytes) {
    //     throw new BadRequestException(
    //       `File size exceeds limit: ${sizeLimit} ${fileSizeUnit}`,
    //     );
    //   }

    //   if (
    //     !allowedFileTypes.includes(FileType.ALL) &&
    //     !allowedFileTypes.includes(file.mimetype)
    //   ) {
    //     throw new BadRequestException(
    //       `The file you attempted to upload is not in the supported format. Please ensure that your file is in one of the following formats: ${allowedFileTypes.join(
    //         ',',
    //       )}`,
    //     );
    //   }
    // }

    const bucketName = bucket || process.env.MINIO_BUCKET;

    if (!bucketName) {
      throw new BadRequestException('Bucket name is required.');
    }

    await this.createBucketIfNotExists(bucketName);

    const fileName = file.originalname;
    const subFolder = Date.now();

    try {
      await this.minioService.client.putObject(
        bucketName,
        `${subFolder}/${fileName}`,
        file.buffer,
        file.size,
      );

      const mediaDto: CreateMediaDto = {
        fileName,
        filePath: `${bucketName}/${subFolder}/${fileName}`,
        fileUrl: `${process.env.MINIO_PUBLIC_ENDPOINT}/${bucketName}/${subFolder}/${fileName}`,
        fileSize: file.size,
        mimeType: file.mimetype,
        extension: path.extname(file.originalname),
      };

      return this.create(mediaDto);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async attachToEntity(attachEntityDto: AttachToEntityDto) {
    const dto = this.mediaImageableRepository.create(attachEntityDto);
    return this.mediaImageableRepository.save(dto);
  }

  async detachToEntity(detachToEntityDto: DetachToEntityDto): Promise<any> {
    return this.mediaImageableRepository.delete(detachToEntityDto);
  }

  async getMedias(id: string, type: string, query: any) {
    const mediaImageable = await this.mediaImageableRepository.find({
      where: {
        ...query,
        imageableId: id,
        imageableType: type,
      },
      relations: { media: true },
    });

    return mediaImageable.map(m => ({
      zone: m.zone,
      order: m.order,
      mediaId: m.mediaId,
      isFolder: m.media.isFolder,
      fileName: m.media.fileName,
      fileUrl: m.media.fileUrl,
    }));
  }
}
