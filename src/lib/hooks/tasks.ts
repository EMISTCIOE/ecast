import { useCallback } from 'react';
import { authedFetch } from '../apiClient';

export function useTasks() {
  const listAssigned = useCallback(async () => {
    const res = await authedFetch('/api/app/tasks/tasks');
    if (!res.ok) throw new Error('tasks failed');
    return res.json();
  }, []);

  const submit = useCallback(async (form: FormData) => {
    const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
    const res = await authedFetch(`${base}/api/tasks/submissions/`, { method: 'POST', body: form } as any);
    if (!res.ok) throw new Error('submit failed');
    return res.json();
  }, []);

  return { listAssigned, submit };
}
