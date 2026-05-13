import { useState, useEffect } from 'react';

import type { UserRole } from '../services/authService';

interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  picture?: string;
}

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Erro ao inicializar usuário:", error);
      return null;
    }
  });

  // Mantemos o useEffect apenas para sincronizar caso o localStorage mude em outra aba
  useEffect(() => {
    const handleStorageChange = () => {
      const savedUser = localStorage.getItem('user');
      setUser(savedUser ? JSON.parse(savedUser) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { user, isAuthenticated: !!user };
}