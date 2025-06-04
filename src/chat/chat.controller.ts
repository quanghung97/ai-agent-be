import { Controller, Post, Sse, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Observable, Subject, firstValueFrom } from 'rxjs';
import { ChatService } from './grpc/chat.service';
import { ChatRequestDto, ChatResponseDto } from './dto/chat.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

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
    const response = await firstValueFrom(
      this.chatService.processMessage(chatRequest),
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
  streamChat(): Observable<any> {
    const subject = new Subject<any>();
    const requests = new Subject<any>();

    const stream = this.chatService.streamChat(requests);

    stream.subscribe({
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
