import axios from 'axios';

const rawBaseURL = import.meta.env.VITE_API_URL || import.meta.env.API_URL || '/api';
const cleanBaseURL = String(rawBaseURL).trim().replace(/\/+$/, '');
const baseURL = cleanBaseURL === '/api' || cleanBaseURL.endsWith('/api')
  ? cleanBaseURL
  : `${cleanBaseURL}/api`;

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
