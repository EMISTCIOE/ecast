import { useCallback } from 'react';
import { authedFetch } from '../apiClient';

export function useUsers() {
  const list = useCallback(async (params?: Record<string, any>) => {
    const query = params ? `?${new URLSearchParams(params as any)}` : '';
    const token = localStorage.getItem('access') || '';
    let res = await authedFetch(`/api/app/users/unified${query}`);
    if (!res.ok) {
      // Fallback to role list endpoint which also returns all when role is omitted
      res = await authedFetch(`/api/app/users${query}`);
    }
    if (!res.ok) throw new Error('users list failed');
    return res.json();
  }, []);

  const create = useCallback(async (payload: FormData | Record<string, any>) => {
    const isForm = typeof FormData !== 'undefined' && payload instanceof FormData;
    const token = localStorage.getItem('access') || '';
    const res = await authedFetch('/api/app/users/unified', {
      method: 'POST',
      headers: isForm ? {} : { 'Content-Type': 'application/json' },
      body: isForm ? (payload as any) : JSON.stringify(payload)
    } as any);
    if (!res.ok) {
      // try to surface backend validation details
      let msg = 'user create failed';
      try {
        const err = await res.json();
        if (typeof err === 'string') msg = err;
        else if (err?.detail) msg = err.detail;
        else {
          const firstKey = Object.keys(err || {})[0];
          if (firstKey) msg = `${firstKey}: ${Array.isArray(err[firstKey]) ? err[firstKey][0] : err[firstKey]}`;
        }
      } catch {}
      throw new Error(msg);
    }
    return res.json();
  }, []);

  const update = useCallback(async (id: number, payload: FormData | Record<string, any>) => {
    const isForm = typeof FormData !== 'undefined' && payload instanceof FormData;
    const token = localStorage.getItem('access') || '';
    const res = await authedFetch(`/api/app/users/unified/${id}`, {
      method: 'PATCH',
      headers: isForm ? {} : { 'Content-Type': 'application/json' },
      body: isForm ? (payload as any) : JSON.stringify(payload)
    } as any);
    if (!res.ok) throw new Error('user update failed');
    return res.json();
  }, []);

  const remove = useCallback(async (id: number) => {
    const token = localStorage.getItem('access') || '';
    const res = await authedFetch(`/api/app/users/unified/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('user delete failed');
    return true;
  }, []);

  const transform = useCallback(async (payload: { user_id: number; role: 'MEMBER'|'AMBASSADOR'|'ALUMNI'; ambassador_batch_year_bs?: number; alumni_batch_year_bs?: number; }) => {
    const res = await authedFetch('/api/app/users/transform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('transform failed');
    return res.json();
  }, []);

  return { list, create, update, remove, transform };
}
