import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { id, decision } = req.body as { id: string; decision: 'approve'|'reject' };
  if (!id || !decision) return res.status(400).json({ detail: 'id and decision required' });
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
  const r = await fetch(`${base}/api/tasks/submissions/${id}/${decision}/`, {
    method: 'POST',
    headers: { 'Authorization': req.headers['authorization'] || '' }
  });
  const data = await r.json().catch(()=>({}));
  res.status(r.status).json(data);
}

