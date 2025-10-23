import { useState, useEffect } from 'react';
import api from '../lib/api';

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // track loading

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) {
      setToken(t);
      api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
    }
    setLoading(false);
  }, []);

  const login = (tokenStr: string) => {
    localStorage.setItem('token', tokenStr);
    setToken(tokenStr);
    api.defaults.headers.common['Authorization'] = `Bearer ${tokenStr}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    delete api.defaults.headers.common['Authorization'];
  };

  const isLoggedIn = !!token;

  return { token, login, logout, isLoggedIn, loading };
}
