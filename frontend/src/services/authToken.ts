const STORAGE_KEY = 'cafe-pos.auth-token';

export const authToken = {
  get: () => window.localStorage.getItem(STORAGE_KEY),
  set: (token: string) => window.localStorage.setItem(STORAGE_KEY, token),
  clear: () => window.localStorage.removeItem(STORAGE_KEY),
};
