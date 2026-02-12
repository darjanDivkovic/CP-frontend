// api.js
import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const api = {
  get(url, config) {
    return http.get(url, config);
  },

  post(url, data, config) {
    return http.post(url, data, config);
  },

  put(url, data, config) {
    return http.put(url, data, config);
  },

  patch(url, data, config) {
    return http.patch(url, data, config);
  },

  delete(url, config) {
    return http.delete(url, config);
  }
};

export default api;