import { useCallback } from 'react';

export function useGallery() {
  const list = useCallback(async (params?: Record<string, any>) => {
    const query = params ? `?${new URLSearchParams(params as any)}` : '';
    const res = await fetch(`/api/app/gallery/list${query}`);
    if (!res.ok) throw new Error('list gallery failed');
    return res.json();
  }, []);

  const create = useCallback(async (form: FormData) => {
    const res = await fetch('/api/app/gallery/create', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('access')}` },
      body: form,
    } as any);
    if (!res.ok) throw new Error('create gallery failed');
    return res.json();
  }, []);

  const approve = useCallback(async (id: string) => {
    const res = await fetch('/api/app/gallery/approve', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('access')}` }, body: JSON.stringify({ id }) });
    if (!res.ok) throw new Error('approve gallery failed');
    return res.json();
  }, []);

  return { list, create, approve };
}
