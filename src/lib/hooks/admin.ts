import { useCallback } from 'react';

export function useAdmin() {
  const listUsers = useCallback(async (role: string) => {
    const query = `?${new URLSearchParams({ role })}`;
    const res = await fetch(`/api/app/users${query}`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('access')}` } });
    if (!res.ok) throw new Error('users failed');
    return res.json();
  }, []);

  const createCommitteeMember = useCallback(async (payload: any) => {
    const res = await fetch('/api/app/auth/committee/create', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('access')}` }, body: JSON.stringify(payload) });
    if (!res.ok) throw new Error('committee failed');
    return res.json();
  }, []);

  const createUser = useCallback(async (payload: any) => {
    const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
    const isForm = typeof FormData !== 'undefined' && payload instanceof FormData;
    const res = await fetch(`${base}/api/auth/unified/`, {
      method: 'POST',
      headers: isForm ? { 'Authorization': `Bearer ${localStorage.getItem('access')}` } : { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('access')}` },
      body: isForm ? payload : JSON.stringify(payload)
    } as any);
    if (!res.ok) throw new Error('user create failed');
    return res.json();
  }, []);

  const pendingSubmissions = useCallback(async () => {
    const res = await fetch('/api/app/tasks/submissions?status=PENDING', { headers: { 'Authorization': `Bearer ${localStorage.getItem('access')}` } });
    if (!res.ok) throw new Error('pending submissions failed');
    return res.json();
  }, []);

  const reviewSubmission = useCallback(async (id: string, decision: 'approve'|'reject') => {
    const res = await fetch('/api/app/tasks/review', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('access')}` }, body: JSON.stringify({ id, decision }) });
    if (!res.ok) throw new Error('review failed');
    return res.json();
  }, []);

  const createTask = useCallback(async (payload: { title: string; description: string; assigned_to: string; due_date?: string; }) => {
    const res = await fetch('/api/app/tasks/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('access')}` }, body: JSON.stringify(payload) });
    if (!res.ok) throw new Error('task create failed');
    return res.json();
  }, []);

  return { listUsers, createCommitteeMember, createUser, pendingSubmissions, reviewSubmission, createTask };
}
