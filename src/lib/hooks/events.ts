import { useCallback } from 'react';
import { authedFetch } from '../apiClient';

export function useEvents() {
  const list = useCallback(async (params?: Record<string, any>) => {
    const query = params ? `?${new URLSearchParams(params as any)}` : '';
    const res = await fetch(`/api/app/event/list${query}`);
    if (!res.ok) throw new Error('list events failed');
    return res.json();
  }, []);

  const approve = useCallback(async (slug: string) => {
    const res = await authedFetch('/api/app/event/approve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug }) });
    if (!res.ok) throw new Error('approve event failed');
    return res.json();
  }, []);
  const reject = useCallback(async (slug: string) => {
    const res = await authedFetch('/api/app/event/reject', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug }) });
    if (!res.ok) throw new Error('reject event failed');
    return res.json();
  }, []);

  const create = useCallback(async (form: FormData) => {
    const res = await authedFetch(`/api/app/event/create`, { method: 'POST', body: form } as any);
    if (!res.ok) throw new Error('create event failed');
    return res.json();
  }, []);

  const update = useCallback(async (slug: string, payload: FormData | Record<string, any>) => {
    const isForm = typeof FormData !== 'undefined' && payload instanceof FormData;
    const res = await authedFetch('/api/app/event/update', {
      method: 'PATCH',
      headers: isForm ? { 'x-event-slug': slug } : { 'Content-Type': 'application/json', 'x-event-slug': slug },
      body: isForm ? (payload as any) : JSON.stringify(payload)
    } as any);
    if (!res.ok) throw new Error('update event failed');
    return res.json();
  }, []);

  const remove = useCallback(async (slug: string) => {
    const res = await authedFetch('/api/app/event/delete', { method: 'DELETE', headers: { 'x-event-slug': slug } });
    if (!res.ok) throw new Error('delete event failed');
    return true;
  }, []);

  return { list, approve, reject, create, update, remove };
}
