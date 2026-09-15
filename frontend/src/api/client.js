import axios from 'axios';

const rawBaseURL = import.meta.env.VITE_API_URL || import.meta.env.API_URL || '/api';
const cleanBaseURL = String(rawBaseURL).trim().replace(/\/+$/, '');
const baseURL = cleanBaseURL === '/api' || cleanBaseURL.endsWith('/api')
  ? cleanBaseURL
  : `${cleanBaseURL}/api`;

const api = axios.create({
  baseURL,
});


// Attach Authorization header if JWT token exists in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
