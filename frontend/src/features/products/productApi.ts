import { apiClient, type ApiResponse } from '../../services/apiClient';
import type { Product, ProductInput } from './types';

export const productApi = {
  list: async () => (await apiClient.get<ApiResponse<Product[]>>('/products')).data.data,
  create: async (input: ProductInput) => (await apiClient.post<ApiResponse<Product>>('/products', input)).data.data,
  update: async (id: string, input: ProductInput) => (await apiClient.put<ApiResponse<Product>>(`/products/${id}`, input)).data.data,
  remove: async (id: string) => { await apiClient.delete(`/products/${id}`); },
};
