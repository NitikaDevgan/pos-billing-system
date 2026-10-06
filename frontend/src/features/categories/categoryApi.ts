import { apiClient, type ApiResponse } from '../../services/apiClient';
import type { Category, CategoryInput } from './types';

export const categoryApi = {
  list: async () => (await apiClient.get<ApiResponse<Category[]>>('/categories')).data.data,
  create: async (input: CategoryInput) => (await apiClient.post<ApiResponse<Category>>('/categories', input)).data.data,
  update: async (id: string, input: CategoryInput) => (await apiClient.put<ApiResponse<Category>>(`/categories/${id}`, input)).data.data,
  remove: async (id: string) => { await apiClient.delete(`/categories/${id}`); },
};
