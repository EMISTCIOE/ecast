import { useCallback } from 'react';

export function useEvents() {
  const list = useCallback(async (params?: Record<string, any>) => {
    const query = params ? `?${new URLSearchParams(params as any)}` : '';
    const res = await fetch(`/api/app/event/list${query}`);
    if (!res.ok) throw new Error('list events failed');
    return res.json();
  }, []);

  const approve = useCallback(async (slug: string) => {
    const res = await fetch('/api/app/event/approve', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('access')}` }, body: JSON.stringify({ slug }) });
    if (!res.ok) throw new Error('approve event failed');
    return res.json();
  }, []);

  const create = useCallback(async (form: FormData) => {
    const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
    const res = await fetch(`${base}/api/event/events/`, { method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('access')}` }, body: form });
    if (!res.ok) throw new Error('create event failed');
    return res.json();
  }, []);

  return { list, approve, create };
}

