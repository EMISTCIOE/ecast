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
  const update = useCallback(async (id: string, payload: FormData | Record<string, any>) => {
    const isForm = typeof FormData !== 'undefined' && payload instanceof FormData;
    const res = await fetch('/api/app/notice/update', {
      method: 'PATCH',
      headers: isForm ? { 'Authorization': `Bearer ${localStorage.getItem('access')}`, 'x-notice-id': id } : { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('access')}`, 'x-notice-id': id },
      body: isForm ? (payload as any) : JSON.stringify(payload)
    } as any);
    if (!res.ok) throw new Error('update notice failed');
    return res.json();
  }, []);

  const remove = useCallback(async (id: string) => {
    const res = await fetch('/api/app/notice/delete', {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('access')}`, 'x-notice-id': id }
    });
    if (!res.ok) throw new Error('delete notice failed');
    return true;
  }, []);

  return { list, create, approve, update, remove };
}
