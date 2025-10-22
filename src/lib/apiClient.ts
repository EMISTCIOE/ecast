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

export async function proxyFetch(path: string, init?: RequestInit) {
  // helper for calling Next API routes uniformly
  const res = await fetch(`/api/app${path}`, init);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

