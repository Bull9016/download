// This file is part of a previous Firebase Auth setup and is no longer used
// by the current email/password session-based authentication system.
// It can be safely removed or kept for future reference if Firebase integration is revisited.
// The active authentication hook is `use-session.tsx`.
"use client";

import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';

export type UserRole = "admin" | "manager" | "client" | "contractor";

interface AuthContextType {
  user: any | null; // Changed to any to avoid Firebase User type dependency
  role: UserRole | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
});


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Mocking a non-functional provider since it's not in use
  const value = { user: null, role: null, loading: false };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
