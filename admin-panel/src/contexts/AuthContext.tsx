import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginCredentials, AuthContextType } from '../types';
import { authApi } from '../lib/api';
import { auth } from '../lib/auth';
import { AuthContext } from './AuthContextCreator';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state from localStorage
    const { isAuthenticated, user: storedUser } = auth.init();
    if (isAuthenticated && storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      const response = await authApi.login(credentials);
      
      if (response.success && response.data) {
        const { token, user: userData } = response.data;
        
        // Check if user is admin
        if (userData.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        // Store auth data
        auth.setAuth(token, userData);
        setUser(userData);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      // Clean up any partial auth state
      auth.logout();
      setUser(null);
      throw error;
    }
  };

  const logout = (): void => {
    auth.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
