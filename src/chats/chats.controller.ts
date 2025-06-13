import { Controller, Post, Sse, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Observable, Subject, firstValueFrom } from 'rxjs';
import { ChatsServicegRPC } from './grpc/chats.grpc';
import { ChatRequestDto, ChatResponseDto } from './dto/chat.dto';
import { ChatsService } from './services/chats.service';

@ApiTags('Chat')
@Controller('chats')
export class ChatController {
  constructor(private readonly chatsServicegRPC: ChatsServicegRPC,
  private readonly chatsService: ChatsService) {}

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
    // Ensure the agent configuration is set up
    await this.chatsService.ensureAgentConfig(chatRequest.agent_id);

    const response = await firstValueFrom(
      await this.chatsServicegRPC.processMessage(chatRequest),
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

    const stream = this.chatsServicegRPC.streamChat(requests);

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
