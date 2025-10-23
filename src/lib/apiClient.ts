import axios from 'axios';

const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

export const api = axios.create({ baseURL: base });

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers = config.headers || {};
      (config.headers as any)['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});

// In-browser token refresh
let refreshing: Promise<string | null> | null = null;
async function refreshAccess(): Promise<string | null> {
  if (refreshing) return refreshing;
  refreshing = (async () => {
    try {
      const refresh = localStorage.getItem('refresh');
      if (!refresh) return null;
      const r = await fetch('/api/app/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });
      if (!r.ok) return null;
      const data = await r.json();
      if (data?.access) {
        localStorage.setItem('access', data.access);
        return data.access as string;
      }
      return null;
    } finally {
      refreshing = null;
    }
  })();
  return refreshing;
}

export async function authedFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access') : null;
  const headers = new Headers(init.headers as HeadersInit);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  // Also pass through to help certain proxies carry the token
  if (token) headers.set('x-access-token', `Bearer ${token}`);
  const res = await fetch(input, { ...init, headers });
  if (res.status !== 401) return res;
  // Try refresh once
  const newAccess = await refreshAccess();
  if (!newAccess) return res; // let caller handle 401
  const retryHeaders = new Headers(init.headers as HeadersInit);
  retryHeaders.set('Authorization', `Bearer ${newAccess}`);
  retryHeaders.set('x-access-token', `Bearer ${newAccess}`);
  return fetch(input, { ...init, headers: retryHeaders });
}

export async function proxyFetch(path: string, init?: RequestInit) {
  const res = await authedFetch(`/api/app${path}`, init);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
