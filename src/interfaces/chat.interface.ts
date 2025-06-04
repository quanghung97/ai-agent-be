import { Observable } from 'rxjs';

export interface VoiceSettings {
  stability: number;
  similarityBoost: number;
  style: number;
  useSpeakerBoost: boolean;
  speed: number;
}

export interface TTSSettings {
  enableTts: boolean;
  voiceId: string;
  voiceSettings: VoiceSettings;
}

export interface ChatRequest {
  userId: string;
  message: string;
  sessionId: string;
  context?: { [key: string]: string };
  ttsSettings?: TTSSettings;
}

export interface ChatResponse {
  response: string;
  sessionId: string;
  userId: string;
  type: string;
  metadata?: MetadataMessage;
  audioContent?: Uint8Array;
}

export interface MetadataMessage {
  intent: string;
  turnCount: number;
  additionalData: { [key: string]: string };
}

export interface ChatService {
  processMessage(request: ChatRequest): Promise<ChatResponse>;
  streamChat(request: Observable<ChatRequest>): Observable<ChatResponse>;
}
