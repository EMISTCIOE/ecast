import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
  const qs = new URLSearchParams(req.query as any).toString();
  let auth = (req.headers['authorization'] as string) || '';
  if (!auth) {
    const token = (req.headers['x-access-token'] as string) || '';
    if (token) auth = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }
  const r = await fetch(`${base}/api/event/events/${qs ? `?${qs}` : ''}`, {
    headers: { 'Authorization': auth }
  });
  const data = await r.json();
  res.status(r.status).json(data);
}
