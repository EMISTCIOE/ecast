import { useCallback } from 'react';

export function useTasks() {
  const listAssigned = useCallback(async () => {
    const res = await fetch('/api/app/tasks/tasks', { headers: { 'Authorization': `Bearer ${localStorage.getItem('access')}` } });
    if (!res.ok) throw new Error('tasks failed');
    return res.json();
  }, []);

  const submit = useCallback(async (form: FormData) => {
    const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
    const res = await fetch(`${base}/api/tasks/submissions/`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('access')}` },
      body: form,
    });
    if (!res.ok) throw new Error('submit failed');
    return res.json();
  }, []);

  return { listAssigned, submit };
}

