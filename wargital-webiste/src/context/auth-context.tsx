"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { apiClient } from '@/lib/api-client';

type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  isUserLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = 'wargital_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  const saveToken = (token: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  };

  const clearToken = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
  };

  const refreshUser = useCallback(async () => {
    setIsUserLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
      if (!token) {
        setUser(null);
        return;
      }
      const { data } = await apiClient.get<{ user: AuthUser }>('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data.user);
    } catch {
      setUser(null);
      clearToken();
    } finally {
      setIsUserLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    setIsUserLoading(true);
    try {
      const { data } = await apiClient.post<{ user: AuthUser; token: string }>('/auth/login', { email, password });
      saveToken(data.token);
      setUser(data.user);
    } finally {
      setIsUserLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    setIsUserLoading(true);
    try {
      const { data } = await apiClient.post<{ user: AuthUser; token: string }>('/auth/register', { email, password });
      saveToken(data.token);
      setUser(data.user);
    } finally {
      setIsUserLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isUserLoading,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, isUserLoading, login, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return ctx;
}

