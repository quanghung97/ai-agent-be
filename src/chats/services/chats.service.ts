import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Agent } from 'src/agents/entities/agent.entity';
import { Equal, Repository } from 'typeorm';

@Injectable()
export class ChatsService {
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

            // Create default agent config
            const defaultConfig = {
                name: agent.name,
                gender: agent.gender,
                age: agent.age,
                personality: agent.personality,
                interests: agent.interests,
                communication_style: agent.communication_style,
                language: agent.language,
                artistic_style: agent.artistic_style,
                appearance: agent.appearance,
                background: agent.background,
                behavioral_settings: agent.behavioral_settings,
                world_context: agent.world_context,
            };

            await this.cacheManager.set(`agent:${agentId}:config`, defaultConfig, 300000); // Cache for 5 minutes
        }
    }
}
