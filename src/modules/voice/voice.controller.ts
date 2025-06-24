import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { VoiceService } from './voice.service';
import { CreateVoiceDto, UpdateVoiceDto } from './dto/voice.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Paginate, PaginateQuery, ApiOkPaginatedResponse, ApiPaginationQuery } from 'nestjs-paginate';
import { voicePaginateConfig, VoicePaginateDto } from './filter/voice.filter';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Voice')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('voice')
export class VoiceController {
  constructor(private readonly voiceService: VoiceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new voice' })
  create(@Body() dto: CreateVoiceDto) {
    return this.voiceService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all voices (paginated)' })
  @ApiPaginationQuery(voicePaginateConfig)
  @ApiOkPaginatedResponse(VoicePaginateDto, voicePaginateConfig)
  findAll(@Paginate() query: PaginateQuery) {
    return this.voiceService.paginate(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a voice by ID' })
  findOne(@Param('id') id: string) {
    return this.voiceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a voice by ID' })
  update(@Param('id') id: string, @Body() dto: UpdateVoiceDto) {
    return this.voiceService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a voice by ID' })
  remove(@Param('id') id: string) {
    return this.voiceService.remove(id);
  }
}
