import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8085',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    // We assume standard Bearer token scheme if we had tokens,
    // though the current auth controller just returns a String without JWT.
    // If it returns a plain token/string we still pass it for completion.
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
