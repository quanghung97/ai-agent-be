import { Observable } from 'rxjs';

export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
  speed: number;
}

export interface TTSSettings {
  enable_tts: boolean;
  voice_id: string;
  voice_settings: VoiceSettings;
}

export interface ChatRequest {
  user_id: string;
  message: string;
  session_id: string;
  agent_id: string;
  context?: { [key: string]: string };
  tts_settings?: TTSSettings;
}

export interface ChatResponse {
  response: string;
  session_id: string;
  user_id: string;
  type: string;
  metadata: {
    intent: string;
    turn_count: number;
    additional_data: { [key: string]: string };
  };
  audio_content?: Uint8Array;
}

export interface ChatServiceClient {
  processMessage(request: ChatRequest): Observable<ChatResponse>;
  streamChat(request: Observable<ChatRequest>): Observable<ChatResponse>;
}
