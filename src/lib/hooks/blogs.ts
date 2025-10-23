import { useCallback } from 'react';
import { authedFetch } from '../apiClient';

export function useBlogs() {
  const list = useCallback(async (params?: Record<string, any>) => {
    const query = params ? `?${new URLSearchParams(params as any)}` : '';
    const res = await authedFetch(`/api/app/blog/list${query}`);
    if (!res.ok) throw new Error('list blogs failed');
    return res.json();
  }, []);

  const approve = useCallback(async (slug: string) => {
    const res = await authedFetch('/api/app/blog/approve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug }) });
    if (!res.ok) throw new Error('approve failed');
    return res.json();
  }, []);
  const reject = useCallback(async (slug: string) => {
    const res = await authedFetch('/api/app/blog/reject', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug }) });
    if (!res.ok) throw new Error('reject failed');
    return res.json();
  }, []);

  const create = useCallback(async (form: FormData) => {
    const res = await authedFetch('/api/app/blog/create', { method: 'POST', body: form } as any);
    if (!res.ok) throw new Error('create failed');
    return res.json();
  }, []);
  const update = useCallback(async (slug: string, payload: FormData | Record<string, any>) => {
    const isForm = typeof FormData !== 'undefined' && payload instanceof FormData;
    const res = await authedFetch('/api/app/blog/update', {
      method: 'PATCH',
      headers: isForm ? { 'x-blog-slug': slug } : { 'Content-Type': 'application/json', 'x-blog-slug': slug },
      body: isForm ? (payload as any) : JSON.stringify(payload)
    } as any);
    if (!res.ok) throw new Error('update blog failed');
    return res.json();
  }, []);

  const remove = useCallback(async (slug: string) => {
    const res = await authedFetch('/api/app/blog/delete', { method: 'DELETE', headers: { 'x-blog-slug': slug } });
    if (!res.ok) throw new Error('delete blog failed');
    return true;
  }, []);

  return { list, approve, reject, create, update, remove };
}
