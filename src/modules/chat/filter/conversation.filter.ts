import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { Column } from 'nestjs-paginate/lib/helper';
import { Conversation } from '../entities/conversation.entity';

export class ConversationPaginateDto {
  static getListProperties: Column<Conversation>[] = [
    'id',
    'sessionId',
    'userId',
    'agentId',
    'message',
    'response',
    'metadata',
    'audioUrl',
    'createdAt',
    'updatedAt',
  ];
}

export const conversationPaginateConfig: PaginateConfig<Conversation> = {
    loadEagerRelations: true,
    select: ConversationPaginateDto.getListProperties,
    relations: {
      user: true,
      agent: true,
    },
    sortableColumns: ['createdAt'],
    defaultSortBy: [['createdAt', 'DESC']],
    searchableColumns: ['message', 'response'],
    defaultLimit: 50,
    maxLimit: 100,
    filterableColumns: {
        sessionId: [FilterOperator.EQ],
        userId: [FilterOperator.EQ],
        agentId: [FilterOperator.EQ],
        createdAt: [FilterOperator.BTW, FilterOperator.GTE, FilterOperator.LTE],
    },
};
