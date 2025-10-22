import { useCallback } from 'react';

export function useNotices() {
  const list = useCallback(async (params?: Record<string, any>) => {
    const query = params ? `?${new URLSearchParams(params as any)}` : '';
    const res = await fetch(`/api/app/notice/list${query}`);
    if (!res.ok) throw new Error('list notices failed');
    return res.json();
  }, []);

  const create = useCallback(async (form: FormData) => {
    // Use Next API proxy to avoid CORS and consistently attach auth
    const res = await fetch('/api/app/notice/create', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('access')}` },
      body: form,
    } as any);
    if (!res.ok) throw new Error('create notice failed');
    return res.json();
  }, []);

  const approve = useCallback(async (id: string) => {
    const res = await fetch('/api/app/notice/approve', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('access')}` }, body: JSON.stringify({ id }) });
    if (!res.ok) throw new Error('approve notice failed');
    return res.json();
  }, []);

  return { list, create, approve };
}
