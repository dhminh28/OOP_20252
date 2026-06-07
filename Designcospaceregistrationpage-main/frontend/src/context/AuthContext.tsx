import { createContext, useMemo, useState, type ReactNode } from 'react';
import type { User } from '../types/user';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  setSession: (user: User, token: string) => void;
  updateUser: (user: User) => void;
  clearSession: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as User) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      setSession(nextUser, nextToken) {
        setUser(nextUser);
        setToken(nextToken);
        localStorage.setItem('user', JSON.stringify(nextUser));
        localStorage.setItem('token', nextToken);
      },
      updateUser(nextUser) {
        setUser(nextUser);
        localStorage.setItem('user', JSON.stringify(nextUser));
      },
      clearSession() {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      },
    }),
    [user, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
