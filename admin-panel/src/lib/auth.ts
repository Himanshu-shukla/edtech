import type { User } from '../types';

const TOKEN_KEY = 'admin_token';
const USER_KEY = 'admin_user';

export const auth = {
  // Store authentication data
  setAuth: (token: string, user: User): void => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Get stored token
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Get stored user
  getUser: (): User | null => {
    const userString = localStorage.getItem(USER_KEY);
    if (!userString) return null;
    
    try {
      return JSON.parse(userString);
    } catch {
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = auth.getToken();
    const user = auth.getUser();
    return !!(token && user);
  },

  // Check if user is admin
  isAdmin: (): boolean => {
    const user = auth.getUser();
    return user?.role === 'admin';
  },

  // Clear authentication data
  logout: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Initialize authentication state from localStorage
  init: (): { isAuthenticated: boolean; user: User | null } => {
    return {
      isAuthenticated: auth.isAuthenticated(),
      user: auth.getUser(),
    };
  },
};
