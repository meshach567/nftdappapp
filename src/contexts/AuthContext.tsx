'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useWeb3 } from './Web3Context';

interface User {
  address: string;
  authenticated: boolean;
  timestamp: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (address: string, signature: string) => Promise<void>;
  logout: () => void;
  verifyToken: () => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { account } = useWeb3();

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      // verifyToken will be called after it's defined
    }
  }, []);

  const login = async (address: string, signature: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // In a real app, you would send this to your backend
      // For demo purposes, we'll simulate the authentication
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          signature,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token: authToken, user: userData } = data;
        
        localStorage.setItem('auth_token', authToken);
        setToken(authToken);
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        throw new Error('Authentication failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to authenticate');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = React.useCallback(() => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  const verifyToken = React.useCallback(async (): Promise<boolean> => {
    try {
      if (!token) return false;

      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
        return true;
      } else {
        logout();
        return false;
      }
    } catch (err) {
      console.error('Token verification error:', err);
      logout();
      return false;
    }
  }, [token, logout]);

  // Auto-login when wallet connects and user has valid token
  useEffect(() => {
    if (account && token && !isAuthenticated) {
      verifyToken();
    }
  }, [account, token, isAuthenticated, verifyToken]);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    token,
    login,
    logout,
    verifyToken,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 