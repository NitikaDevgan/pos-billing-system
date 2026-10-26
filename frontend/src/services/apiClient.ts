import axios from 'axios';
import { authToken } from './authToken';

export const apiClient = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api/v1', headers: { 'Content-Type': 'application/json' } });

apiClient.interceptors.request.use((config) => {
  const token = authToken.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let onUnauthorized: (() => void) | undefined;
/** Lets the auth layer react (log out) when the server rejects the current token. */
export function setUnauthorizedHandler(handler: (() => void) | undefined) { onUnauthorized = handler; }

apiClient.interceptors.response.use(undefined, (error) => {
  if (axios.isAxiosError(error) && error.response?.status === 401 && authToken.get()) {
    authToken.clear();
    onUnauthorized?.();
  }
  return Promise.reject(error);
});

/** Envelope returned by every backend endpoint: `{ success, data }`. */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return `Can't reach the server at ${apiClient.defaults.baseURL}. Is the backend running?`;
    return error.response.data?.message ?? error.message;
  }
  return error instanceof Error ? error.message : 'Something went wrong.';
}
