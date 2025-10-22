import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') return res.status(405).end();
  const { id } = req.query as { id?: string };
  const targetId = (req.headers['x-notice-id'] as string) || id;
  if (!targetId) return res.status(400).json({ detail: 'id required' });
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
  const r = await fetch(`${base}/api/notice/notices/${targetId}/`, {
    method: 'DELETE',
    headers: { 'Authorization': (req.headers['authorization'] as string) || '' }
  });
  res.status(r.status).end();
}

