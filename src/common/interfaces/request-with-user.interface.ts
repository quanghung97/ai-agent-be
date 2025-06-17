import { Request as ExpressRequest } from 'express';
import { UserToken } from './user-token.interface';

export interface RequestWithUser extends ExpressRequest {
  user: UserToken;
}
