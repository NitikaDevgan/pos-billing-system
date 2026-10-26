import { apiClient, type ApiResponse } from '../../services/apiClient';
import type { AuthUser, LoginInput, LoginResult } from './types';

export const authApi = {
  login: async (input: LoginInput) => (await apiClient.post<ApiResponse<LoginResult>>('/auth/login', input)).data.data,
  me: async () => (await apiClient.get<ApiResponse<AuthUser>>('/auth/me')).data.data,
};
