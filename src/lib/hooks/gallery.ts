import { useCallback } from 'react';
import { authedFetch } from '../apiClient';

export function useGallery() {
  const list = useCallback(async (params?: Record<string, any>) => {
    const query = params ? `?${new URLSearchParams(params as any)}` : '';
    const res = await authedFetch(`/api/app/gallery/list${query}`);
    if (!res.ok) throw new Error('list gallery failed');
    return res.json();
  }, []);

  const create = useCallback(async (form: FormData) => {
    const res = await authedFetch('/api/app/gallery/create', { method: 'POST', body: form } as any);
    if (!res.ok) throw new Error('create gallery failed');
    return res.json();
  }, []);

  const update = useCallback(async (id: string, form: FormData | Record<string, any>) => {
    const isForm = typeof FormData !== 'undefined' && form instanceof FormData;
    const res = await authedFetch('/api/app/gallery/update', {
      method: 'PATCH',
      headers: isForm ? { 'x-gallery-id': id } : { 'Content-Type': 'application/json', 'x-gallery-id': id },
      body: isForm ? (form as any) : JSON.stringify(form),
    } as any);
    if (!res.ok) throw new Error('update gallery failed');
    return res.json();
  }, []);

  const remove = useCallback(async (id: string) => {
    const res = await authedFetch('/api/app/gallery/delete', { method: 'DELETE', headers: { 'x-gallery-id': id } });
    if (!res.ok) throw new Error('delete gallery failed');
    return true;
  }, []);

  const approve = useCallback(async (id: string) => {
    const res = await authedFetch('/api/app/gallery/approve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    if (!res.ok) throw new Error('approve gallery failed');
    return res.json();
  }, []);

  const reject = useCallback(async (id: string) => {
    const res = await authedFetch('/api/app/gallery/reject', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    if (!res.ok) throw new Error('reject gallery failed');
    return res.json();
  }, []);

  return { list, create, update, remove, approve, reject };
}
