import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Agent } from 'src/modules/agent/entities/agent.entity';
import { Equal, Repository } from 'typeorm';
import { Conversation } from '../entities/conversation.entity';
import { ChatResponse } from '../grpc/interfaces/chats.interface';
import { FilterOperator, Paginate, PaginateConfig, PaginateQuery, paginate } from 'nestjs-paginate';
import { conversationPaginateConfig } from '../filter/conversation.filter';

@Injectable()
export class ChatService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @InjectRepository(Agent)
        private agentsRepository: Repository<Agent>,
        @InjectRepository(Conversation)
        private conversationRepository: Repository<Conversation>,
    ) {}

    async ensureAgentConfig(agentId: string): Promise<void> {
        const existingConfig = await this.cacheManager.get(`agent:${agentId}:config`);
        if (!existingConfig) {
            // Check if agent exists in the database
            const agent = await this.agentsRepository.findOne({ where: { id: Equal(agentId) } });
            if (!agent) {
                throw new NotFoundException(`Agent with ID ${agentId} not found`);
            }

            // Create default agent config, using snake_case for keys code style in python core grpc readability
            const defaultConfig = {
                name: agent.name,
                gender: agent.gender,
                age: agent.age,
                personality: agent.personality,
                interests: agent.interests,
                communication_style: agent.communicationStyle,
                language: agent.language,
                artistic_style: agent.artisticStyle,
                appearance: agent.appearance,
                background: agent.background,
                behavioral_settings: agent.behavioralSettings,
                world_context: agent.worldContext,
            };

            await this.cacheManager.set(`agent:${agentId}:config`, defaultConfig, 300000); // Cache for 5 minutes
        }
    }

    async saveConversation(
        sessionId: string,
        userId: string,
        agentId: string,
        message: string,
        response: ChatResponse,
    ): Promise<Conversation> {
        const audioUrl = await this.saveAudioContent(response.audio_content);

        const conversation = this.conversationRepository.create({
            sessionId,
            userId,
            agentId,
            message,
            response: response.response,
            metadata: {
                intent: response.metadata.intent,
                turn_count: response.metadata.turn_count,
                additional_data: response.metadata.additional_data,
            },
            audioUrl: audioUrl
        });

        return this.conversationRepository.save(conversation);
    }

    async getConversationHistory(query: PaginateQuery, userId: string) {
        const queryBuilder = this.conversationRepository
            .createQueryBuilder('conversation')
            .where('conversation.user_id = :userId', { userId });

        return paginate(query, queryBuilder, conversationPaginateConfig);
    }

    private async saveAudioContent(audioContent: Uint8Array | undefined): Promise<string> {
        // Implement your audio storage logic here (e.g., using MinIO/S3)
        // Return the URL of the stored audio file
        return '';
    }
}
