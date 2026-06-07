import axios from 'axios';

const placeholderValues = [
  'https://api.example.com',
  'https://your-backend-url.com',
  'https://<your-backend-site>.onrender.com',
  'http://localhost:4000',
];

const envBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const isValidBaseUrl = envBaseUrl && !placeholderValues.includes(envBaseUrl) && !envBaseUrl.includes('<');

const baseURL = isValidBaseUrl
  ? envBaseUrl
  : import.meta.env.PROD
  ? 'https://blog-manager1-backend.onrender.com'
  : 'http://localhost:4000';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
