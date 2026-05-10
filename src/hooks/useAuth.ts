import { useState, useEffect } from 'react';

interface UserProfile {
  name: string;
  email: string;
}

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return { user, isAuthenticated: !!user };
}