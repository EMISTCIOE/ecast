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
    const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
    const res = await fetch(`${base}/api/blog/posts/`, { method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('access')}` }, body: form });
    if (!res.ok) throw new Error('create failed');
    return res.json();
  }, []);

  return { list, approve, create };
}

