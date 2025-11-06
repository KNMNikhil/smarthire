import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (credentials, userType) => {
    console.log('Login attempt:', credentials, userType);
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Login failed: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Login success:', data);
      return { data };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  forgotPassword: (email, userType) => {
    return api.post('/auth/forgot-password', { email, userType });
  },

  resetPassword: (token, password, userType) => {
    return api.post('/auth/reset-password', { token, password, userType });
  },

  registerStudent: async (studentData) => {
    try {
      const response = await fetch('/api/auth/student/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      
      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
};

export default api;