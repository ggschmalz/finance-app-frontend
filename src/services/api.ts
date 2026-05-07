import axios from 'axios';

export const api = axios.create({
  // Trocamos a porta 3001 (JSON Server) pela 8000 (Django)
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptadores (Úteis para injetar tokens de autenticação no futuro)
api.interceptors.request.use((config) => {
  // const token = localStorage.getItem('token');
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});