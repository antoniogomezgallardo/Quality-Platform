'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { tokenManager, isTokenExpired } from './token';
import type { User, LoginRequest, RegisterRequest } from '../api/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const initializeAuth = async () => {
    try {
      const token = tokenManager.getToken();
      if (!token || isTokenExpired(token)) {
        tokenManager.removeToken();
        setIsLoading(false);
        return;
      }

      const userData = await apiClient.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error initializing auth:', error);
      tokenManager.removeToken();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await apiClient.login(credentials);
      tokenManager.setToken(response.access_token);
      setUser(response.user);
      
      // Merge guest cart if user was shopping as guest
      const guestSessionId = sessionStorage.getItem('guest_session_id');
      if (guestSessionId) {
        try {
          await apiClient.mergeGuestCart(guestSessionId);
          sessionStorage.removeItem('guest_session_id');
        } catch (error) {
          console.warn('Failed to merge guest cart:', error);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      const response = await apiClient.register(userData);
      tokenManager.setToken(response.access_token);
      setUser(response.user);
      
      // Merge guest cart if user was shopping as guest
      const guestSessionId = sessionStorage.getItem('guest_session_id');
      if (guestSessionId) {
        try {
          await apiClient.mergeGuestCart(guestSessionId);
          sessionStorage.removeItem('guest_session_id');
        } catch (error) {
          console.warn('Failed to merge guest cart:', error);
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    tokenManager.removeToken();
    setUser(null);
    // Generate new guest session for cart
    const newGuestSessionId = `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('guest_session_id', newGuestSessionId);
  };

  const refreshUser = async () => {
    try {
      const userData = await apiClient.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error refreshing user:', error);
      logout();
    }
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}