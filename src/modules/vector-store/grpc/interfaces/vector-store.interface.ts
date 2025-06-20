import { Observable } from 'rxjs';

export interface StoreConversationRequest {
  user_id: string;
  agent_id: string;
  session_id: string;
  message: string;
  response: string;
  metadata: { timestamp: string };
}

export interface StoreConversationResponse {
  success: boolean;
  error?: string;
}

export interface VectorStoreServiceClient {
  storeConversation(request: StoreConversationRequest): Observable<StoreConversationResponse>;
}
