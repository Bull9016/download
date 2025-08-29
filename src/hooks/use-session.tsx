
"use client";

import { useState, useEffect, createContext, useContext, type ReactNode, useCallback } from 'react';
import type { IUser } from '@/models/User';

interface SessionContextType {
  user: IUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<IUser>;
  logout: () => void;
  // setUser can be used to manually update user data if needed
  setUser: (user: IUser | null) => void; 
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for session on initial load from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user-session');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
        console.error("Failed to parse user session from localStorage", error);
        localStorage.removeItem('user-session');
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    const loggedInUser: IUser = data;
    setUser(loggedInUser);
    localStorage.setItem('user-session', JSON.stringify(loggedInUser));
    return loggedInUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user-session');
  }, []);

  const value = { user, loading, login, logout, setUser };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
