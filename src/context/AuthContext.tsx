'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

type TokenPayload = {
  sub: string;
  userId: string;
  username: string;
  correo: string;
  roles: string[];
  iat: number;
  exp: number;
};

type AuthState = {
  isAuthenticated: boolean;
  loading: boolean;
  user: TokenPayload | null;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<TokenPayload | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/auth/me', { validateStatus: () => true });
      console.log('AuthContext refresh response:', res.data);
      if (res.status === 200) {
        // Soportar dos formatos: payload directo o {data: user}
        const payload = res.data?.data?.tokenPayload || res.data?.data || null;
        console.log('AuthContext payload:', payload);
        setUser(payload);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('AuthContext refresh error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    setUser(null);
  };

  useEffect(() => {
    refresh();
  }, []);

  // Escuchar cambios en el storage para actualizar el estado
  useEffect(() => {
    const handleStorageChange = () => {
      refresh();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, loading, user, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}


