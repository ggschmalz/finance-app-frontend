import { api } from './api';
import type { UserRole } from './authService';

export interface User {
  id: number;
  name: string;
  email?: string;
  username?: string;
  role: UserRole;
  date_joined: string;
  updated_at: string;
}

export const userService = {
  getUsers: async (): Promise<User[]> => {
    const { data } = await api.get<User[] | { results: User[] }>('/users/');
    return Array.isArray(data) ? data : (data.results || []);
  },

  updateUserRole: async (userId: number, role: UserRole): Promise<User> => {
    const { data } = await api.patch<User>(`/users/${userId}/`, { role });
    return data;
  },

  deleteUser: async (userId: number): Promise<void> => {
    await api.delete(`/users/${userId}/`);
  }
};
