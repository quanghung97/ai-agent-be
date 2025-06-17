import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Agent } from 'src/modules/agent/entities/agent.entity';
import { Equal, Repository } from 'typeorm';

@Injectable()
export class ChatService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @InjectRepository(Agent)
            private agentsRepository: Repository<Agent>,
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
}
