import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { setUnauthorizedHandler } from '../../services/apiClient';
import { authToken } from '../../services/authToken';
import { authApi } from './authApi';
import type { AuthUser, LoginInput } from './types';

type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

interface AuthContextValue {
  status: AuthStatus;
  user?: AuthUser;
  login: (input: LoginInput) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>();
  const [status, setStatus] = useState<AuthStatus>(() => authToken.get() ? 'loading' : 'anonymous');

  const logout = useCallback(() => {
    authToken.clear();
    setUser(undefined);
    setStatus('anonymous');
  }, []);

  // Restore the session on reload: a stored token is only trusted once the server confirms it.
  useEffect(() => {
    setUnauthorizedHandler(logout);
    if (authToken.get()) {
      authApi.me()
        .then((currentUser) => { setUser(currentUser); setStatus('authenticated'); })
        .catch(logout);
    }
    return () => setUnauthorizedHandler(undefined);
  }, [logout]);

  const login = useCallback(async (input: LoginInput) => {
    const result = await authApi.login(input);
    authToken.set(result.token);
    setUser(result.user);
    setStatus('authenticated');
    return result.user;
  }, []);

  const value = useMemo(() => ({ status, user, login, logout }), [status, user, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>.');
  return context;
}
