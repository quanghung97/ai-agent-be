import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AgentsService } from './services/agents.service';
import { CreateAgentDto, UpdateAgentDto } from './dto/agent.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('AI Agents')
@Controller('agents')
@UseGuards(AuthGuard('jwt'))
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new AI agent' })
  create(@Body() createAgentDto: CreateAgentDto, @Req() req: Request) {
    const userId = req.user?.['id'];
    return this.agentsService.create(createAgentDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all AI agents' })
  findAll() {
    return this.agentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an AI agent by ID' })
  findOne(@Param('id') id: string) {
    return this.agentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an AI agent' })
  update(
    @Param('id') id: string,
    @Body() updateAgentDto: UpdateAgentDto,
    @Req() req: Request,
  ) {
    const userId = req.user?.['id'];
    return this.agentsService.update(id, updateAgentDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an AI agent' })
  remove(@Param('id') id: string) {
    return this.agentsService.remove(id);
  }
}
