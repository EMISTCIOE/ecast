import { useCallback } from 'react';

export function useBlogs() {
  const list = useCallback(async (params?: Record<string, any>) => {
    const query = params ? `?${new URLSearchParams(params as any)}` : '';
    const res = await fetch(`/api/app/blog/list${query}`);
    if (!res.ok) throw new Error('list blogs failed');
    return res.json();
  }, []);

  const approve = useCallback(async (slug: string) => {
    const res = await fetch('/api/app/blog/approve', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('access')}` }, body: JSON.stringify({ slug }) });
    if (!res.ok) throw new Error('approve failed');
    return res.json();
  }, []);

  const create = useCallback(async (form: FormData) => {
    const token = localStorage.getItem('access') || '';
    const res = await fetch('/api/app/blog/create', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'x-access-token': `Bearer ${token}` },
      body: form,
    } as any);
    if (!res.ok) throw new Error('create failed');
    return res.json();
  }, []);
  const update = useCallback(async (slug: string, payload: FormData | Record<string, any>) => {
    const isForm = typeof FormData !== 'undefined' && payload instanceof FormData;
    const token = localStorage.getItem('access') || '';
    const res = await fetch('/api/app/blog/update', {
      method: 'PATCH',
      headers: isForm ? { 'Authorization': `Bearer ${token}`, 'x-access-token': `Bearer ${token}`, 'x-blog-slug': slug } : { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'x-access-token': `Bearer ${token}`, 'x-blog-slug': slug },
      body: isForm ? (payload as any) : JSON.stringify(payload)
    } as any);
    if (!res.ok) throw new Error('update blog failed');
    return res.json();
  }, []);

  const remove = useCallback(async (slug: string) => {
    const res = await fetch('/api/app/blog/delete', {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('access')}`, 'x-blog-slug': slug }
    });
    if (!res.ok) throw new Error('delete blog failed');
    return true;
  }, []);

  return { list, approve, create, update, remove };
}
