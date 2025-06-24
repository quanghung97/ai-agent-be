import { Controller, Post, Sse, Body, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { Observable, Subject, firstValueFrom } from 'rxjs';
import { ChatServicegRPC } from './grpc/chat.grpc';
import { ChatRequestDto, ChatResponseDto } from './dto/chat.dto';
import { ChatService } from './services/chat.service';
import { Paginate, PaginateQuery, ApiOkPaginatedResponse, ApiPaginationQuery } from 'nestjs-paginate';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from '@common/interfaces/request-with-user.interface';
import { conversationPaginateConfig, ConversationPaginateDto } from './filter/conversation.filter';
import { VectorStoreServicegRPC } from '../vector-store/grpc/vector-store.grpc';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('chats')
export class ChatController {
  constructor(
    private readonly chatServicegRPC: ChatServicegRPC,
    private readonly vectorStoregRPC: VectorStoreServicegRPC,
    private readonly chatService: ChatService
  ) {}

  @Get('history')
  @ApiOperation({ summary: 'Get paginated chat history' })
  @ApiPaginationQuery(conversationPaginateConfig)
  @ApiOkPaginatedResponse(ConversationPaginateDto, conversationPaginateConfig)
  @ApiResponse({
    status: 200,
    description: 'Returns paginated chat history',
    type: ApiOkPaginatedResponse
  })
  async getHistory(
    @Paginate() query: PaginateQuery,
    @Req() req: RequestWithUser,
  ) {
    return this.chatService.getConversationHistory(query, req.user.id);
  }

  @Post('message')
  @ApiOperation({ summary: 'Send a single chat message' })
  @ApiBody({ type: ChatRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Message processed successfully',
    type: ChatResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async sendMessage(
    @Body() chatRequest: ChatRequestDto,
  ): Promise<ChatResponseDto> {
    // TODO: transactions + error handling
    // Ensure the agent configuration is set up
    await this.chatService.ensureAgentConfig(chatRequest.agent_id);

    // Get recent conversations
    const recentConversations = await this.chatService.getRecentConversations(
      chatRequest.user_id,
      chatRequest.agent_id
    );

    // Format as array of objects for JSON.stringify
    const conversationHistory = recentConversations.map(conv => ({
      message: conv.message,
      response: conv.response,
      timestamp: conv.createdAt.toISOString()
    }));

    // Prepare request for gRPC
    const enhancedRequest = {
      user_id: chatRequest.user_id,
      message: chatRequest.message,
      session_id: chatRequest.session_id,
      agent_id: chatRequest.agent_id,
      recent_history: JSON.stringify(conversationHistory),
      tts_settings: chatRequest.tts_settings
    };

    const response = await firstValueFrom(
      await this.chatServicegRPC.processMessage(enhancedRequest),
    );

    // TODO: move save conversation to a job or queue
    // Save the new conversation
    await this.chatService.saveConversation(
      chatRequest.session_id,
      chatRequest.user_id,
      chatRequest.agent_id,
      chatRequest.message,
      response
    );

    // Store in vector DB (metadata must match proto: only timestamp)
    await firstValueFrom(
      this.vectorStoregRPC.storeConversation({
        user_id: chatRequest.user_id,
        agent_id: chatRequest.agent_id,
        session_id: chatRequest.session_id,
        message: chatRequest.message,
        response: response.response,
        metadata: response.metadata // should be { timestamp: ... }
      })
    );

    // TODO: storage for audio content

    return {
      ...response,
      audio_content: response.audio_content
        ? Buffer.from(response.audio_content).toString('base64')
        : undefined,
    };
  }

  @Sse('stream')
  @ApiOperation({ summary: 'Open a streaming chat connection' })
  @ApiResponse({
    status: 200,
    description: 'Stream established successfully',
    type: ChatResponseDto,
    isArray: true,
  })
  async streamChat(): Promise<Observable<any>> {
    const subject = new Subject<any>();
    const requests = new Subject<any>();

    const stream = this.chatServicegRPC.streamChat(requests);

    (await stream).subscribe({
      next: (response) => {
        // Convert audio content to base64 if present
        if (response.audio_content) {
          response = {
            ...response,
            // audio_content: Buffer.from(response.audio_content).toString(
            //   'base64',
            // ),
          };
          // TODO: storage for audio content
        }
        subject.next({ data: response });
      },
      error: (error) => subject.error(error),
      complete: () => subject.complete(),
    });

    return subject.asObservable();
  }
}
