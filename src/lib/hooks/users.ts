import { useCallback } from 'react';

export function useUsers() {
  const list = useCallback(async () => {
    const token = localStorage.getItem('access') || '';
    let res = await fetch('/api/app/users/unified', {
      headers: { 'Authorization': `Bearer ${token}`, 'x-access-token': `Bearer ${token}` }
    });
    if (!res.ok) {
      // Fallback to role list endpoint which also returns all when role is omitted
      res = await fetch('/api/app/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    }
    if (!res.ok) throw new Error('users list failed');
    return res.json();
  }, []);

  const create = useCallback(async (payload: FormData | Record<string, any>) => {
    const isForm = typeof FormData !== 'undefined' && payload instanceof FormData;
    const token = localStorage.getItem('access') || '';
    const res = await fetch('/api/app/users/unified', {
      method: 'POST',
      headers: isForm ? { 'Authorization': `Bearer ${token}`, 'x-access-token': `Bearer ${token}` } : { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'x-access-token': `Bearer ${token}` },
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
    const res = await fetch(`/api/app/users/unified/${id}`, {
      method: 'PATCH',
      headers: isForm ? { 'Authorization': `Bearer ${token}`, 'x-access-token': `Bearer ${token}` } : { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'x-access-token': `Bearer ${token}` },
      body: isForm ? (payload as any) : JSON.stringify(payload)
    } as any);
    if (!res.ok) throw new Error('user update failed');
    return res.json();
  }, []);

  const remove = useCallback(async (id: number) => {
    const token = localStorage.getItem('access') || '';
    const res = await fetch(`/api/app/users/unified/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}`, 'x-access-token': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('user delete failed');
    return true;
  }, []);

  return { list, create, update, remove };
}
