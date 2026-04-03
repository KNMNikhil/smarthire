import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://192.168.68.114:5000/api';

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
  login: (credentials, userType) => {
    const endpoint = userType === 'admin' ? '/auth/admin/login' : '/auth/student/login';
    return api.post(endpoint, credentials);
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