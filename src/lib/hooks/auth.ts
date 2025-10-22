import { useCallback } from 'react';

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
    const res = await fetch('/api/app/auth/me', { headers: { 'Authorization': `Bearer ${localStorage.getItem('access')}` } });
    if (!res.ok) throw new Error('me failed');
    return res.json();
  }, []);

  return { login, me };
}

