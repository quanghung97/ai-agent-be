import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { Column } from 'nestjs-paginate/lib/helper';
import { Voice } from '../entities/voice.entity';

export class VoicePaginateDto {
  static getListProperties: Column<Voice>[] = [
    'id',
    'name',
    'languages',
    'shortDescription',
    'longDescription',
    'voiceId',
    'speed',
    'stability',
    'similarity',
    'createdAt',
    'updatedAt',
  ];
}

export const voicePaginateConfig: PaginateConfig<Voice> = {
  loadEagerRelations: false,
  select: VoicePaginateDto.getListProperties,
  sortableColumns: ['createdAt', 'name', 'voiceId'],
  defaultSortBy: [['createdAt', 'DESC']],
  searchableColumns: ['name', 'shortDescription', 'longDescription', 'voiceId'],
  defaultLimit: 20,
  maxLimit: 100,
  filterableColumns: {
    name: [FilterOperator.EQ, FilterOperator.ILIKE],
    voiceId: [FilterOperator.EQ],
    languages: [],
    speed: [FilterOperator.BTW, FilterOperator.GTE, FilterOperator.LTE],
    stability: [FilterOperator.BTW, FilterOperator.GTE, FilterOperator.LTE],
    similarity: [FilterOperator.BTW, FilterOperator.GTE, FilterOperator.LTE],
    createdAt: [FilterOperator.BTW, FilterOperator.GTE, FilterOperator.LTE],
  },
};
