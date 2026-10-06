import axios from 'axios';
export const apiClient = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api/v1', headers: { 'Content-Type': 'application/json' } });

/** Envelope returned by every backend endpoint: `{ success, data }`. */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) return error.response?.data?.message ?? error.message;
  return error instanceof Error ? error.message : 'Something went wrong.';
}
