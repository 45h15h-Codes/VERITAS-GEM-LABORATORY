import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  user: { email: string } | null;
}
const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    const authStatus = localStorage.getItem('jewelry_admin_auth');
    const userEmail = localStorage.getItem('jewelry_admin_email');
    if (authStatus === 'true' && userEmail) {
      setIsAuthenticated(true);
      setUser({ email: userEmail });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/admin/login`, {
        email,
        password,
      });
      if (res.data && res.data.token) {
        setIsAuthenticated(true);
        setUser({ email });
        localStorage.setItem('jewelry_admin_auth', 'true');
        localStorage.setItem('jewelry_admin_email', email);
        localStorage.setItem('jewelry_admin_token', res.data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed');
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('jewelry_admin_auth');
    localStorage.removeItem('jewelry_admin_email');
    localStorage.removeItem('jewelry_admin_token');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
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
