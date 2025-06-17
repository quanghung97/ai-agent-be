import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  SetMetadata,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
} from '@nestjs/common';
import { MediaService } from './services/media.service';
import { CreateMediaDto, UpdateMediaDto } from './dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiExcludeController,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';

@ApiExcludeController()
@ApiTags('MediaManagement')
@ApiBearerAuth()
@SetMetadata('moduleName', 'MediaModule')
@UseGuards(AuthGuard('jwt'))
@Controller('medias')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @ApiOperation({ summary: 'Create a new media' })
  @Post()
  create(@Body() createMediaDto: CreateMediaDto) {
    return this.mediaService.create(createMediaDto);
  }

  @ApiOperation({ summary: 'Get all medias' })
  @Get()
  findAll(@Request() request: Request) {
    return this.mediaService.findAll(request);
  }

  @ApiOperation({ summary: 'Get a specific media' })
  @Get(':id')
  findOne(@Param('id') id: string, @Request() request: RequestWithUser) {
    return this.mediaService.findOne(request.user, id);
  }

  @ApiOperation({ summary: 'Update a specific media' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMediaDto: UpdateMediaDto,
    @Request() request: RequestWithUser,
  ) {
    return this.mediaService.update(id, request.user, updateMediaDto);
  }

  @ApiOperation({ summary: 'Delete a specific media' })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() request: RequestWithUser) {
    return this.mediaService.remove(request.user, id);
  }

  // TODO: Validate upload file (size, type...)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload media file' })
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  upload(
    @Request() request: RequestWithUser,
    @UploadedFile('file') file: Express.Multer.File,
  ) {
    return this.mediaService.uploadFile(request, file);
  }
}
