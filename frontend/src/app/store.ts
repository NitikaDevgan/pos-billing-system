// Keep state ownership centralized; add Redux Toolkit only when a feature needs shared state.
export type AppState = Record<string, never>;
export const initialAppState: AppState = {};
