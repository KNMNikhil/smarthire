import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (credentials, userType) => {
    try {
      console.log('AuthContext login called with:', { credentials, userType });
      const response = await authService.login(credentials, userType);
      console.log('AuthService response:', response);
      
      if (response && response.data) {
        const { token, user } = response.data;
        console.log('Extracted token:', token);
        console.log('Extracted user:', user);
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        
        return response;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('AuthContext login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const forgotPassword = async (email, userType) => {
    return await authService.forgotPassword(email, userType);
  };

  const resetPassword = async (token, password, userType) => {
    return await authService.resetPassword(token, password, userType);
  };

  const value = {
    user,
    login,
    logout,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStudent: user?.role === 'student'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};