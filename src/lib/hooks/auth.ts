import { useCallback } from 'react';
import { authedFetch } from '../apiClient';

export function useAuth() {
  const login = useCallback(async (username: string, password: string) => {
    const res = await fetch('/api/app/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    localStorage.setItem('access', data.access);
    localStorage.setItem('refresh', data.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  }, []);

  const me = useCallback(async () => {
    const res = await authedFetch('/api/app/auth/me');
    if (!res.ok) throw new Error('me failed');
    return res.json();
  }, []);

  return { login, me };
}
