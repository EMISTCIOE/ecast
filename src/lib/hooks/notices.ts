import { useCallback } from 'react';
import { authedFetch } from '../apiClient';

export function useNotices() {
  const list = useCallback(async (params?: Record<string, any>) => {
    const query = params ? `?${new URLSearchParams(params as any)}` : '';
    const res = await authedFetch(`/api/app/notice/list${query}`);
    if (!res.ok) throw new Error('list notices failed');
    return res.json();
  }, []);

  const create = useCallback(async (form: FormData) => {
    // Use Next API proxy to avoid CORS and consistently attach auth
    const res = await authedFetch('/api/app/notice/create', { method: 'POST', body: form } as any);
    if (!res.ok) throw new Error('create notice failed');
    return res.json();
  }, []);

  const approve = useCallback(async (id: string) => {
    const res = await authedFetch('/api/app/notice/approve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    if (!res.ok) throw new Error('approve notice failed');
    return res.json();
  }, []);
  const reject = useCallback(async (id: string) => {
    const res = await authedFetch('/api/app/notice/reject', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    if (!res.ok) throw new Error('reject notice failed');
    return res.json();
  }, []);
  const update = useCallback(async (id: string, payload: FormData | Record<string, any>) => {
    const isForm = typeof FormData !== 'undefined' && payload instanceof FormData;
    const res = await authedFetch('/api/app/notice/update', {
      method: 'PATCH',
      headers: isForm ? { 'x-notice-id': id } : { 'Content-Type': 'application/json', 'x-notice-id': id },
      body: isForm ? (payload as any) : JSON.stringify(payload)
    } as any);
    if (!res.ok) throw new Error('update notice failed');
    return res.json();
  }, []);

  const remove = useCallback(async (id: string) => {
    const res = await authedFetch('/api/app/notice/delete', { method: 'DELETE', headers: { 'x-notice-id': id } });
    if (!res.ok) throw new Error('delete notice failed');
    return true;
  }, []);

  return { list, create, approve, reject, update, remove };
}
