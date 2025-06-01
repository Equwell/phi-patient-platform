import type { User } from '~features/authentication/types/user.type';
import type { ApiResponse } from '~core/types/api-response.types';
import { JwtToken } from './jwt-token.type';

export type LoginResponseData = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type LoginResponse = ApiResponse<JwtToken>;
