import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
    console.log('Making API call to:', '/api/auth');
    console.log('Credentials:', credentials);
    try {
      const response = await api.post('/auth', credentials);
      console.log('API Response:', response);
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  forgotPassword: (email, userType) => {
    return api.post('/auth/forgot-password', { email, userType });
  },

  resetPassword: (token, password, userType) => {
    return api.post('/auth/reset-password', { token, password, userType });
  },

  registerStudent: (studentData) => api.post('/auth/student/register', studentData)
};

export default api;