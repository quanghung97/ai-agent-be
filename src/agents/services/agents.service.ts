import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { Agent } from '../entities/agent.entity';
import { CreateAgentDto, UpdateAgentDto } from '../dto/agent.dto';

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(Agent)
    private agentsRepository: Repository<Agent>,
  ) {}

  async create(createAgentDto: CreateAgentDto, userId: string): Promise<Agent> {
    const agent = this.agentsRepository.create({
      ...createAgentDto,
      createdBy: userId,
      updatedBy: userId,
    });
    return await this.agentsRepository.save(agent);
  }

  async update(id: string, updateAgentDto: UpdateAgentDto, userId: string): Promise<Agent> {
    const agent = await this.findOne(id);
    Object.assign(agent, {
      ...updateAgentDto,
      updatedBy: userId,
    });
    return await this.agentsRepository.save(agent);
  }

  async findAll(): Promise<Agent[]> {
    return await this.agentsRepository.find();
  }

  async findOne(id: string): Promise<Agent> {
    const agent = await this.agentsRepository.findOne({ where: { id: Equal(id) } });
    if (!agent) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }
    return agent;
  }

  async remove(id: string): Promise<void> {
    const result = await this.agentsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }
  }
}
