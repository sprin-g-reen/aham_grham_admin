import React, { createContext, useContext, useState, useEffect } from 'react';

import axios from 'axios';
import { API_URL } from '../config';

interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  updateUser: (userData: Partial<User>) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
    const stored = localStorage.getItem('user');
    if (stored) {
        localStorage.setItem('user', JSON.stringify({ ...JSON.parse(stored), ...userData }));
    }
  };

  const logout = async () => {
    try {
      if (user) {
        // We use a specific timeout or await to ensure the log is sent before the page reloads
        await axios.post(`${API_URL}/admins/logout`, { name: user.name });
      }
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      // Use replace to prevent back-navigation issues
      window.location.replace('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, updateUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
