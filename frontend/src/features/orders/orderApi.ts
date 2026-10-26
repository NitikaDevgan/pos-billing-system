import { apiClient, type ApiResponse } from '../../services/apiClient';
import type { Order, OrderInput } from './types';

export const orderApi = {
  create: async (input: OrderInput) => (await apiClient.post<ApiResponse<Order>>('/orders', input)).data.data,
  get: async (id: string) => (await apiClient.get<ApiResponse<Order>>(`/orders/${id}`)).data.data,
};
