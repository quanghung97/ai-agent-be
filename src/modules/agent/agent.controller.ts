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
import { AgentService } from './services/agent.service';
import { CreateAgentDto, UpdateAgentDto } from './dto/agent.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from '@common/interfaces/request-with-user.interface';

@ApiTags('AI Agents')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('agents')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new AI agent' })
  create(@Body() createAgentDto: CreateAgentDto, @Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.agentService.create(createAgentDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all AI agents' })
  findAll() {
    return this.agentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an AI agent by ID' })
  findOne(@Param('id') id: string) {
    return this.agentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an AI agent' })
  update(
    @Param('id') id: string,
    @Body() updateAgentDto: UpdateAgentDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    return this.agentService.update(id, updateAgentDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an AI agent' })
  remove(@Param('id') id: string) {
    return this.agentService.remove(id);
  }
}
