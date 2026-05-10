import { api } from './api';

export interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    email: string;
    name: string;
    picture: string;
  };
}

export const authService = {
  // Envia o token do Google para o Django validar e devolver o JWT
  googleLogin: async (credential: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/google/', { credential });
    
    // Guarda os tokens no LocalStorage para manter o utilizador logado
    localStorage.setItem('accessToken', data.access);
    localStorage.setItem('refreshToken', data.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    // Não precisamos setar api.defaults.headers.common['Authorization'] aqui
    // pois o interceptador em api.ts já busca o token do localStorage dinamicamente
    
    return data;
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('accessToken');
  }
};
