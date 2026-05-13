import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador de Requisição para injetar o token dinamicamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptador de Resposta para lidar com erro 401 e 403
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.warn("Sessão expirada. Limpando dados e redirecionando...");
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      } else if (error.response.status === 403) {
        try {
          const userStr = localStorage.getItem('user');
          const user = userStr ? JSON.parse(userStr) : {};
          if (user.role === 'UNASSIGNED') {
            console.warn("Acesso proibido. Usuário sem atribuição. Redirecionando para /waiting...");
            window.location.href = '/waiting';
          }
        } catch (e) {
          console.error("Erro ao processar erro 403:", e);
        }
      }
    }
    return Promise.reject(error);
  }
);
