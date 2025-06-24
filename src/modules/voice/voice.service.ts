import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Voice } from './entities/voice.entity';
import { CreateVoiceDto, UpdateVoiceDto } from './dto/voice.dto';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import { voicePaginateConfig } from './filter/voice.filter';

@Injectable()
export class VoiceService {
  constructor(
    @InjectRepository(Voice)
    private voiceRepository: Repository<Voice>,
  ) {}

  create(dto: CreateVoiceDto) {
    const voice = this.voiceRepository.create(dto);
    return this.voiceRepository.save(voice);
  }

  paginate(query: PaginateQuery) {
    const qb = this.voiceRepository.createQueryBuilder('voice');

    // Manually handle languages filter for array
    if (query.filter?.languages) {
      if (Array.isArray(query.filter.languages)) {
        qb.andWhere('voice.languages && :langs', {
          langs: query.filter.languages,
        });
      } else {
        qb.andWhere(':lang = ANY(voice.languages)', {
          lang: query.filter.languages,
        });
      }
    }
    return paginate(query, qb, voicePaginateConfig);
  }

  findAll() {
    return this.voiceRepository.find();
  }

  findOne(id: string) {
    return this.voiceRepository.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateVoiceDto) {
    const voice = await this.voiceRepository.findOne({ where: { id } });
    if (!voice) throw new NotFoundException('Voice not found');
    Object.assign(voice, dto);
    return this.voiceRepository.save(voice);
  }

  async remove(id: string) {
    const voice = await this.voiceRepository.findOne({ where: { id } });
    if (!voice) throw new NotFoundException('Voice not found');
    await this.voiceRepository.remove(voice);
    return { deleted: true };
  }
}
