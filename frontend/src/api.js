import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://blog-manager1-backend.onrender.com' : 'http://localhost:4000');

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
